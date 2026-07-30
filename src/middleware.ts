// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STATIC_410_GONE_PATHS } from '@/lib/seoPropertyRedirects';

/**
 * Middleware for URL normalization and legacy redirects.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize pathname: strip trailing slash (except root '/') and check lowercase
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const lowerPath = cleanPath.toLowerCase();

  // 0. Immediate 410 Gone check for permanently removed or invalid URLs
  if (
    STATIC_410_GONE_PATHS.has(pathname) ||
    STATIC_410_GONE_PATHS.has(cleanPath) ||
    STATIC_410_GONE_PATHS.has(lowerPath)
  ) {
    return new NextResponse('410 Gone - This listing or page has been permanently removed.', {
      status: 410,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  const url = request.nextUrl.clone();
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const cleanHost = forwardedHost.split(':')[0]; // Strip any internal port (e.g. :3000)
  url.host = cleanHost;
  url.port = ''; // Clear internal port so redirects never point to localhost:3000

  let shouldRedirect = false;

  // 1. Strip 'www.' from the hostname
  if (cleanHost.startsWith('www.')) {
    url.host = cleanHost.replace('www.', '');
    shouldRedirect = true;
  }

  // 2. Force lowercase URLs (skip api, _next, static files)
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except _next, api, and static files for the lowercase/www checks
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
    '/rent/:path*',
    '/property/:path*',
    '/properties/:path*',
    '/pg/:path*',
    '/pg-in-:slug*',
    '/pg-for-boys-in-:slug*',
    '/pg-for-girls-in-:slug*',
  ],
};

