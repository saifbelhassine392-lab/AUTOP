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

// POST - Créer un devis (client)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const user = session.user as any
    const { vehicleBrand, vehicleModel, vehicleYear, vehicleVin, notes, items } = await req.json()

    const devis = await prisma.devis.create({
      data: {
        userId: user.id,
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehicleVin,
        notes,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: 0,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(devis, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création devis' }, { status: 500 })
  }
}