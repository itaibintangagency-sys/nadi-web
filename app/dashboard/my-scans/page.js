import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function MyScansPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Brand Saya</h1>
      <p style={{ color: '#57534e', fontSize: 14 }}>
        Halo, {user?.email}. Ini home Admin — daftar brand yang di-assign ke kamu menyusul.
      </p>
    </div>
  );
}
