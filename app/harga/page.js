import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getWhatsappUrl, getTelegramUrl } from '@/lib/site-config';

export default function HargaPage() {
  const tiers = [
    {
      name: 'Minimal',
      price: 'Rp 300 – 500 ribu',
      period: '/bulan',
      desc: 'Pemantauan dasar untuk brand yang baru mulai serius memantau reputasi digital.',
      features: ['Pemantauan YouTube', 'Tren pencarian dasar', 'Digest harian via Telegram'],
    },
    {
      name: 'Standard',
      price: 'Rp 750 ribu – 1,5 juta',
      period: '/bulan',
      desc: 'Untuk brand yang butuh gambaran lebih lengkap lintas platform.',
      features: [
        'Semua fitur Minimal',
        'Pemantauan TikTok & Instagram',
        'Deteksi anomali & alert real-time',
        'Laporan analisis berkala',
      ],
      highlighted: true,
    },
    {
      name: 'Maksimal',
      price: 'Rp 3 – 8 juta',
      period: '/bulan',
      desc: 'Cakupan penuh untuk brand dengan kebutuhan monitoring intensif.',
      features: [
        'Semua fitur Standard',
        'Monitoring 30 hari penuh, semua platform',
        'Analisis kompetitor',
        'Laporan mendalam berkala',
        'Prioritas support',
      ],
    },
  ];

  return (
    <div className="harga-page">
      <PublicNav />

      <section className="hero">
        <p className="eyebrow">Harga</p>
        <h1>Pilih paket sesuai kebutuhan pemantauan brand Anda</h1>
        <p className="subhead">Tanpa kontrak panjang. Tanpa biaya tersembunyi.</p>
      </section>

      <section className="tiers">
        {tiers.map((t) => (
          <div key={t.name} className={`tier-card ${t.highlighted ? 'highlighted' : ''}`}>
            {t.highlighted && <span className="badge">Paling populer</span>}
            <h2>{t.name}</h2>
            <p className="price">
              {t.price} <span>{t.period}</span>
            </p>
            <p className="desc">{t.desc}</p>
            <ul>
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary tier-cta">
              Tanya Paket Ini
            </a>
          </div>
        ))}
      </section>

      <section className="custom-note">
        <h2>Butuh cakupan khusus?</h2>
        <p>Kami bisa susun paket custom untuk kebutuhan enterprise — banyak brand, banyak platform, laporan sesuai format internal Anda.</p>
        <div className="cta-row">
          <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Chat via WhatsApp
          </a>
          <a href={getTelegramUrl()} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Chat via Telegram
          </a>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        .harga-page { background: var(--white); }
        .hero {
          background: var(--navy);
          color: var(--cream);
          text-align: center;
          padding: 56px 28px;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 14px;
        }
        .hero h1 {
          font-family: 'Fraunces', serif; font-weight: 600;
          font-size: clamp(26px, 4vw, 36px); max-width: 640px; margin: 0 auto 12px; color: var(--white);
        }
        .subhead { color: rgba(255,239,202,0.8); font-size: 15px; }

        .tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          max-width: 960px;
          margin: -32px auto 0;
          padding: 0 28px 64px;
          position: relative;
        }
        .tier-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          position: relative;
        }
        .tier-card.highlighted {
          border: 2px solid var(--gold);
        }
        .badge {
          position: absolute;
          top: -12px;
          left: 24px;
          background: var(--gold);
          color: var(--navy);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
        }
        .tier-card h2 { font-size: 18px; margin: 0 0 8px; color: var(--navy); }
        .price { font-size: 20px; font-weight: 700; color: var(--navy); margin: 0 0 12px; }
        .price span { font-size: 13px; font-weight: 400; color: var(--brown); }
        .desc { font-size: 13px; color: var(--brown); margin: 0 0 16px; line-height: 1.6; }
        .tier-card ul { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 8px; }
        .tier-card li { font-size: 13px; color: var(--ink); padding-left: 18px; position: relative; }
        .tier-card li::before { content: '✓'; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
        .tier-cta { width: 100%; text-align: center; }

        .custom-note {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 28px 72px;
          text-align: center;
        }
        .custom-note h2 { font-family: 'Fraunces', serif; font-size: 22px; color: var(--navy); margin: 0 0 12px; }
        .custom-note p { color: var(--brown); font-size: 14px; margin: 0 0 24px; line-height: 1.7; }
        .cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-ghost {
          display: inline-block; padding: 10px 20px; border-radius: 10px;
          border: 1px solid var(--navy); color: var(--navy); font-size: 14px; font-weight: 600; text-decoration: none;
        }
      `}</style>
    </div>
  );
}
