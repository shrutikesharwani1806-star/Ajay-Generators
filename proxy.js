import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Note: Role check happens in the API routes for security, 
    // but we can add basic redirection here if user data is stored in JWT or session
  }

  // Protect profile and booking routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/my-bookings')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/my-bookings/:path*', '/booking/:path*'],
};
