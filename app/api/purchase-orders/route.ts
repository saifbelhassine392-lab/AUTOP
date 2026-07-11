import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

function genOrderNumber() {
  return 'BC-' + Date.now().toString().slice(-8).toUpperCase();
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId');

    const where = supplierId ? { supplierId } : {};

    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: { select: { name: true, phone: true, email: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'PROFESSIONAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const { supplierId, items, notes, status } = body;

    if (!supplierId || !items?.length) {
      return NextResponse.json({ error: 'Fournisseur et articles requis' }, { status: 400 });
    }

    // Auto-enregistrement des articles inexistants en stock
    for (const it of items) {
      if (it.reference) {
        const refNormalized = it.reference.trim().toUpperCase();
        const existing = await prisma.product.findUnique({
          where: { reference: refNormalized }
        });

        if (!existing) {
          // Trouver ou créer une catégorie par défaut
          let category = await prisma.category.findFirst();
          if (!category) {
            category = await prisma.category.create({
              data: {
                name: 'Général',
                slug: 'general',
              }
            });
          }

          // Création du produit dans le catalogue
          await prisma.product.create({
            data: {
              sku: refNormalized,
              reference: refNormalized,
              name: it.designation || 'Nouvel Article',
              slug: `${(it.designation || 'nouvel-article').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${refNormalized.toLowerCase()}`,
              price: (parseFloat(it.unitPrice) || 0) * 1.25, // prix de vente par défaut (+25% marge)
              costPrice: parseFloat(it.unitPrice) || 0,
              stock: 0,
              categoryId: category.id,
              status: 'ACTIVE'
            }
          });
        }
      }
    }

    const totalAmount = items.reduce((sum: number, it: any) => sum + (it.quantity * it.unitPrice), 0);

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: genOrderNumber(),
        supplierId,
        status: status || 'DRAFT',
        totalAmount,
        notes,
        items: {
          create: items.map((it: any) => ({
            reference: it.reference?.trim().toUpperCase() || '',
            designation: it.designation,
            quantity: it.quantity || 1,
            unitPrice: it.unitPrice || 0,
            total: (it.quantity || 1) * (it.unitPrice || 0)
          }))
        }
      },
      include: { items: true, supplier: true }
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    console.error('PurchaseOrder POST error:', err);
    return NextResponse.json({ error: 'Erreur création bon de commande' }, { status: 500 });
  }
}
