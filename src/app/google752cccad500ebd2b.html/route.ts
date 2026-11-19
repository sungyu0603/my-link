import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return new NextResponse('google-site-verification: google752cccad500ebd2b.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'all, index, follow',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
