import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function MyScansPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, margin: '0 0 8px' }}>
        Admin
      </p>
      <h1 style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--navy)' }}>Brand Saya</h1>
      <p style={{ color: 'var(--brown)', fontSize: 14 }}>
        Halo, {user?.email}. Daftar brand yang di-assign ke kamu menyusul.
      </p>
    </div>
  );
}
