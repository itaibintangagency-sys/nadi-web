import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Supabase invite email mengarah ke sini dengan ?code=xxx
// Setelah exchange sukses, arahkan ke halaman set password.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/set-password`);
}
