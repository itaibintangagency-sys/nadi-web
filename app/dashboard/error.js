'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div className="dash-error">
      <p className="eyebrow">Nadi</p>
      <h1>Halaman ini gagal dimuat</h1>
      <p className="sub">
        Terjadi kesalahan saat mengambil data. Coba muat ulang — kalau masih terjadi, kabari tim
        Nadi.
      </p>
      <button onClick={() => reset()} className="btn-primary">
        Coba Lagi
      </button>

      <style jsx>{`
        .dash-error {
          padding: 64px 32px;
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin: 0 0 8px;
        }
        h1 { font-size: 20px; margin: 0 0 10px; color: var(--navy); font-family: 'Fraunces', serif; }
        .sub { font-size: 14px; color: var(--brown); line-height: 1.6; margin: 0 0 24px; }
      `}</style>
    </div>
  );
}
