import { createClient } from '@/lib/supabase-server';
import ExportPanel from '@/components/ExportPanel';

export const dynamic = 'force-dynamic';

export default async function ExportPage() {
  const supabase = createClient();

  // RLS otomatis batasi hasil sesuai role — super_admin lihat semua,
  // admin cuma lihat brand yang di-assign (lewat user_brands).
  const { data: brands } = await supabase.from('brands').select('id, name').order('name');

  return (
    <div className="export-page">
      <p className="eyebrow">Admin</p>
      <h1>Export Data</h1>
      <p className="sub">Unduh data video atau komentar dalam format CSV — pilih brand dan tipe data.</p>

      <ExportPanel brands={brands ?? []} />

      <style>{`
        .export-page { padding: 32px; max-width: 640px; margin: 0 auto; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 8px; color: var(--navy); }
        .sub { font-size: 14px; color: var(--brown); margin: 0 0 28px; }
      `}</style>
    </div>
  );
}
