import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 네이버 서치어드바이저 확인 파일 요청 가로채기
  if (pathname.startsWith('/naver') && pathname.endsWith('.html')) {
    const filename = pathname.replace(/^\//, '');
    return new NextResponse(`naver-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'all, index, follow',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // 구글 서치콘솔 확인 파일 요청 가로채기
  if (pathname.startsWith('/google') && pathname.endsWith('.html')) {
    const filename = pathname.replace(/^\//, '');
    return new NextResponse(`google-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'all, index, follow',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
