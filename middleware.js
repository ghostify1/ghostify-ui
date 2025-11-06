import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;
  const publicPaths = ['/invite', '/login', '/api'];

  const hasInvite = req.cookies.get('ghostify_invite_ok')?.value === '1';

  if (!hasInvite && !publicPaths.some(p => path.startsWith(p))) {
    url.pathname = '/invite';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api).*)'],
};
