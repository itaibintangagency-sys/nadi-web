// app/api/brands/route.js
// POST { name, client_name, client_contact?, platforms: string[], mode: 'subscription'|'fixed',
//        start_date, end_date?, competitors?: string[], keyword? }
// Super Admin only.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Cuma Super Admin yang bisa menambah brand' }, { status: 403 });
  }

  const body = await request.json();
  const { name, client_name, client_contact, platforms, mode, start_date, end_date, competitors, keyword } = body;

  if (!name || !client_name) {
    return NextResponse.json({ error: 'Nama brand dan nama client wajib diisi' }, { status: 400 });
  }

  if (!platforms || platforms.length === 0) {
    return NextResponse.json({ error: 'Pilih minimal 1 platform' }, { status: 400 });
  }

  if (mode === 'fixed' && (!start_date || !end_date)) {
    return NextResponse.json({ error: 'Mode durasi tetap butuh tanggal mulai & selesai' }, { status: 400 });
  }

  const { data: brand, error: insertError } = await supabase
    .from('brands')
    .insert({
      name,
      client_name,
      client_contact: client_contact || null,
      platforms,
      competitors: competitors || [],
      start_date: start_date || new Date().toISOString().slice(0, 10),
      end_date: mode === 'fixed' ? end_date : null,
      status: 'active',
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Trigger WF-01b (generate keyword) kalau ada keyword awal / mau auto-generate.
  // Approval keyword tetap di Telegram (WF-01c) — di sini cuma trigger, tidak menunggu hasil.
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.N8N_WEBHOOK_SECRET && { 'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET }),
        },
        body: JSON.stringify({
          event: 'brand_created',
          brand_id: brand.id,
          brand_name: name,
          keyword: keyword || null,
          platforms,
        }),
      });
    } catch (webhookError) {
      // Brand sudah kesimpan — jangan gagalkan request cuma karena webhook n8n gagal.
      // Cukup dicatat, admin bisa trigger WF-01b manual kalau perlu.
      console.error('Gagal trigger webhook n8n:', webhookError);
    }
  }

  return NextResponse.json({ brand }, { status: 201 });
}
