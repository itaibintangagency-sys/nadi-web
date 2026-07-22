// app/api/brands/[id]/route.js
// PATCH { name?, client_name?, client_contact?, platforms?, status?, competitors? } → update brand
// DELETE → hapus brand (cascade ke data terkait lewat FK, kalau ada ON DELETE CASCADE)
// Super Admin only.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

async function requireSuperAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: NextResponse.json({ error: 'Belum login' }, { status: 401 }) };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'super_admin') {
    return { error: NextResponse.json({ error: 'Cuma Super Admin yang bisa mengubah brand' }, { status: 403 }) };
  }

  return { supabase };
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const { supabase, error } = await requireSuperAdmin();
  if (error) return error;

  const body = await request.json();
  const allowed = ['name', 'client_name', 'client_contact', 'platforms', 'status', 'competitors', 'logo_url'];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Tidak ada field yang diubah' }, { status: 400 });
  }

  const { data, error: updateError } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ brand: data });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const { supabase, error } = await requireSuperAdmin();
  if (error) return error;

  const { error: deleteError } = await supabase.from('brands').delete().eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
