import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Dipanggil dari 2 alur:
// 1. Invite email (Supabase) → tidak bawa ?next, default ke /set-password
// 2. Forgot-password email → dikirim dengan ?next=/reset-password (lihat app/api/auth/forgot-password/route.js)

// Allowlist eksplisit — cuma path internal yang kita kenal yang boleh jadi
// tujuan redirect. Ini cegah open-redirect kalau parameter ?next= diutak-atik.
const ALLOWED_NEXT_PATHS = ['/set-password', '/reset-password'];

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const requestedNext = searchParams.get('next');
  const next = ALLOWED_NEXT_PATHS.includes(requestedNext) ? requestedNext : '/set-password';

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
