import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const where: any = { status: 'ACTIVE' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy: { reference: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Auto-fill SKU and slug if not provided
    const reference = body.reference || 'REF-' + Date.now();
    const sku = body.sku || reference;
    const name = body.name || body.designation;
    const slug = body.slug || (slugify(name) + '-' + reference);

    let categoryId = body.categoryId;
    if (!categoryId) {
      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: 'Général',
            slug: 'general',
          }
        });
      }
      categoryId = category.id;
    }

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        slug,
        description: body.description,
        price: parseFloat(body.price) || parseFloat(body.sellingPrice) || 0,
        oldPrice: parseFloat(body.oldPrice) || parseFloat(body.costPrice) || null,
        stock: parseInt(body.stock) || parseInt(body.stockQty) || 0,
        images: body.images || [],
        reference,
        brand: body.brand,
        categoryId,
        status: body.status || 'ACTIVE',
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Erreur creation produit' }, { status: 500 });
  }
}