import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ success: false, error: "Référence requise" }, { status: 400 });
    }

    const histories = await prisma.partPriceHistory.findMany({
      where: {
        reference: {
          equals: reference,
          mode: 'insensitive' // Recherche insensible à la casse
        }
      },
      include: {
        supplier: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: histories });
  } catch (error) {
    console.error("Erreur API historique-prix GET:", error);
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { reference, supplierId, supplierName, purchasePrice, sellingPrice, isConcessionnaire } = data;

    if (!reference) {
      return NextResponse.json({ success: false, error: "Référence requise" }, { status: 400 });
    }

    // Chercher si un historique existe déjà pour cette ref + fournisseur (ou concessionnaire)
    let existingHistory;

    if (supplierId) {
      existingHistory = await prisma.partPriceHistory.findFirst({
        where: { reference, supplierId }
      });
    } else if (isConcessionnaire) {
      existingHistory = await prisma.partPriceHistory.findFirst({
        where: { reference, isConcessionnaire: true }
      });
    }

    let record;
    if (existingHistory) {
      // Mettre à jour
      record = await prisma.partPriceHistory.update({
        where: { id: existingHistory.id },
        data: {
          purchasePrice: purchasePrice ?? existingHistory.purchasePrice,
          sellingPrice: sellingPrice ?? existingHistory.sellingPrice,
          supplierName: supplierName ?? existingHistory.supplierName,
        }
      });
    } else {
      // Créer
      record = await prisma.partPriceHistory.create({
        data: {
          reference,
          supplierId,
          supplierName,
          purchasePrice,
          sellingPrice,
          isConcessionnaire: !!isConcessionnaire
        }
      });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Erreur API historique-prix POST:", error);
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 });
  }
}
