import Link from 'next/link';
import { siteConfig, getWhatsappUrl, getTelegramUrl } from '@/lib/site-config';

export default function LandingPage() {
  const steps = [
    {
      label: 'Kami pantau',
      desc: 'TikTok, YouTube, dan berita tentang merek Anda, 24 jam.',
      color: 'scan',
    },
    {
      label: 'Sistem kami olah datanya',
      desc: 'Memisahkan sinyal penting dari noise harian.',
      color: 'workflow',
    },
    {
      label: 'Anda dapat insight',
      desc: 'Bukan data mentah, tapi rekomendasi yang bisa langsung dipakai.',
      color: 'brand',
    },
  ];

  return (
    <div className="landing">
      {/* NAV */}
      <header className="nav">
        <span className="logo">{siteConfig.productName}</span>
        <Link href="/login" className="nav-login">
          Masuk
        </Link>
      </header>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">{siteConfig.tagline}</p>
        <h1>Rasakan detak merek Anda, sebelum orang lain bicara duluan.</h1>
        <p className="subhead">
          {siteConfig.productName} memantau TikTok, YouTube, dan berita secara real-time — dan
          memberi tahu Anda saat ada yang penting, bukan saat semuanya sudah terlambat.
        </p>

        <div className="signal-card">
          <span className="signal-dot" />
          <span className="signal-text">Mention negatif naik 340% dalam 2 jam</span>
        </div>

        <div className="cta-row">
          <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
            Chat via WhatsApp
          </a>
          <a href={getTelegramUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-tg">
            Chat via Telegram
          </a>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <h2>Merek besar bukan yang paling sering diposting</h2>
        <p className="section-sub">
          Tapi yang paling cepat tahu kapan harus bicara, kapan harus diam, dan kapan harus
          bertindak.
        </p>
        <ul>
          <li>Anda tahu ada masalah dari komplain viral, bukan dari sistem yang memantau</li>
          <li>Laporan performa bulanan datang terlalu telat untuk diputuskan apa-apa</li>
          <li>Kompetitor bergerak duluan karena mereka tahu duluan</li>
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2>Cara kerjanya</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div className={`step step-${s.color}`} key={s.label}>
              <span className="step-number">{i + 1}</span>
              <h3>{s.label}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <h2>Harga</h2>
        <p>
          Mulai dari <strong>Rp 300 ribuan/bulan</strong> untuk pemantauan dasar, hingga paket
          custom untuk kebutuhan enterprise. Tanpa kontrak panjang, tanpa biaya tersembunyi.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Siap tahu duluan?</h2>
        <div className="cta-row">
          <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
            Chat via WhatsApp
          </a>
          <a href={getTelegramUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-tg">
            Chat via Telegram
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          {siteConfig.productName} — Brand Intelligence System. <Link href="/login">Masuk</Link>
        </p>
      </footer>

      <style>{`
        :root {
          --bg-page: #0f1115;
          --bg-card: #ffffff;
          --bg-card-soft: #fbfbfa;
          --ink: #1a1a1a;
          --ink-soft: #57534e;
          --ink-faint: #8a8a85;
          --line: #e7e5e0;
          --accent: #0F6E5C;

          --brand-bg: #E1F5EE; --brand-bd: #0F6E5C; --brand-tx: #085041;
          --scan-bg: #E6F1FB; --scan-bd: #185FA5; --scan-tx: #0C447C;
          --workflow-bg: #FAEEDA; --workflow-bd: #854F0B; --workflow-tx: #633806;
        }

        .landing {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--ink);
          background: var(--bg-card-soft);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          background: var(--bg-page);
        }
        .logo {
          font-family: Georgia, "Iowan Old Style", serif;
          font-size: 20px;
          font-weight: 600;
          color: #f4f3ee;
        }
        .nav-login {
          color: #d6d4cb;
          font-size: 13px;
          text-decoration: none;
          border: 1px solid #2c2f38;
          padding: 6px 16px;
          border-radius: 999px;
        }

        .hero {
          background: var(--bg-page);
          color: #f4f3ee;
          padding: 64px 28px 80px;
          text-align: center;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #9c9a92;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero h1 {
          font-family: Georgia, "Iowan Old Style", serif;
          font-size: clamp(28px, 5vw, 44px);
          max-width: 700px;
          margin: 0 auto 16px;
          line-height: 1.2;
        }
        .subhead {
          color: #b9b7ad;
          font-size: 16px;
          max-width: 560px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .signal-card {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1a1d24;
          border: 1px solid #2c2f38;
          border-radius: 12px;
          padding: 12px 20px;
          margin-bottom: 40px;
        }
        .signal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #febb00;
          animation: pulse 1.6s ease-in-out infinite;
        }
        .signal-text {
          font-size: 13px;
          color: #f4f3ee;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }

        .cta-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .btn-wa { background: #25D366; color: #05330f; }
        .btn-tg { background: #229ED9; color: #fff; }

        section:not(.hero):not(.final-cta) {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 28px;
        }
        section h2 {
          font-family: Georgia, serif;
          font-size: 24px;
          margin: 0 0 12px;
        }
        .section-sub {
          color: var(--ink-soft);
          margin-bottom: 20px;
        }
        .problem ul {
          padding-left: 20px;
          line-height: 1.8;
          color: var(--ink-soft);
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .step {
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--line);
        }
        .step-scan { background: var(--scan-bg); border-color: var(--scan-bd); }
        .step-workflow { background: var(--workflow-bg); border-color: var(--workflow-bd); }
        .step-brand { background: var(--brand-bg); border-color: var(--brand-bd); }
        .step-number {
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0,0,0,0.08);
          text-align: center;
          line-height: 24px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .step h3 {
          font-size: 15px;
          margin: 0 0 6px;
        }
        .step p {
          font-size: 13px;
          color: var(--ink-soft);
          margin: 0;
        }

        .pricing p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-soft);
        }

        .final-cta {
          background: var(--bg-page);
          color: #f4f3ee;
          text-align: center;
          padding: 64px 28px;
        }
        .final-cta h2 {
          font-family: Georgia, serif;
          font-size: 26px;
          margin: 0 0 24px;
          color: #f4f3ee;
        }

        .footer {
          text-align: center;
          padding: 24px;
          font-size: 12px;
          color: var(--ink-faint);
        }
        .footer a {
          color: var(--ink-faint);
        }
      `}</style>
    </div>
  );
}
