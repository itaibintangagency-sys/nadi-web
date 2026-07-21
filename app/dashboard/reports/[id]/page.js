import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function ReportDetailPage({ params }) {
  const supabase = createClient();
  const { data: report } = await supabase
    .from('final_reports')
    .select('*, brands(name, client_name)')
    .eq('id', params.id)
    .single();

  if (!report) {
    return (
      <div style={{ padding: 32 }}>
        <p>Laporan tidak ditemukan.</p>
        <Link href="/dashboard/reports">← Kembali ke daftar Reports</Link>
      </div>
    );
  }

  const sections = [
    { title: 'Positioning', content: report.positioning_summary },
    { title: 'Content Performance', content: report.content_summary },
    { title: 'Competitor Landscape', content: report.competitor_summary },
    { title: 'Rekomendasi', content: report.recommendations },
  ];

  return (
    <div className="report-detail">
      <Link href="/dashboard/reports" className="back-link">
        ← Kembali ke daftar Reports
      </Link>

      <div className="cover">
        <p className="eyebrow">Laporan Mendalam</p>
        <h1>{report.brands?.name}</h1>
        <p className="period">
          {new Date(report.period_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} —{' '}
          {new Date(report.period_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="sections">
        {sections.map((s) =>
          s.content ? (
            <div key={s.title} className="section">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </div>
          ) : null
        )}
        {sections.every((s) => !s.content) && <p className="empty-note">Laporan ini belum punya konten terisi.</p>}
      </div>

      <style>{`
        .report-detail { padding: 40px 32px 80px; max-width: 720px; margin: 0 auto; }
        .back-link { font-size: 13px; color: var(--brown); text-decoration: none; }
        .back-link:hover { color: var(--navy); }

        .cover {
          background: var(--navy);
          color: var(--cream);
          border-radius: 20px;
          padding: 48px 40px;
          margin: 24px 0 40px;
          text-align: center;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 14px;
        }
        .cover h1 {
          font-family: 'Fraunces', serif; font-weight: 600; font-size: 34px;
          margin: 0 0 10px; color: var(--white);
        }
        .period { font-size: 13px; color: rgba(255,239,202,0.75); margin: 0; }

        .sections { display: flex; flex-direction: column; gap: 36px; }
        .section h2 {
          font-family: 'Fraunces', serif; font-size: 20px; color: var(--navy);
          margin: 0 0 12px; padding-bottom: 10px; border-bottom: 2px solid var(--gold);
        }
        .section p { font-size: 15px; line-height: 1.85; color: var(--ink); white-space: pre-wrap; margin: 0; }
        .empty-note { font-size: 14px; color: var(--brown); text-align: center; }
      `}</style>
    </div>
  );
}
