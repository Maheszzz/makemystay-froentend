// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Legacy PG URL redirect middleware.
 * Handles URLs of the form:
 *   /pg-in-:slug
 *   /pg-for-boys-in-:slug
 *   /pg-for-girls-in:slug
 * and permanently redirects them to the new canonical path `/pg/:slug`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /pg-in-<slug>
  const pgInMatch = pathname.match(/^\/pg-in-(.+)$/);
  if (pgInMatch) {
    const slug = pgInMatch[1];
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  // Match /pg-for-boys-in-<slug>
  const boysMatch = pathname.match(/^\/pg-for-boys-in-(.+)$/);
  if (boysMatch) {
    const slug = boysMatch[1];
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  // Match /pg-for-girls-in-<slug>
  const girlsMatch = pathname.match(/^\/pg-for-girls-in-(.+)$/);
  if (girlsMatch) {
    const slug = girlsMatch[1];
    return NextResponse.redirect(new URL(`/pg/${slug}`, request.url), 301);
  }

  // If no legacy match, continue to the next handler.
  return NextResponse.next();
}

// Apply middleware only to the legacy patterns.
export const config = {
  matcher: [
    '/pg-in-:slug*',
    '/pg-for-boys-in-:slug*',
    '/pg-for-girls-in-:slug*',
  ],
};
