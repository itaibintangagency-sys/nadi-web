import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Brands</h1>
      <p style={{ color: '#57534e', fontSize: 14 }}>
        Halo, {user?.email}. Ini home Super Admin — halaman daftar brand lengkap menyusul.
      </p>
      <p style={{ marginTop: 16 }}>
        <a href="/dashboard/team" style={{ color: '#0F6E5C' }}>
          → Kelola Tim
        </a>
      </p>
    </div>
  );
}
