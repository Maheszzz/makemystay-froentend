// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STATIC_410_GONE_PATHS } from '@/lib/seoPropertyRedirects';

/**
 * Middleware for 410 Gone enforcement, URL normalization, and query-param noindex headers.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    // Keep raw pathname if malformed percent-encoding
  }

  // Normalize pathname: strip trailing slash (except root '/') and check lowercase
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const lowerPath = cleanPath.toLowerCase();
  const decodedClean = decodedPath.length > 1 && decodedPath.endsWith('/')
    ? decodedPath.slice(0, -1)
    : decodedPath;
  const decodedLower = decodedClean.toLowerCase();

  // 0. Immediate 410 Gone check for permanently removed or invalid URLs
  if (
    STATIC_410_GONE_PATHS.has(pathname) ||
    STATIC_410_GONE_PATHS.has(cleanPath) ||
    STATIC_410_GONE_PATHS.has(lowerPath) ||
    STATIC_410_GONE_PATHS.has(decodedPath) ||
    STATIC_410_GONE_PATHS.has(decodedClean) ||
    STATIC_410_GONE_PATHS.has(decodedLower)
  ) {
    return new NextResponse('Gone', {
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

  const response = NextResponse.next();

  // 3. Filter / parameter URLs must not be indexed (follow links, noindex page)
  if (
    searchParams.toString().length > 0 &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next')
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except _next, api, and static files
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
    '/rent/:path*',
    '/property/:path*',
    '/properties/:path*',
    '/pg/:path*',
  ],
};

