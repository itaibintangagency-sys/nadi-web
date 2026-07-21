import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Reveal from '@/components/Reveal';
import BrandTabs from '@/components/BrandTabs';

export const dynamic = 'force-dynamic';

export default async function ClientHomePage({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: assignments } = await supabase
    .from('user_brands')
    .select('brand_id, brands(id, name, status)')
    .eq('user_id', user?.id);

  const myBrands = (assignments ?? []).map((a) => a.brands).filter(Boolean);

  if (myBrands.length === 0) {
    return (
      <div className="client-page">
        <p className="eyebrow">Dashboard Anda</p>
        <h1>Belum ada brand terhubung</h1>
        <p className="sub">Hubungi tim Nadi kalau menurut kamu ini seharusnya sudah aktif.</p>
      </div>
    );
  }

  // Brand aktif ditentukan lewat ?brand=xxx di URL — supaya bisa di-bookmark/share.
  const selectedId = searchParams?.brand && myBrands.some((b) => b.id === searchParams.brand)
    ? searchParams.brand
    : myBrands[0].id;

  const [{ data: brand }, { data: posts }, { data: comments }, { data: digest }, { data: stats }, { data: snapshots }] = await Promise.all([
    supabase.from('brands').select('*').eq('id', selectedId).single(),
    supabase.from('raw_posts').select('*').eq('brand_id', selectedId).order('posted_at', { ascending: false }),
    supabase.from('raw_comments').select('*').eq('brand_id', selectedId).order('commented_at', { ascending: false }).limit(500),
    supabase.from('daily_digests').select('*').eq('brand_id', selectedId).order('digest_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('brand_stats').select('*').eq('brand_id', selectedId).maybeSingle(),
    supabase.from('competitor_snapshots').select('*').eq('brand_id', selectedId),
  ]);

  const totalViews = stats?.total_views ?? 0;
  const totalLikes = stats?.total_likes ?? 0;
  const totalComments = stats?.total_comments ?? 0;
  const avgEngagement = Number(stats?.avg_engagement_rate ?? 0).toFixed(2);

  const lastUpdated = posts?.[0]?.scraped_at ? new Date(posts[0].scraped_at) : null;

  return (
    <div className="client-page">
      <Reveal>
        <div className="header-row">
          <div>
            {myBrands.length > 1 ? (
              <div className="brand-switcher">
                {myBrands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/dashboard/client?brand=${b.id}`}
                    className={b.id === selectedId ? 'active' : ''}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="eyebrow">Dashboard Anda</p>
            )}
            <h1>{brand?.name}</h1>
            {lastUpdated && (
              <p className="last-updated">
                <span className="live-dot" /> Terakhir update: {timeAgo(lastUpdated)}
              </p>
            )}
          </div>
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
        .client-page { padding: 32px; max-width: 1100px; margin: 0 auto; }
        .header-row { margin-bottom: 28px; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 28px; margin: 4px 0 8px; color: var(--navy); }
        .sub { font-size: 14px; color: var(--brown); }

        .brand-switcher { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .brand-switcher a {
          font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 999px;
          border: 1px solid var(--line); color: var(--brown); text-decoration: none;
        }
        .brand-switcher a.active { background: var(--navy); color: var(--white); border-color: var(--navy); }

        .last-updated {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--brown); margin: 0;
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #0F6E5C;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
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
          background: var(--white); border: 1px solid var(--line); border-radius: 14px; padding: 18px;
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

function timeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
