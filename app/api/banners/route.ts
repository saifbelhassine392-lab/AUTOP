import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position') || 'home_hero';

    const banners = await prisma.banner.findMany({
      where: {
        position,
        isActive: true,
        OR: [
          { startAt: null, endAt: null },
          {
            AND: [
              { startAt: { lte: new Date() } },
              { endAt: { gte: new Date() } },
            ],
          },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Banners error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}