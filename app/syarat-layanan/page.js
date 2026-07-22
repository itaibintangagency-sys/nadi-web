import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { siteConfig } from '@/lib/site-config';

export default function SyaratLayananPage() {
  return (
    <div className="terms-page">
      <PublicNav />

      <section className="content">
        <p className="eyebrow">Ketentuan</p>
        <h1>Syarat Layanan</h1>
        <p className="updated">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</p>

        <h2>1. Tentang Layanan</h2>
        <p>
          {siteConfig.productName} adalah layanan pemantauan dan analisis brand di media sosial
          (TikTok, YouTube, dan platform lain) yang disediakan kepada pelanggan berdasarkan paket
          langganan atau durasi tertentu sesuai kesepakatan.
        </p>

        <h2>2. Akun & Akses</h2>
        <p>
          Akses ke dashboard {siteConfig.productName} bersifat undangan (invite-only) dan diberikan
          oleh pihak {siteConfig.productName} setelah kesepakatan layanan tercapai. Setiap pengguna
          bertanggung jawab menjaga kerahasiaan kredensial akun masing-masing.
        </p>

        <h2>3. Ruang Lingkup Data</h2>
        <p>
          Data yang ditampilkan berasal dari informasi publik di platform media sosial terkait, dan
          dikumpulkan sesuai keyword dan brand yang didaftarkan. {siteConfig.productName} tidak
          menjamin kelengkapan 100% dari seluruh konten yang ada di platform sumber, karena
          bergantung pada ketersediaan dan kebijakan API/scraping masing-masing platform.
        </p>

        <h2>4. Pembayaran & Langganan</h2>
        <p>
          Rincian paket, harga, dan periode langganan mengikuti kesepakatan yang dibuat secara
          terpisah antara {siteConfig.productName} dan pelanggan. Keterlambatan pembayaran dapat
          mengakibatkan penangguhan akses sementara.
        </p>

        <h2>5. Batasan Tanggung Jawab</h2>
        <p>
          {siteConfig.productName} menyediakan data dan analisis sebagai alat bantu pengambilan
          keputusan, bukan sebagai jaminan hasil bisnis tertentu. Keputusan yang diambil berdasarkan
          data dari layanan ini sepenuhnya menjadi tanggung jawab pengguna.
        </p>

        <h2>6. Perubahan Ketentuan</h2>
        <p>
          Ketentuan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan
          kepada pelanggan aktif melalui kanal komunikasi yang tersedia.
        </p>

        <h2>7. Penghentian Layanan</h2>
        <p>
          Baik {siteConfig.productName} maupun pelanggan dapat mengakhiri layanan sesuai dengan
          ketentuan yang disepakati di awal kerja sama. Data brand dapat dihapus atas permintaan
          resmi setelah masa layanan berakhir.
        </p>

        <h2>8. Kontak</h2>
        <p>
          Pertanyaan seputar syarat layanan ini dapat disampaikan melalui kanal kontak yang tersedia
          di halaman utama.
        </p>

        <p className="disclaimer">
          Halaman ini adalah draf awal syarat layanan dan disarankan untuk ditinjau oleh penasihat
          hukum sebelum digunakan secara resmi untuk kebutuhan komersial dengan klien.
        </p>
      </section>

      <PublicFooter />

      <style>{`
        .terms-page { background: var(--white); }
        .content {
          max-width: 680px;
          margin: 0 auto;
          padding: 56px 28px 72px;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 12px;
        }
        h1 { font-family: 'Fraunces', serif; font-size: 30px; color: var(--navy); margin: 0 0 8px; }
        .updated { font-size: 13px; color: var(--brown); margin: 0 0 32px; }
        h2 { font-size: 17px; color: var(--navy); margin: 32px 0 10px; }
        p { font-size: 14px; line-height: 1.75; color: var(--ink); margin: 0 0 4px; }
        .disclaimer {
          margin-top: 40px;
          padding: 16px 18px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 13px;
          color: var(--brown);
        }
      `}</style>
    </div>
  );
}
