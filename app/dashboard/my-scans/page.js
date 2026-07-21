import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

const statusLabel = { active: 'Aktif', paused: 'Dijeda', completed: 'Selesai', expired: 'Kedaluwarsa' };
const statusClass = { active: 'status-active', paused: 'status-paused', completed: 'status-completed', expired: 'status-expired' };

export default async function MyScansPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil brand yang di-assign ke admin ini lewat user_brands, join ke brands.
  const { data: assignments, error } = await supabase
    .from('user_brands')
    .select('brand_id, brands(id, name, client_name, platforms, status, start_date, end_date)')
    .eq('user_id', user?.id);

  const brands = (assignments ?? []).map((a) => a.brands).filter(Boolean);
  const brandIds = brands.map((b) => b.id);

  let statsByBrand = {};
  if (brandIds.length > 0) {
    const { data: stats } = await supabase
      .from('brand_stats')
      .select('brand_id, total_views, total_likes, total_comments, avg_engagement_rate')
      .in('brand_id', brandIds);
    statsByBrand = (stats ?? []).reduce((acc, s) => {
      acc[s.brand_id] = s;
      return acc;
    }, {});
  }

  return (
    <div className="my-scans-page">
      <p className="eyebrow">Admin</p>
      <h1>Brand Saya</h1>
      <p className="sub">{brands.length} brand di-assign ke kamu</p>

      {error && <p className="error-box">Gagal memuat data: {error.message}</p>}

      {!error && brands.length === 0 && (
        <div className="empty-state">
          <p>Belum ada brand yang di-assign ke akun kamu.</p>
          <p className="empty-hint">Hubungi Super Admin untuk di-assign ke brand tertentu.</p>
        </div>
      )}

      <div className="grid">
        {brands.map((b, i) => {
          const s = statsByBrand[b.id] ?? { total_views: 0, total_likes: 0, total_comments: 0, avg_engagement_rate: 0 };
          return (
            <Reveal delay={i * 70} key={b.id}>
              <Link href={`/dashboard/brands/${b.id}`} className="brand-card">
                <span className={`status-badge ${statusClass[b.status] ?? 'status-active'}`}>
                  {statusLabel[b.status] ?? b.status}
                </span>
                <h2>{b.name}</h2>
                <p className="client-name">{b.client_name}</p>

                {b.platforms?.length > 0 && (
                  <div className="platform-tags">
                    {b.platforms.map((p) => (
                      <span key={p} className="platform-tag">
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mini-stats">
                  <div>
                    <span className="mini-label">Views</span>
                    <span className="mini-value">{formatNum(s.total_views)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Likes</span>
                    <span className="mini-value">{formatNum(s.total_likes)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Komentar</span>
                    <span className="mini-value">{formatNum(s.total_comments)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Avg ER</span>
                    <span className="mini-value">{Number(s.avg_engagement_rate ?? 0).toFixed(2)}%</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        .my-scans-page { padding: 32px; max-width: 1100px; margin: 0 auto; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 4px; color: var(--navy); }
        .sub { font-size: 13px; color: var(--brown); margin: 0 0 32px; }

        .error-box {
          background: #FBEAEA; border: 1px solid #D9534F; color: #8B2E2E;
          padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 24px;
        }
        .empty-state {
          text-align: center; padding: 64px 24px; border: 1px dashed var(--line);
          border-radius: 16px; color: var(--brown);
        }
        .empty-hint { font-size: 12px; margin-top: 6px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .brand-card {
          display: block;
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 20px;
          text-decoration: none;
          color: var(--ink);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .brand-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(51,86,170,0.12); }
        .status-badge {
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
          display: inline-block; margin-bottom: 12px;
        }
        .status-active { background: #E1F5EE; color: #0F6E5C; }
        .status-paused { background: #FBF3DC; color: #8C6D0A; }
        .status-completed { background: #E8EDF7; color: #223A78; }
        .status-expired { background: #FAECE7; color: #8B2E2E; }

        .brand-card h2 { font-size: 17px; margin: 0 0 4px; color: var(--navy); }
        .client-name { font-size: 13px; color: var(--brown); margin: 0 0 14px; }

        .platform-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .platform-tag {
          font-size: 11px; background: var(--cream); color: var(--brown);
          padding: 3px 10px; border-radius: 999px; text-transform: capitalize;
        }

        .mini-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
          padding: 12px 8px; background: var(--cream); border-radius: 10px;
        }
        .mini-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .mini-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--brown); }
        .mini-value { font-size: 13px; font-weight: 700; color: var(--navy); }
      `}</style>
    </div>
  );
}

function formatNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb';
  return String(n);
}
