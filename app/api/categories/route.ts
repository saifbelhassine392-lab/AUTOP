import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { status: 'ACTIVE' } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}