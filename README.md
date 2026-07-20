# BIS Role System — Panduan Integrasi

Paket ini berisi **scaffold Next.js dari nol** + implementasi role system
(super_admin / admin / client), mengikuti pola RBAC 3-lapis dari Creator Pulse
(RLS + middleware + column-level GRANT).

Karena repo BIS kamu sekarang masih berisi 2 file HTML statis (belum project
Next.js), paket ini sudah termasuk `package.json`, `next.config.js`, dan
struktur dasar `app/` supaya bisa langsung `npm install` & jalan.

## 0. Pindahkan 2 file HTML lama

Sebelum copy paket ini ke repo, pindahkan `brand_intelligence_v2.html` (dan
file HTML lain) ke folder `/public` atau folder terpisah (mis. `/legacy/`) —
supaya tidak konflik dengan struktur `app/` Next.js yang baru. File itu masih
berguna sebagai dokumentasi arsitektur, tidak perlu dihapus.

## 1. Jalankan migration SQL

Buka Supabase SQL Editor project `brand-intelligence`, jalankan:

```
sql/001_role_system.sql
```

Ini akan:
- Membuat tabel `profiles`
- Membuat trigger auto-create profile saat user baru signup
- Mengaktifkan RLS + policy untuk `profiles` dan `brands`
- Menambahkan GRANT eksplisit (wajib — RLS saja tidak cukup, ini learning lama kita)

**Cek dulu sebelum run:** pastikan tabel `brands` dan `user_brands` sudah ada
(sudah dikonfirmasi ada di project ini). Kalau nama kolom beda dari asumsi
script (`brand_id`, `user_id`), sesuaikan dulu.

## 2. Copy SELURUH isi paket ini ke root repo BIS

Struktur folder paket ini sudah dirancang supaya bisa langsung di-copy ke
root repo (bukan cuma beberapa file):

```
package.json, next.config.js, .gitignore, .env.local.example  → root
app/layout.js, app/page.js                                     → app/
app/login/page.js                                               → app/login/
app/set-password/page.js                                        → app/set-password/
app/auth/callback/route.js                                      → app/auth/callback/
app/dashboard/team/page.js                                      → app/dashboard/team/
app/api/team/route.js                                           → app/api/team/
app/api/team/invite/route.js                                    → app/api/team/invite/
lib/supabase-server.js, supabase-browser.js, supabase-admin.js  → lib/
middleware.js                                                    → root
components/TeamInviteForm.js                                     → components/
```

## 3. Install dependency

```bash
npm install
```

(`package.json` sudah pin ke versi yang kompatibel: Next.js 14.2.35,
`@supabase/supabase-js` 2.45.4 — sama seperti yang dipakai Creator Pulse,
supaya tidak kena masalah kompatibilitas format API key Supabase.)

## 4. Environment variables

Copy `.env.local.example` → `.env.local`, isi dengan nilai asli dari Supabase
Dashboard → Settings → API:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   (pakai format JWT lama eyJhbGc..., bukan sb_publishable_)
SUPABASE_SERVICE_ROLE_KEY       (server-only, JANGAN commit ke git)
```

Untuk deploy, isi 3 variable yang sama di Vercel → Settings → Environment
Variables.

## 5. Jalankan lokal untuk tes

```bash
npm run dev
```

Buka `http://localhost:3000` — akan redirect ke `/login` (karena belum ada
sesi). Setelah super_admin pertama dibuat (langkah selanjutnya) dan login,
akan redirect otomatis ke `/dashboard/brands`.

## 6. Buat super_admin pertama (kamu sendiri)

Lihat query SQL di sesi chat — ambil `user id` dari `auth.users`, lalu insert
manual ke `profiles` dengan `role = 'super_admin'`. Ini satu-satunya langkah
yang harus manual, karena invite butuh super_admin yang sudah ada.

## 7. Belum termasuk di paket ini (langkah lanjutan)

- Halaman `/dashboard/brands`, `/dashboard/my-scans`, `/dashboard/client` —
  ini rangka routing/middleware-nya sudah siap, tapi konten halamannya
  menyusul di tahap build berikutnya (sudah dirancang di sesi brainstorm)
- Halaman login (`/login`) — middleware me-redirect ke sini, asumsikan
  sudah ada dari setup Supabase Auth sebelumnya, sesuaikan path kalau beda
- Email template invite Supabase — defaultnya bahasa Inggris, bisa
  dikustomisasi di Supabase Dashboard → Authentication → Email Templates

## 8. Testing checklist

- [ ] Jalankan migration di Supabase, cek tabel `profiles` muncul
- [ ] Buat 1 user super_admin manual (lewat SQL, sekali saja di awal):
      ```sql
      insert into public.profiles (id, role, full_name)
      values ('<auth-user-id-kamu>', 'super_admin', 'Nama Kamu');
      ```
- [ ] Login sebagai super_admin, buka `/dashboard/team`, coba invite 1 admin
- [ ] Cek email invite masuk, set password, login → harus redirect ke
      `/dashboard/my-scans` (home admin)
- [ ] Coba akses `/dashboard/team` sebagai admin → harus ke-redirect balik
      (bukan super_admin)
- [ ] Invite 1 client dengan brand tertentu, cek `user_brands` ke-insert
      otomatis
