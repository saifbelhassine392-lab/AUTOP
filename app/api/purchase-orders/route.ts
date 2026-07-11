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
            reference: it.reference || '',
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
