import {NextResponse, type NextRequest} from 'next/server';
import {SESSION_COOKIE, verifySessionToken} from '@/actions/auth/jwt';

export async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL('/login?error=unauthenticated', request.url));
  }

  if (session.role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
