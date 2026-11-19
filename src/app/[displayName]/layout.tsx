import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }> | { displayName: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.displayName || '';
  const cleanName = decodeURIComponent(rawParam).trim().replace(/^@/, '');
  const handle = cleanName || '마이링크';

  const title = `@${handle} | 마이링크`;
  const description = `${handle}님의 마이링크 프로필 — 포트폴리오, 소셜 채널, 최신 작업물을 한 페이지에서 확인하세요.`;

  return {
    title,
    description,
    keywords: [handle, '마이링크', '링크인바이오', '포트폴리오', '프로필'],
    openGraph: {
      title,
      description,
      type: 'profile',
      // metadataBase 기반 상대경로 — Vercel이 자동으로 절대 URL로 변환
      url: `/${cleanName}`,
      images: [
        {
          url: `/${cleanName}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${handle}님의 마이링크 프로필`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/${cleanName}/opengraph-image`],
    },
    alternates: {
      canonical: `/${cleanName}`,
    },
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
