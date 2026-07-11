import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    }

    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Général',
          slug: 'general',
        }
      });
    }

    for (const prod of products) {
      const price = parseFloat(prod.sellingPrice) || 0;
      const oldPrice = parseFloat(prod.costPrice) || 0;
      const reference = prod.reference;
      const name = prod.designation || 'Article ' + reference;
      const slug = slugify(name) + '-' + reference;
      const stock = parseInt(prod.stockQty) || 5;

      await prisma.product.upsert({
        where: { reference },
        update: {
          name,
          price,
          oldPrice,
          stock,
        },
        create: {
          reference,
          sku: reference,
          name,
          slug,
          price,
          oldPrice,
          stock,
          status: 'ACTIVE',
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Bulk Fail' }, { status: 500 });
  }
}
