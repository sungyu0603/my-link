import type { Metadata } from 'next';

// /links 페이지 SEO (루트 페이지와 동일, noindex 처리)
export const metadata: Metadata = {
  title: '내 링크 관리 | 마이링크',
  description: '나만의 링크를 추가, 수정, 삭제하고 클릭 통계를 확인하세요.',
  robots: { index: false, follow: false },
};

export { default } from '../page';
