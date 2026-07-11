import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cartItemSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brandModel: true, // Dans notre nouveau schéma, relation renommée en brandModel
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transformer le résultat pour avoir compatible avec le frontend qui s'attend à product.brand en tant que string
    const formattedItems = cartItems.map(item => {
      const product = item.product;
      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          brand: product.brand || (product as any).brandModel?.name || '', // Fournit le champ brand en tant que string
        }
      };
    });

    const total = formattedItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return NextResponse.json(formattedItems); // Le contexte panier s'attend directement au tableau
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const body = await req.json();
    const result = cartItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Données invalides' }, { status: 400 });
    }

    const { productId, quantity } = result.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, trackStock: true, status: true },
    });

    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Produit non disponible' }, { status: 400 });
    }

    if (product.trackStock && product.stock < quantity) {
      return NextResponse.json({ success: false, error: 'Stock insuffisant' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });

    return NextResponse.json({ success: true, data: cartItem, message: 'Produit ajouté au panier' });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id, quantity } = await req.json();

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Article retiré du panier' });
    }

    // S'assurer que le panier appartient bien à l'utilisateur
    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 403 });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, data: cartItem, message: 'Quantité mise à jour' });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // S'assurer que l'item appartient à l'utilisateur
      const existing = await prisma.cartItem.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 403 });
      }
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Article retiré' });
    }

    // Vider tout le panier
    await prisma.cartItem.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true, message: 'Panier vidé' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}