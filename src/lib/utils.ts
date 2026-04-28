import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
}

export const WHATSAPP_NUMBER = "255700000000"; // Placeholder for UniPlug

export function generateWhatsAppLink(productName: string, quantity: number, location: string) {
  const message = `Habari UniPlug! Nataka kuagiza:\n- **${productName}**\n- Idadi: ${quantity}\n- Eneo: ${location}\n\nAhsante!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
