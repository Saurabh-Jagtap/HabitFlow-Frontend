import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith("/forgotPassword") ||
    pathname.startsWith('/resetPassword');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/habits/:path*', '/settings/:path*', '/security/:path*'],
};
