import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('naver-site-verification: naver81efee4a46e1ce20bd1ecdf5cfa69700.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
