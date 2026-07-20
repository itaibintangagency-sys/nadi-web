import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function ClientHomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dashboard Anda</h1>
      <p style={{ color: '#57534e', fontSize: 14 }}>
        Halo, {user?.email}. Ini home Client — tampilan brand kamu (stat card, tab Insight/Video/
        Komentar) menyusul.
      </p>
    </div>
  );
}
