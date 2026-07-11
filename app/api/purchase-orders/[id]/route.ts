import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PROFESSIONAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const currentPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!currentPO) {
      return NextResponse.json({ error: 'Bon de commande introuvable' }, { status: 404 });
    }

    // Si le nouveau statut est RECEIVED (livré) et qu'il n'était pas déjà livré
    if (status === 'RECEIVED' && currentPO.status !== 'RECEIVED') {
      // Pour chaque article de la commande, on incrémente le stock du produit correspondant
      for (const item of currentPO.items) {
        if (item.reference) {
          const product = await prisma.product.findUnique({
            where: { reference: item.reference }
          });

          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: {
                stock: product.stock + item.quantity
              }
            });
          }
        }
      }
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: { items: true, supplier: true }
    });

    return NextResponse.json({ success: true, data: updatedPO });
  } catch (err) {
    console.error('Update PO error:', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
