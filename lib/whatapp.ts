export function generateWhatsAppMessage(quoteNumber: string, total: number, items: string[]): string {
  const lines = [
    '*📋 Devis AUTOP*',
    '',
    `N°: ${quoteNumber}`,
    `Total: ${total.toFixed(2)} EUR`,
    '',
    '*Articles:*',
    ...items.map(item => `• ${item}`),
    '',
    'Pour confirmer, repondez a ce message.',
    'Merci ! 🚗',
  ];
  return lines.join('\n');
}

export function getWhatsAppLink(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}