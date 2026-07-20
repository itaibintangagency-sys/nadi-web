import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, margin: '0 0 8px' }}>
        Super Admin
      </p>
      <h1 style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--navy)' }}>Brands</h1>
      <p style={{ color: 'var(--brown)', fontSize: 14 }}>
        Halo, {user?.email}. Halaman daftar brand lengkap menyusul.
      </p>
      <p style={{ marginTop: 16 }}>
        <a href="/dashboard/team" style={{ color: 'var(--navy)', fontWeight: 600 }}>
          → Kelola Tim
        </a>
      </p>
    </div>
  );
}
