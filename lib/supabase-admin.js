// lib/supabase-admin.js
// SERVER-ONLY. Pakai service_role key — bypass RLS sepenuhnya.
// JANGAN pernah import file ini di Client Component atau kirim key ini ke browser.
// Dipakai khusus untuk: invite user baru (auth.admin.inviteUserByEmail),
// dan operasi lain yang butuh hak akses penuh di luar sesi user biasa.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// PENTING (learning lama dari Creator Pulse): pakai format JWT lama
// (eyJhbGc...) untuk SUPABASE_SERVICE_ROLE_KEY, bukan format baru
// sb_secret_... — belum tentu kompatibel tergantung versi @supabase/supabase-js
// yang dipakai. Cek versi di package.json sebelum ganti format key.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
