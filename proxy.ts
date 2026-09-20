import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/actions/auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL('/login?error=unauthenticated', request.url));
  }

  if (isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=forbidden', request.url));
  }

  // Admins have no business in the customer dashboard  send them home.
  if (isUserRoute && session.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/user', '/user/:path*'],
};

