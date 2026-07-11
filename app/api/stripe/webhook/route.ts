import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') || '';

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
              statusHistory: {
                create: {
                  status: 'CONFIRMED',
                  note: `Paiement recu via Stripe (ID: ${paymentIntent.id})`,
                },
              },
            },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'FAILED',
              statusHistory: {
                create: {
                  status: 'PENDING',
                  note: `Echec du paiement: ${paymentIntent.last_payment_error?.message || 'Raison inconnue'}`,
                },
              },
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}