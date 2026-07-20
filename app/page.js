import Link from 'next/link';
import { siteConfig, getWhatsappUrl, getTelegramUrl } from '@/lib/site-config';
import Reveal from '@/components/Reveal';

export default function LandingPage() {
  const steps = [
    {
      label: 'Kami pantau',
      desc: 'TikTok, YouTube, dan berita tentang merek Anda, 24 jam.',
    },
    {
      label: 'Sistem kami olah datanya',
      desc: 'Memisahkan sinyal penting dari noise harian.',
    },
    {
      label: 'Anda dapat insight',
      desc: 'Bukan data mentah, tapi rekomendasi yang bisa langsung dipakai.',
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
        <Reveal>
          <p className="eyebrow">{siteConfig.tagline}</p>
        </Reveal>
        <Reveal delay={100}>
          <h1>Rasakan detak merek Anda, sebelum orang lain bicara duluan.</h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="subhead">
            {siteConfig.productName} memantau TikTok, YouTube, dan berita secara real-time — dan
            memberi tahu Anda saat ada yang penting, bukan saat semuanya sudah terlambat.
          </p>
        </Reveal>

        {/* Signature: animated signal line — line yang "hidup", merepresentasikan
            konsep inti produk (menemukan sinyal dari noise) */}
        <Reveal delay={300}>
          <div className="signal-wrap">
            <svg viewBox="0 0 600 80" className="signal-svg" preserveAspectRatio="none">
              <polyline
                className="signal-line-bg"
                points="0,40 60,40 90,40 110,15 130,65 150,40 200,40 260,40 290,40 310,10 330,70 350,40 420,40 480,40 510,40 530,20 550,60 570,40 600,40"
              />
              <polyline
                className="signal-line"
                points="0,40 60,40 90,40 110,15 130,65 150,40 200,40 260,40 290,40 310,10 330,70 350,40 420,40 480,40 510,40 530,20 550,60 570,40 600,40"
              />
            </svg>
            <div className="signal-card">
              <span className="signal-dot" />
              <span className="signal-text">Mention negatif naik 340% dalam 2 jam</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="cta-row">
            <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Chat via WhatsApp
            </a>
            <a href={getTelegramUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Chat via Telegram
            </a>
          </div>
        </Reveal>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <Reveal>
          <h2>Merek besar bukan yang paling sering diposting</h2>
          <p className="section-sub">
            Tapi yang paling cepat tahu kapan harus bicara, kapan harus diam, dan kapan harus
            bertindak.
          </p>
        </Reveal>
        <ul>
          {[
            'Anda tahu ada masalah dari komplain viral, bukan dari sistem yang memantau',
            'Laporan performa bulanan datang terlalu telat untuk diputuskan apa-apa',
            'Kompetitor bergerak duluan karena mereka tahu duluan',
          ].map((item, i) => (
            <Reveal delay={i * 100} key={item}>
              <li>{item}</li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <Reveal>
          <h2>Cara kerjanya</h2>
        </Reveal>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal delay={i * 120} key={s.label}>
              <div className="step">
                <span className="step-number">{i + 1}</span>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <Reveal>
          <h2>Harga</h2>
          <p>
            Mulai dari <strong>Rp 300 ribuan/bulan</strong> untuk pemantauan dasar, hingga paket
            custom untuk kebutuhan enterprise. Tanpa kontrak panjang, tanpa biaya tersembunyi.
          </p>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <Reveal>
          <h2>Siap tahu duluan?</h2>
          <div className="cta-row">
            <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Chat via WhatsApp
            </a>
            <a href={getTelegramUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
              Chat via Telegram
            </a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          {siteConfig.productName} — Brand Intelligence System. <Link href="/login">Masuk</Link>
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --navy: #3356AA;
          --gold: #D1A617;
          --cream: #FFEFCA;
          --brown: #857555;
          --ink: #2A2620;
          --white: #FFFFFF;
        }

        * { box-sizing: border-box; }

        .landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ink);
          background: var(--white);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 32px;
          background: var(--navy);
        }
        .logo {
          font-family: 'Fraunces', serif;
          font-size: 21px;
          font-weight: 600;
          color: var(--cream);
          letter-spacing: -0.01em;
        }
        .nav-login {
          color: var(--cream);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(255,239,202,0.4);
          padding: 7px 18px;
          border-radius: 999px;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .nav-login:hover {
          background: rgba(255,239,202,0.12);
          border-color: var(--cream);
        }

        .hero {
          background: var(--navy);
          color: var(--cream);
          padding: 72px 28px 56px;
          text-align: center;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin: 0 0 18px;
        }
        .hero h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(30px, 5vw, 48px);
          max-width: 720px;
          margin: 0 auto 18px;
          line-height: 1.18;
          color: var(--white);
        }
        .subhead {
          color: rgba(255,239,202,0.82);
          font-size: 16px;
          max-width: 540px;
          margin: 0 auto 40px;
          line-height: 1.65;
        }

        .signal-wrap {
          position: relative;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .signal-svg {
          width: 100%;
          height: 60px;
          display: block;
        }
        .signal-line-bg {
          fill: none;
          stroke: rgba(255,239,202,0.15);
          stroke-width: 2;
        }
        .signal-line {
          fill: none;
          stroke: var(--gold);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: draw-signal 2.4s cubic-bezier(0.65, 0, 0.35, 1) forwards, glow-signal 2.5s ease-in-out 2.4s infinite;
        }
        @keyframes draw-signal {
          to { stroke-dashoffset: 0; }
        }
        @keyframes glow-signal {
          0%, 100% { filter: drop-shadow(0 0 0px var(--gold)); }
          50% { filter: drop-shadow(0 0 6px var(--gold)); }
        }

        .signal-card {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,239,202,0.08);
          border: 1px solid rgba(255,239,202,0.25);
          border-radius: 12px;
          padding: 12px 22px;
          margin-top: -10px;
        }
        .signal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse 1.6s ease-in-out infinite;
        }
        .signal-text {
          font-size: 13px;
          color: var(--cream);
          font-weight: 500;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.4); }
        }

        .cta-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-block;
          padding: 13px 26px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .btn-primary {
          background: var(--gold);
          color: var(--navy);
        }
        .btn-primary:hover {
          box-shadow: 0 8px 20px rgba(209,166,23,0.35);
        }
        .btn-ghost {
          background: transparent;
          color: var(--cream);
          border: 1px solid rgba(255,239,202,0.4);
        }
        .btn-ghost:hover {
          background: rgba(255,239,202,0.1);
        }
        .btn-ghost-dark {
          background: transparent;
          color: var(--navy);
          border: 1px solid rgba(51,86,170,0.4);
        }
        .btn-ghost-dark:hover {
          background: rgba(51,86,170,0.08);
        }

        section:not(.hero):not(.final-cta) {
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 28px;
        }
        .problem { background: var(--cream); max-width: 100%; }
        .problem > * { max-width: 680px; margin-left: auto; margin-right: auto; }
        section h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          margin: 0 0 12px;
          color: var(--navy);
        }
        .section-sub {
          color: var(--brown);
          margin-bottom: 24px;
          font-size: 15px;
        }
        .problem ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .problem li {
          background: var(--white);
          border-left: 3px solid var(--gold);
          padding: 14px 18px;
          border-radius: 8px;
          color: var(--ink);
          font-size: 14px;
          line-height: 1.6;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 18px;
          margin-top: 28px;
        }
        .step {
          border-radius: 16px;
          padding: 24px;
          background: var(--white);
          border: 1px solid #EFE8D8;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(51,86,170,0.1);
        }
        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--navy);
          color: var(--cream);
          font-family: 'Fraunces', serif;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .step h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 8px;
          color: var(--navy);
        }
        .step p {
          font-size: 13px;
          color: var(--brown);
          margin: 0;
          line-height: 1.6;
        }

        .pricing p {
          font-size: 15px;
          line-height: 1.75;
          color: var(--brown);
        }
        .pricing strong {
          color: var(--navy);
        }

        .final-cta {
          background: var(--gold);
          text-align: center;
          padding: 72px 28px;
        }
        .final-cta h2 {
          color: var(--navy);
          margin-bottom: 28px;
        }

        .footer {
          text-align: center;
          padding: 28px;
          font-size: 12px;
          color: var(--brown);
          background: var(--white);
        }
        .footer a {
          color: var(--navy);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
