import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  attachments?: {
    filename: string;
    content: string; // Base64 string
  }[];
}

export async function sendEmail({ to, subject, html, from, attachments }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configure - Email simule');
    console.log('📧 Email simule:', { to, subject, attachmentsCount: attachments?.length || 0 });
    return { id: 'simulated', success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'AUTOP <contact@autop.tn>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments,
    });
    if (error) {
      throw new Error(error.message);
    }
    return { id: data?.id || 'unknown', success: true };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
}

export function orderConfirmationTemplate(orderNumber: string, total: number, items: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Confirmation de commande</h1>
      <p>Bonjour,</p>
      <p>Votre commande <strong>${orderNumber}</strong> a bien ete recue.</p>
      <p>Montant total: <strong>${total.toFixed(2)} EUR</strong></p>
      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
        ${items}
      </div>
      <p>Nous vous tiendrons informe de l'avancement de votre commande.</p>
      <p style="color: #666;">L'equipe AUTOP</p>
    </div>
  `;
}

export function quoteEmailTemplate(quoteNumber: string, total: number, validUntil: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Votre devis AUTOP</h1>
      <p>Bonjour,</p>
      <p>Veuillez trouver ci-joint votre devis <strong>${quoteNumber}</strong>.</p>
      <p>Montant total TTC: <strong>${total.toFixed(2)} EUR</strong></p>
      <p>Ce devis est valable jusqu'au <strong>${validUntil}</strong>.</p>
      <p style="color: #666;">L'equipe AUTOP</p>
    </div>
  `;
}