import type { Metadata } from 'next';

// /stats 페이지 SEO 메타데이터
export const metadata: Metadata = {
  title: '링크 통계 | 마이링크',
  description: '링크별 클릭 수 분석, 방문자 통계, 인기 링크 순위를 실시간으로 확인하세요. 나의 콘텐츠 중 무엇이 가장 반응이 좋은지 한눈에 파악합니다.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '나의 링크 통계 대시보드 | 마이링크',
    description: '링크별 실시간 클릭 분석 및 방문자 통계를 확인하세요.',
    type: 'website',
  },
};

export { default } from './page';
