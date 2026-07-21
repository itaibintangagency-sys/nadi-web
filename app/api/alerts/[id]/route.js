// app/api/alerts/[id]/route.js
// PATCH { resolved: true } → tandai alert selesai
// RLS di anomaly_logs yang menentukan siapa boleh update (super_admin,
// atau admin yang di-assign ke brand terkait) — route ini cuma proxy.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function PATCH(request, { params }) {
  const { id } = params;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('anomaly_logs')
    .update({ resolved: true, resolved_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    // Kalau RLS menolak, Supabase biasanya return 0 baris ter-update tanpa
    // error eksplisit — data bakal null, kita anggap itu juga "ditolak".
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Tidak punya akses untuk alert ini' }, { status: 403 });
  }

  return NextResponse.json({ alert: data });
}
