// lib/supabase-server.js
// Client Supabase berbasis SESI USER — tunduk RLS. Dipakai di Server Components
// dan API routes untuk operasi yang harus dibatasi hak akses user yang login.
// Jangan pakai file ini untuk operasi admin (lihat supabase-admin.js).

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Dipanggil dari Server Component — boleh diabaikan kalau ada middleware
            // yang refresh sesi.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // sama seperti di atas
          }
        },
      },
    }
  );
}

// Helper: ambil role user yang sedang login. Return null kalau belum login
// atau profile belum ke-create.
export async function getCurrentUserRole() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role ?? null;
}
