// app/api/team/invite/route.js
// POST { email, role: 'admin' | 'client', full_name?, brand_ids?: string[] }
// Cuma boleh dipanggil oleh super_admin. Validasi sesi dulu sebelum apapun.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(request) {
  const supabase = createClient();

  // 1. Pastikan yang manggil sudah login & role-nya super_admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Cuma Super Admin yang bisa mengundang anggota tim' }, { status: 403 });
  }

  // 2. Validasi payload
  const body = await request.json();
  const { email, role, full_name, brand_ids } = body;

  if (!email || !role) {
    return NextResponse.json({ error: 'email dan role wajib diisi' }, { status: 400 });
  }

  if (!['admin', 'client'].includes(role)) {
    return NextResponse.json({ error: 'role harus admin atau client' }, { status: 400 });
  }

  if (role === 'client' && (!brand_ids || brand_ids.length === 0)) {
    return NextResponse.json(
      { error: 'client wajib punya minimal 1 brand di brand_ids' },
      { status: 400 }
    );
  }

  // 3. Kirim invite via service role (bypass RLS, hak akses admin auth)
  const admin = createAdminClient();

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      role,
      full_name: full_name ?? null,
      invited_by: user.id,
    },
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // 4. Kalau ada brand_ids, insert ke user_brands (assign brand ke admin/client baru)
  if (brand_ids?.length) {
    const rows = brand_ids.map((brand_id) => ({
      user_id: invited.user.id,
      brand_id,
    }));

    const { error: brandLinkError } = await admin.from('user_brands').insert(rows);

    if (brandLinkError) {
      // User sudah terlanjur diundang — jangan gagal total, tapi kasih tahu.
      return NextResponse.json(
        {
          warning: `User berhasil diundang tapi gagal assign brand: ${brandLinkError.message}`,
          user: invited.user,
        },
        { status: 207 }
      );
    }
  }

  return NextResponse.json({ user: invited.user }, { status: 201 });
}
