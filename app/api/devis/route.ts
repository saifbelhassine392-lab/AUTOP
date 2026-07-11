import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Mes devis (client) ou tous (admin)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const user = session.user as any
    const where = user.role === 'ADMIN' ? {} : { userId: user.id }

    const devis = await prisma.devis.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(devis)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un devis (client ou admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const user = session.user as any
    const body = await req.json()
    const { vehicleBrand, vehicleModel, vehicleYear, vehicleVin, notes, items, clientEmail, quoteId } = body

    let targetUserId = user.id

    // Si c'est l'admin qui crée le devis pour un client
    if (user.role === 'ADMIN' && clientEmail) {
      const clientUser = await prisma.user.findFirst({
        where: { email: { equals: clientEmail, mode: 'insensitive' } }
      })
      if (!clientUser) {
        return NextResponse.json({ error: 'Aucun utilisateur client trouvé avec cet e-mail. Le client doit d\'abord s\'inscrire.' }, { status: 404 })
      }
      targetUserId = clientUser.id
    }

    const devis = await prisma.devis.create({
      data: {
        userId: targetUserId,
        vehicleBrand,
        vehicleModel,
        vehicleYear: parseInt(vehicleYear) || null,
        vehicleVin,
        notes,
        status: user.role === 'ADMIN' ? 'completed' : 'pending', // directement traité si fait par admin
        totalPrice: user.role === 'ADMIN' ? parseFloat(body.totalPrice) || 0 : 0,
        responseNote: user.role === 'ADMIN' ? body.responseNote || 'Proposition commerciale établie par l\'administrateur.' : null,
        items: {
          create: items.map((item: any) => ({
            name: item.name || item.designation,
            price: parseFloat(item.price || item.puHT) || 0,
            quantity: parseInt(item.quantity || item.qty) || 1,
            discount: parseFloat(item.discount) || 0
          })),
        },
      },
      include: { items: true },
    })

    // Mettre à jour la demande de devis d'origine en statut TREATED
    if (quoteId) {
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'TREATED' }
      })
    }

    return NextResponse.json(devis, { status: 201 })
  } catch (error) {
    console.error('Error creating devis:', error)
    return NextResponse.json({ error: 'Erreur création devis' }, { status: 500 })
  }
}