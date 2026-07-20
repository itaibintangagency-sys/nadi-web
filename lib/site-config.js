// lib/site-config.js
// Ganti nilai di bawah ini sesuai kontak asli sebelum go-live.
// Bisa juga di-override lewat environment variable kalau mau beda per environment.

export const siteConfig = {
  productName: 'Nadi',
  tagline: 'Brand Intelligence untuk merek Indonesia',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628000000000', // format: 62xxxxxxxxxx, TANPA tanda +
  telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'nadi_admin', // TANPA @
  whatsappMessage: 'Halo, saya ingin tahu lebih lanjut tentang Nadi.',
};

export function getWhatsappUrl() {
  const text = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function getTelegramUrl() {
  return `https://t.me/${siteConfig.telegramUsername}`;
}
