import type { Metadata } from 'next';

// /[displayName] 동적 SEO 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }> | { displayName: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.displayName || '';
  const cleanName = decodeURIComponent(rawParam).trim().replace(/^@/, '');
  const handle = cleanName || '크리에이터';

  const title = `@${handle} | 마이링크`;
  const description = `${handle}의 마이링크 프로필 — 포트폴리오, 소셜 채널, 최신 작업물을 한 페이지에서 확인하세요.`;

  return {
    title,
    description,
    keywords: [handle, '마이링크', '링크인바이오', '포트폴리오', '프로필'],
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://mylink.io/@${cleanName}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://mylink.io/@${cleanName}`,
    },
  };
}

export { default } from './page';
