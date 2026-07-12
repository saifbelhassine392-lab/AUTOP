import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper: check if user is admin (handles all role variants)
function isAdminRole(role: string | undefined): boolean {
  if (!role) return false;
  const r = role.toUpperCase();
  return r === 'ADMIN' || r === 'PROFESSIONAL';
}

// GET - Charger les conversations / messages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const user = session.user as any;
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId');

    // Si admin
    if (isAdminRole(user.role)) {
      if (targetUserId) {
        // Charger tous les messages pour cet utilisateur
        const messages = await prisma.chatMessage.findMany({
          where: { userId: targetUserId },
          orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json({ success: true, data: messages });
      } else {
        // Liste de toutes les conversations actives (utilisateurs uniques ayant envoyé/reçu des messages)
        const conversations = await prisma.chatMessage.findMany({
          distinct: ['userId'],
          orderBy: { userId: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        // Pour chaque conversation, récupérer le dernier message
        const data = await Promise.all(
          conversations.map(async (c) => {
            const lastMsg = await prisma.chatMessage.findFirst({
              where: { userId: c.userId },
              orderBy: { createdAt: 'desc' }
            });
            return {
              userId: c.userId,
              user: c.user,
              lastMessage: lastMsg
            };
          })
        );

        // Trier par date du dernier message descendant
        data.sort((a: any, b: any) => {
          return new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime();
        });

        return NextResponse.json({ success: true, data });
      }
    } else {
      // Si client normal : charger uniquement ses propres messages
      const messages = await prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json({ success: true, data: messages });
    }
  } catch (error: any) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Envoyer un message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const user = session.user as any;
    const body = await req.json();
    const { content, reference, userId, senderName: providedSenderName, attachment } = body;

    if ((!content || content.trim() === '') && !attachment) {
      return NextResponse.json({ success: false, error: 'Le contenu du message ou une pièce jointe est requis' }, { status: 400 });
    }

    let finalUserId = user.id;
    let isAdmin = false;

    if (isAdminRole(user.role)) {
      isAdmin = true;
      if (!userId) {
        return NextResponse.json({ success: false, error: 'Identifiant client requis pour répondre' }, { status: 400 });
      }
      finalUserId = userId;
    }

    // For admin replies, use the provided senderName (active profile name like SAIF/AMINE/SAIFALLAH)
    const resolvedSenderName = isAdmin && providedSenderName
      ? providedSenderName
      : user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur';

    const message = await prisma.chatMessage.create({
      data: {
        userId: finalUserId,
        senderId: user.id,
        senderName: resolvedSenderName,
        isAdmin,
        content: content || '',
        reference: reference || null,
        attachmentData: attachment?.data || null,
        attachmentName: attachment?.name || null,
        attachmentType: attachment?.type || null
      }
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
