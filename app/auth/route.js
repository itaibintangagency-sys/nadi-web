import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Dipanggil dari 2 alur:
// 1. Invite email (Supabase) → tidak bawa ?next, default ke /set-password
// 2. Forgot-password email → dikirim dengan ?next=/reset-password (lihat app/forgot-password/page.js)
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/set-password';

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
