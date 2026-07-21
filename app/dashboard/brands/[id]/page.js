import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Reveal from '@/components/Reveal';
import BrandTabs from '@/components/BrandTabs';

export const dynamic = 'force-dynamic';

const statusLabel = { active: 'Aktif', paused: 'Dijeda', completed: 'Selesai', expired: 'Kedaluwarsa' };
const statusClass = { active: 'status-active', paused: 'status-paused', completed: 'status-completed', expired: 'status-expired' };

export default async function BrandDetailPage({ params }) {
  const { id } = params;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  const isSuperAdmin = profile?.role === 'super_admin';

  const [{ data: brand }, { data: posts }, { data: comments }, { data: digest }, { data: stats }, { data: snapshots }] = await Promise.all([
    supabase.from('brands').select('*').eq('id', id).single(),
    supabase.from('raw_posts').select('*').eq('brand_id', id).order('posted_at', { ascending: false }),
    supabase.from('raw_comments').select('*').eq('brand_id', id).order('commented_at', { ascending: false }).limit(500),
    supabase.from('daily_digests').select('*').eq('brand_id', id).order('digest_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('brand_stats').select('*').eq('brand_id', id).maybeSingle(),
    supabase.from('competitor_snapshots').select('*').eq('brand_id', id),
  ]);

  if (!brand) {
    return (
      <div className="not-found">
        <p>Brand tidak ditemukan.</p>
        <Link href="/dashboard/brands">← Kembali ke daftar Brands</Link>
      </div>
    );
  }

  // Stat card ambil dari view brand_stats (dihitung di database) — tidak
  // lagi tergantung array `posts` yang dipakai tabel/tab (yang bisa saja
  // ke depannya di-limit terpisah untuk alasan performa).
  const totalViews = stats?.total_views ?? 0;
  const totalLikes = stats?.total_likes ?? 0;
  const totalComments = stats?.total_comments ?? 0;
  const avgEngagement = Number(stats?.avg_engagement_rate ?? 0).toFixed(2);

  return (
    <div className="brand-detail">
      <Reveal>
        <Link href="/dashboard/brands" className="back-link">
          ← Kembali ke daftar Brands
        </Link>

        <div className="header-row">
          <div>
            <span className={`status-badge ${statusClass[brand.status] ?? 'status-active'}`}>
              {statusLabel[brand.status] ?? brand.status}
            </span>
            <h1>{brand.name}</h1>
            <p className="client-name">{brand.client_name}</p>
            {brand.platforms?.length > 0 && (
              <div className="platform-tags">
                {brand.platforms.map((p) => (
                  <span key={p} className="platform-tag">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isSuperAdmin && (
            <Link href={`/dashboard/brands/${brand.id}/edit`} className="edit-link">
              Edit Brand
            </Link>
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="stat-grid">
          <StatCard label="Total Views" value={formatNum(totalViews)} />
          <StatCard label="Total Likes" value={formatNum(totalLikes)} />
          <StatCard label="Total Komentar" value={formatNum(totalComments)} />
          <StatCard label="Avg Engagement Rate" value={`${avgEngagement}%`} />
        </div>
      </Reveal>

      <Reveal delay={160}>
        <BrandTabs digest={digest} posts={posts ?? []} comments={comments ?? []} competitors={brand.competitors ?? []} snapshots={snapshots ?? []} />
      </Reveal>

      <style>{`
        .not-found { padding: 32px; }
        .brand-detail { padding: 32px; max-width: 1100px; margin: 0 auto; }
        .back-link { font-size: 13px; color: var(--brown); text-decoration: none; }
        .back-link:hover { color: var(--navy); }

        .header-row {
          margin: 16px 0 28px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }
        .edit-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          border: 1px solid var(--line);
          padding: 7px 16px;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
        }
        .edit-link:hover { border-color: var(--navy); background: var(--cream); }
        .status-badge {
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
          display: inline-block; margin-bottom: 10px;
        }
        .status-active { background: #E1F5EE; color: #0F6E5C; }
        .status-paused { background: #FBF3DC; color: #8C6D0A; }
        .status-completed { background: #E8EDF7; color: #223A78; }
        .status-expired { background: #FAECE7; color: #8B2E2E; }

        h1 { font-size: 30px; margin: 0 0 4px; color: var(--navy); }
        .client-name { font-size: 14px; color: var(--brown); margin: 0 0 12px; }
        .platform-tags { display: flex; gap: 6px; }
        .platform-tag {
          font-size: 11px; background: var(--cream); color: var(--brown);
          padding: 3px 10px; border-radius: 999px; text-transform: capitalize;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 32px;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <style>{`
        .stat-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 18px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(51, 86, 170, 0.08);
        }
        .stat-label { font-size: 12px; color: var(--brown); margin: 0 0 6px; }
        .stat-value { font-size: 24px; font-weight: 700; color: var(--navy); margin: 0; font-family: 'Fraunces', serif; }
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
