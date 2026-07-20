// app/api/team/route.js
// GET → list anggota tim. RLS otomatis membatasi: super_admin lihat semua,
// role lain cuma lihat profile sendiri (lihat policy "view own profile").

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profiles });
}
