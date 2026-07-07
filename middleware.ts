// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for URL normalization and legacy redirects.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';

  let shouldRedirect = false;

  // 1. Force HTTPS in production (assuming 'x-forwarded-proto' is set by the proxy)
  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  // 2. Strip 'www.' from the hostname
  if (host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    url.host = newHost;
    shouldRedirect = true;
  }

  // 3. Force lowercase URLs (skip api, _next, static files)
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.match(/\.(.*)$/) && // skip files with extensions
    pathname !== pathname.toLowerCase()
  ) {
    url.pathname = pathname.toLowerCase();
    shouldRedirect = true;
  }

  // Execute canonical normalization redirects
  if (shouldRedirect) {
    return NextResponse.redirect(url, 301);
  }

  // 4. Legacy PG URL redirect handlers
  const pgInMatch = pathname.match(/^\/pg-in-(.+)$/i);
  if (pgInMatch) {
    const slug = pgInMatch[1].toLowerCase();
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  const boysMatch = pathname.match(/^\/pg-for-boys-in-(.+)$/i);
  if (boysMatch) {
    const slug = boysMatch[1].toLowerCase();
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  const girlsMatch = pathname.match(/^\/pg-for-girls-in-(.+)$/i);
  if (girlsMatch) {
    const slug = girlsMatch[1].toLowerCase();
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except _next, api, and static files for the lowercase/www checks
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
    // Also include legacy routes just in case they aren't caught
    '/pg-in-:slug*',
    '/pg-for-boys-in-:slug*',
    '/pg-for-girls-in-:slug*',
  ],
};
