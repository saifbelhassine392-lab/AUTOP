import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Non authentifie' }, { status: 401 });
    }
    const user = session.user as any;

    const { amount, orderId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Montant invalide' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: {
        orderId,
        userId: user.id,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ success: false, error: 'Erreur paiement' }, { status: 500 });
  }
}