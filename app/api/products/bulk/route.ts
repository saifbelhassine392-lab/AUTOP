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
      const reference = String(prod.reference || '').trim();
      if (!reference) continue;

      const price = parseFloat(prod.sellingPrice) || 0;
      const costPrice = parseFloat(prod.costPrice) || 0;
      const name = prod.designation || 'Article ' + reference;
      const slug = slugify(name) + '-' + reference + '-' + Date.now().toString().slice(-4);
      const stock = parseInt(prod.stock) || 0;
      const brand = prod.brand || '';
      const vehicleCompat = prod.vehicleCompat || '';

      await prisma.product.upsert({
        where: { reference },
        update: {
          name,
          price,
          costPrice,
          stock,
          brand,
          vehicleCompat,
        },
        create: {
          reference,
          sku: reference,
          name,
          slug,
          price,
          costPrice,
          stock,
          brand,
          vehicleCompat,
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
