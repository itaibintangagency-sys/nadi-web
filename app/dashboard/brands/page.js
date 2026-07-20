import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const statusLabel = {
  active: 'Aktif',
  paused: 'Dijeda',
  completed: 'Selesai',
  expired: 'Kedaluwarsa',
};

const statusClass = {
  active: 'status-active',
  paused: 'status-paused',
  completed: 'status-completed',
  expired: 'status-expired',
};

export default async function BrandsPage() {
  const supabase = createClient();
  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, client_name, platforms, status, start_date, end_date, created_at')
    .order('created_at', { ascending: false });

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

      {error && (
        <p className="error-box">
          Gagal memuat data: {error.message}
        </p>
      )}

      {!error && brands?.length === 0 && (
        <div className="empty-state">
          <p>Belum ada brand terdaftar.</p>
          <Link href="/dashboard/add-brand" className="btn-primary">
            Tambah Brand Pertama
          </Link>
        </div>
      )}

      <div className="grid">
        {brands?.map((b) => (
          <Link href={`/dashboard/brands/${b.id}`} key={b.id} className="brand-card">
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

            {b.start_date && (
              <p className="date-range">
                {new Date(b.start_date).toLocaleDateString('id-ID')}
                {b.end_date && ` — ${new Date(b.end_date).toLocaleDateString('id-ID')}`}
              </p>
            )}
          </Link>
        ))}
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
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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

        .platform-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .platform-tag {
          font-size: 11px;
          background: var(--cream);
          color: var(--brown);
          padding: 3px 10px;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .date-range { font-size: 12px; color: var(--brown); margin: 0; }
      `}</style>
    </div>
  );
}
