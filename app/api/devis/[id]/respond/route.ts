import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const user = session.user as any
  const isAuthorized = user.role === 'ADMIN' || user.role === 'PROFESSIONAL'
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const { items, responseNote, totalPrice } = await req.json()

    // Formater la réponse pour y inclure automatiquement le nom et le numéro de téléphone de l'admin
    const fullResponseNote = `${responseNote || ''}\n\n---\n🛠️ Devis préparé par : ${user.name || 'AUTOP'} (Tél : ${user.phone || 'N/A'})`

    // Mettre à jour les items avec les prix proposés
    for (const item of items) {
      await prisma.devisItem.update({
        where: { id: item.id },
        data: {
          price: item.price,
          productId: item.productId || null,
        },
      })
    }

    const devis = await prisma.devis.update({
      where: { id: params.id },
      data: {
        status: 'completed',
        totalPrice,
        responseNote: fullResponseNote,
      },
      include: { items: { include: { product: true } }, user: true },
    })

    // Insérer l'historique de chaque pièce (si fourni par le frontend)
    if (items && items.length > 0) {
      const historiqueData = items
        .filter((item: any) => item.historique) // on s'assure qu'un historique est fourni
        .map((item: any) => ({
          devisId: params.id,
          devisItemId: item.id,
          oemSupplierId: item.historique.oemSupplierId || null,
          oemPurchasePrice: item.historique.oemPurchasePrice || null,
          oemSellingPrice: item.historique.oemSellingPrice || null,
          amSupplierId: item.historique.amSupplierId || null,
          amPurchasePrice: item.historique.amPurchasePrice || null,
          amSellingPrice: item.historique.amSellingPrice || null,
        }))

      if (historiqueData.length > 0) {
        await prisma.historiquePiece.createMany({
          data: historiqueData,
        })
      }
    }

    return NextResponse.json(devis)
  } catch (error) {
    console.error('Devis respond error:', error)
    return NextResponse.json({ error: 'Erreur lors du traitement' }, { status: 500 })
  }
}