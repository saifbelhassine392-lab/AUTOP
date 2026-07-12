import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const role = (session.user as any).role;
  const isAdmin = role === 'admin' || role === 'ADMIN' || role === 'PROFESSIONAL';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Accès réservé' }, { status: 403 });
  }

  try {
    const { name, action, password } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Nom du profil requis' }, { status: 400 });
    }

    let profile = await prisma.adminProfile.findUnique({
      where: { name }
    });

    // Créer le profil s'il n'existe pas encore
    if (!profile) {
      profile = await prisma.adminProfile.create({
        data: { name }
      });
    }

    if (action === 'check') {
      return NextResponse.json({ 
        success: true, 
        hasPassword: !!profile.password 
      });
    }

    if (action === 'set') {
      if (profile.password) {
        return NextResponse.json({ error: 'Mot de passe déjà configuré' }, { status: 400 });
      }
      if (!password || password.trim().length === 0) {
        return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 400 });
      }
      
      const updated = await prisma.adminProfile.update({
        where: { name },
        data: { password: password.trim() }
      });

      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === 'verify') {
      if (!profile.password) {
        return NextResponse.json({ error: 'Aucun mot de passe configuré pour ce profil' }, { status: 400 });
      }
      const matches = profile.password === password?.trim();
      return NextResponse.json({ success: matches, error: matches ? null : 'Mot de passe incorrect' });
    }

    return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
