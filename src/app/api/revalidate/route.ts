import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== 'MakeMyStaySecret123') {
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
