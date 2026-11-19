import type { Metadata } from 'next';

// /login 페이지 SEO 메타데이터
export const metadata: Metadata = {
  title: '시작하기 | 마이링크',
  description: 'Google 계정으로 1초 만에 로그인하고 나만의 감각적인 링크 페이지를 30분 만에 완성하세요. 코딩 없이 무료로 시작할 수 있습니다.',
  keywords: ['마이링크', '링크인바이오', '링크트리', '포트폴리오', '프로필 페이지', '구글 로그인'],
  robots: { index: false, follow: false },
  openGraph: {
    title: '마이링크 시작하기 — 나만의 링크 페이지를 30분 만에',
    description: 'Google 계정으로 원클릭 가입. 무료로 감각적인 링크인바이오 페이지를 완성하세요.',
    type: 'website',
  },
};

export { default } from './page';
