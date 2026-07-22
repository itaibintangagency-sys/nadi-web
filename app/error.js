'use client';

export default function Error({ error, reset }) {
  return (
    <div className="error-page">
      <div className="error-card">
        <p className="eyebrow">Nadi</p>
        <h1>Ada yang tidak beres</h1>
        <p className="sub">
          Terjadi kesalahan yang tidak terduga. Coba muat ulang halaman ini — kalau masih terjadi,
          kabari tim Nadi.
        </p>
        <div className="actions">
          <button onClick={() => reset()} className="btn-primary">
            Coba Lagi
          </button>
          <a href="/" className="home-link">
            Kembali ke Beranda
          </a>
        </div>
      </div>

      <style jsx>{`
        .error-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--navy);
          padding: 24px;
        }
        .error-card {
          background: var(--white);
          border-radius: 16px;
          padding: 40px 32px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
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
        .actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .home-link {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          border: 1px solid var(--line);
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
        }
        .home-link:hover { background: var(--cream); }
      `}</style>
    </div>
  );
}
