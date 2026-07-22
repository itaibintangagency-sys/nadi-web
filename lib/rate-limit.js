// lib/rate-limit.js
// Rate limiting berbasis Supabase (bukan in-memory) — supaya tetap akurat
// walau tiap request bisa kena instance serverless yang berbeda-beda.

import { createAdminClient } from '@/lib/supabase-admin';

/**
 * Cek & catat rate limit untuk sebuah key.
 * @param {string} key - identifier unik (mis. `invite:${userId}`, `forgot:${ip}`)
 * @param {number} limit - jumlah maksimal request yang diizinkan dalam window
 * @param {number} windowMinutes - lebar window dalam menit
 * @returns {Promise<{ allowed: boolean, remaining: number }>}
 */
export async function checkRateLimit(key, limit, windowMinutes) {
  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from('rate_limit_log')
    .select('id', { count: 'exact', head: true })
    .eq('key', key)
    .gte('created_at', windowStart);

  if (error) {
    // Kalau tabel rate limit sendiri gagal diquery, jangan sampai ini
    // memblokir seluruh fitur — fail open dengan catatan di log server.
    console.error('Rate limit check gagal:', error.message);
    return { allowed: true, remaining: limit };
  }

  const used = count ?? 0;

  if (used >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await admin.from('rate_limit_log').insert({ key });

  return { allowed: true, remaining: limit - used - 1 };
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
