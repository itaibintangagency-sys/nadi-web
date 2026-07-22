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

  // Ambil stat teragregasi dari view brand_stats (dihitung di database,
  // bukan fetch-semua-lalu-jumlah-di-JS — lebih cepat & tidak berisiko
  // kepotong limit baris kalau data brand sudah besar).
  const brandIds = (brands ?? []).map((b) => b.id);
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

  // Brand yang belum punya video sama sekali kemungkinan masih onboarding —
  // cek workflow_logs untuk tahu tahap prosesnya sekarang. (brand_stats view
  // pakai GROUP BY raw_posts, jadi brand tanpa video tidak akan muncul di sana.)
  const newBrandIds = (brands ?? []).filter((b) => !statsByBrand[b.id]).map((b) => b.id);

  let stageByBrand = {};
  if (newBrandIds.length > 0) {
    const { data: logs } = await supabase
      .from('workflow_logs')
      .select('brand_id, workflow_name, status, started_at')
      .in('brand_id', newBrandIds)
      .order('started_at', { ascending: false })
      .limit(300);

    const logsByBrand = (logs ?? []).reduce((acc, l) => {
      acc[l.brand_id] = acc[l.brand_id] || [];
      acc[l.brand_id].push(l);
      return acc;
    }, {});

    for (const id of newBrandIds) {
      stageByBrand[id] = computeBrandStage(logsByBrand[id] ?? []);
    }
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
          const s = statsByBrand[b.id] ?? { total_views: 0, total_likes: 0, total_comments: 0, avg_engagement_rate: 0 };
          const avgEr = Number(s.avg_engagement_rate ?? 0).toFixed(2);
          const stage = stageByBrand[b.id];

          return (
            <Reveal delay={i * 70} key={b.id}>
              <Link href={`/dashboard/brands/${b.id}`} className="brand-card">
                <div className="card-top">
                  <span className={`status-badge ${statusClass[b.status] ?? 'status-active'}`}>
                    {statusLabel[b.status] ?? b.status}
                  </span>
                  {stage && (
                    <span className={`stage-badge stage-${stage.tone}`}>
                      <span className="stage-dot" />
                      {stage.label}
                    </span>
                  )}
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
        .card-top { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .status-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .stage-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px 3px 8px;
          border-radius: 999px;
          background: var(--cream);
          color: var(--brown);
        }
        .stage-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
        }
        .stage-active .stage-dot { animation: stage-pulse 1.6s ease-in-out infinite; }
        @keyframes stage-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
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

// Tebak tahap onboarding brand dari nama & status workflow_logs terakhir.
// Ini best-effort — cocokkan pola nama workflow secara longgar (case-insensitive,
// substring), karena kita tidak selalu tahu persis string workflow_name yang
// dipakai di n8n.
function computeBrandStage(logs) {
  if (logs.length === 0) return { label: 'Menunggu diproses', tone: 'waiting' };

  const isScan = (name) => /wf-?0[235]|scan|scrape|collector/i.test(name || '');
  const isApproval = (name) => /wf-?01c|approval|approve/i.test(name || '');
  const isKeyword = (name) => /wf-?01b|keyword/i.test(name || '');

  const scanRunning = logs.find((l) => isScan(l.workflow_name) && l.status === 'running');
  if (scanRunning) return { label: 'Sedang memindai...', tone: 'active' };

  const approvalPending = logs.find((l) => isApproval(l.workflow_name) && /pending|waiting|menunggu/i.test(l.status || ''));
  if (approvalPending) return { label: 'Menunggu approval keyword', tone: 'waiting' };

  const keywordLog = logs.find((l) => isKeyword(l.workflow_name));
  if (keywordLog) return { label: 'Menghasilkan keyword...', tone: 'active' };

  return { label: 'Menunggu diproses', tone: 'waiting' };
}

function formatNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb';
  return String(n);
}
