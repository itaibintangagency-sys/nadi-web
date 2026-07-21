// app/api/team/[userId]/brands/route.js
// GET  → list brand_id yang di-assign ke user ini
// PUT  { brand_ids: string[] } → sinkronkan assignment (tambah yang baru, hapus yang di-uncheck)
// Super Admin only.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

async function requireSuperAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: NextResponse.json({ error: 'Belum login' }, { status: 401 }) };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'super_admin') {
    return { error: NextResponse.json({ error: 'Cuma Super Admin yang bisa mengelola assignment brand' }, { status: 403 }) };
  }

  return { supabase };
}

export async function GET(request, { params }) {
  const { userId } = params;
  const { supabase, error } = await requireSuperAdmin();
  if (error) return error;

  const { data, error: fetchError } = await supabase
    .from('user_brands')
    .select('brand_id')
    .eq('user_id', userId);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ brand_ids: (data ?? []).map((r) => r.brand_id) });
}

export async function PUT(request, { params }) {
  const { userId } = params;
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const body = await request.json();
  const newBrandIds = Array.isArray(body.brand_ids) ? body.brand_ids : [];

  // Pakai service role supaya sinkronisasi (delete + insert) bisa jalan bersih
  // tanpa terganggu RLS baris punya user lain.
  const admin = createAdminClient();

  const { data: current } = await admin.from('user_brands').select('brand_id').eq('user_id', userId);
  const currentIds = (current ?? []).map((r) => r.brand_id);

  const toAdd = newBrandIds.filter((id) => !currentIds.includes(id));
  const toRemove = currentIds.filter((id) => !newBrandIds.includes(id));

  if (toRemove.length > 0) {
    const { error: delError } = await admin
      .from('user_brands')
      .delete()
      .eq('user_id', userId)
      .in('brand_id', toRemove);
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  if (toAdd.length > 0) {
    const { error: insError } = await admin
      .from('user_brands')
      .insert(toAdd.map((brand_id) => ({ user_id: userId, brand_id })));
    if (insError) return NextResponse.json({ error: insError.message }, { status: 500 });
  }

  return NextResponse.json({ brand_ids: newBrandIds });
}
