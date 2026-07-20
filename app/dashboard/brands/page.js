import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

const statusLabel = { active: 'Aktif', paused: 'Dijeda', completed: 'Selesai', expired: 'Kedaluwarsa' };
const statusClass = { active: 'status-active', paused: 'status-paused', completed: 'status-completed', expired: 'status-expired' };

export default async function BrandsPage() {
  const supabase = createClient();
  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, client_name, platforms, status, start_date, end_date, created_at')
    .order('created_at', { ascending: false });

  // Ambil semua raw_posts sekaligus untuk brand-brand ini, lalu agregasi per brand_id
  // di sisi server — hindari 1 query terpisah per card.
  const brandIds = (brands ?? []).map((b) => b.id);
  let statsByBrand = {};

  if (brandIds.length > 0) {
    const { data: posts } = await supabase
      .from('raw_posts')
      .select('brand_id, views, likes, comments_count, engagement_rate')
      .in('brand_id', brandIds);

    statsByBrand = (posts ?? []).reduce((acc, p) => {
      const s = acc[p.brand_id] ?? { views: 0, likes: 0, comments: 0, erSum: 0, erCount: 0 };
      s.views += p.views || 0;
      s.likes += p.likes || 0;
      s.comments += p.comments_count || 0;
      if (p.engagement_rate != null) {
        s.erSum += p.engagement_rate;
        s.erCount += 1;
      }
      acc[p.brand_id] = s;
      return acc;
    }, {});
  }

  return (
    <div className="brands-page">
      <div className="header-row">
        <div>
          <p className="eyebrow">Super Admin</p>
          <h1>Brands</h1>
          <p className="sub">{brands?.length ?? 0} brand terdaftar</p>
        </div>
        <Link href="/dashboard/add-brand" className="btn-primary">
          + Tambah Brand
        </Link>
      </div>

      {error && <p className="error-box">Gagal memuat data: {error.message}</p>}

      {!error && brands?.length === 0 && (
        <div className="empty-state">
          <p>Belum ada brand terdaftar.</p>
          <Link href="/dashboard/add-brand" className="btn-primary">
            Tambah Brand Pertama
          </Link>
        </div>
      )}

      <div className="grid">
        {brands?.map((b, i) => {
          const s = statsByBrand[b.id] ?? { views: 0, likes: 0, comments: 0, erSum: 0, erCount: 0 };
          const avgEr = s.erCount > 0 ? (s.erSum / s.erCount).toFixed(2) : '0.00';

          return (
            <Reveal delay={i * 70} key={b.id}>
              <Link href={`/dashboard/brands/${b.id}`} className="brand-card">
                <div className="card-top">
                  <span className={`status-badge ${statusClass[b.status] ?? 'status-active'}`}>
                    {statusLabel[b.status] ?? b.status}
                  </span>
                </div>
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
                    <span className="mini-value">{formatNum(s.views)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Likes</span>
                    <span className="mini-value">{formatNum(s.likes)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Komentar</span>
                    <span className="mini-value">{formatNum(s.comments)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Avg ER</span>
                    <span className="mini-value">{avgEr}%</span>
                  </div>
                </div>

                {b.start_date && (
                  <p className="date-range">
                    {new Date(b.start_date).toLocaleDateString('id-ID')}
                    {b.end_date && ` — ${new Date(b.end_date).toLocaleDateString('id-ID')}`}
                  </p>
                )}
              </Link>
            </Reveal>
          );
        })}
      </div>

      <style>{`
        .brands-page { padding: 32px; max-width: 1100px; }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 4px; color: var(--navy); }
        .sub { font-size: 13px; color: var(--brown); margin: 0; }

        .error-box {
          background: #FBEAEA;
          border: 1px solid #D9534F;
          color: #8B2E2E;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          border: 1px dashed var(--line);
          border-radius: 16px;
          color: var(--brown);
        }
        .empty-state p { margin-bottom: 16px; }

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
        .brand-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(51,86,170,0.12);
        }
        .card-top { margin-bottom: 12px; }
        .status-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .status-active { background: #E1F5EE; color: #0F6E5C; }
        .status-paused { background: #FBF3DC; color: #8C6D0A; }
        .status-completed { background: #E8EDF7; color: #223A78; }
        .status-expired { background: #FAECE7; color: #8B2E2E; }

        .brand-card h2 { font-size: 17px; margin: 0 0 4px; color: var(--navy); }
        .client-name { font-size: 13px; color: var(--brown); margin: 0 0 14px; }

        .platform-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .platform-tag {
          font-size: 11px;
          background: var(--cream);
          color: var(--brown);
          padding: 3px 10px;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 14px;
          padding: 12px 8px;
          background: var(--cream);
          border-radius: 10px;
        }
        .mini-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .mini-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--brown); }
        .mini-value { font-size: 13px; font-weight: 700; color: var(--navy); }

        .date-range { font-size: 12px; color: var(--brown); margin: 0; }
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
