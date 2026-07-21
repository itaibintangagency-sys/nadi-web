import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = createClient();

  const { data: reports, error } = await supabase
    .from('final_reports')
    .select('id, brand_id, period_start, period_end, created_at, brands(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="reports-page">
      <p className="eyebrow">Reports</p>
      <h1>Laporan Mendalam</h1>
      <p className="sub">{reports?.length ?? 0} laporan tersedia</p>

      {error && <p className="error-box">Gagal memuat data: {error.message}</p>}

      {!error && (!reports || reports.length === 0) && (
        <div className="empty-state">
          <p>Belum ada laporan yang dihasilkan.</p>
          <p className="empty-hint">Laporan mendalam dibuat otomatis pada hari ke-N sesuai periode monitoring brand.</p>
        </div>
      )}

      <div className="list">
        {reports?.map((r, i) => (
          <Reveal delay={i * 60} key={r.id}>
            <Link href={`/dashboard/reports/${r.id}`} className="report-card">
              <div>
                <p className="brand-name">{r.brands?.name ?? 'Brand tidak diketahui'}</p>
                <p className="period">
                  {new Date(r.period_start).toLocaleDateString('id-ID')} —{' '}
                  {new Date(r.period_end).toLocaleDateString('id-ID')}
                </p>
              </div>
              <span className="arrow">Baca laporan →</span>
            </Link>
          </Reveal>
        ))}
      </div>

      <style>{`
        .reports-page { padding: 32px; max-width: 800px; margin: 0 auto; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 4px; color: var(--navy); }
        .sub { font-size: 13px; color: var(--brown); margin: 0 0 28px; }

        .error-box {
          background: #FBEAEA; border: 1px solid #D9534F; color: #8B2E2E;
          padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 24px;
        }
        .empty-state {
          text-align: center; padding: 64px 24px; border: 1px dashed var(--line);
          border-radius: 16px; color: var(--brown);
        }
        .empty-hint { font-size: 12px; margin-top: 8px; }

        .list { display: flex; flex-direction: column; gap: 12px; }
        .report-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 20px 22px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .report-card:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(51,86,170,0.1); }
        .brand-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--navy); margin: 0 0 4px; }
        .period { font-size: 12px; color: var(--brown); margin: 0; }
        .arrow { font-size: 13px; font-weight: 600; color: var(--gold); white-space: nowrap; }
      `}</style>
    </div>
  );
}
