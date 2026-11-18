import { timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function secretsMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.FRONTEND_REVALIDATE_SECRET?.trim();
  if (!expectedSecret) {
    return NextResponse.json({ message: 'Revalidation secret is not configured' }, { status: 500 });
  }

  const secret = request.nextUrl.searchParams.get('secret');
  if (!secretsMatch(secret, expectedSecret)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tags = body.tags || [];

    if (!Array.isArray(tags)) {
      return NextResponse.json({ message: 'Tags must be an array' }, { status: 400 });
    }

    for (const tag of tags) {
      if (typeof tag === 'string') {
        revalidateTag(tag);
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), tags });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}
