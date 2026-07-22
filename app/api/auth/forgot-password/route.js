// app/api/auth/forgot-password/route.js
// POST { email } → kirim link reset password, rate-limited per IP.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request) {
  const ip = getClientIp(request);

  // Maks 5 percobaan per 15 menit per IP — cukup longgar untuk pemakaian
  // wajar (lupa password beneran), tapi cegah spam email ke alamat orang lain.
  const rl = await checkRateLimit(`forgot:${ip}`, 5, 15);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
  }

  const supabase = createClient();
  const origin = request.headers.get('origin') || new URL(request.url).origin;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  // Selalu balas sukses generik — jangan bocorkan apakah email itu terdaftar
  // atau tidak (mencegah enumerasi akun), kecuali error-nya memang teknis.
  if (error && error.status && error.status >= 500) {
    return NextResponse.json({ error: 'Gagal mengirim email, coba lagi nanti.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
