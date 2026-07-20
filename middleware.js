// middleware.js
// Lapis ke-2 dari proteksi 3-lapis (RLS Postgres + middleware ini + column GRANT).
// Middleware TIDAK boleh jadi satu-satunya proteksi — RLS tetap wajib aktif
// di setiap tabel, supaya kalau ada bug di sini, data tetap aman.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Route yang cuma boleh diakses super_admin
const SUPER_ADMIN_ONLY = ['/dashboard/brands', '/dashboard/team', '/dashboard/add-brand'];

// Route yang boleh diakses admin & super_admin, TAPI TIDAK client
const ADMIN_AND_ABOVE = ['/dashboard/my-scans', '/dashboard/export'];

// Route khusus client
const CLIENT_ONLY = ['/dashboard/client'];

export async function middleware(request) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Belum login & akses /dashboard/* → redirect ke login
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && path.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role ?? 'client';

    // Homepage redirect per role (dipanggil dari /dashboard root)
    if (path === '/dashboard') {
      if (role === 'super_admin') return NextResponse.redirect(new URL('/dashboard/brands', request.url));
      if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/my-scans', request.url));
      return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }

    if (SUPER_ADMIN_ONLY.some((p) => path.startsWith(p)) && role !== 'super_admin') {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }

    if (ADMIN_AND_ABOVE.some((p) => path.startsWith(p)) && role === 'client') {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }

    if (CLIENT_ONLY.some((p) => path.startsWith(p)) && role !== 'client') {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }
  }

  return response;
}

function homeForRole(role) {
  if (role === 'super_admin') return '/dashboard/brands';
  if (role === 'admin') return '/dashboard/my-scans';
  return '/dashboard/client';
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
