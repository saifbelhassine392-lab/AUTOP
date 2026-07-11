import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10' as any,
  typescript: true,
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'eur',
  metadata?: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export async function createCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name,
  });
}

export async function constructEvent(payload: string, signature: string, secret: string) {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}