import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }> | { displayName: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.displayName || 'sungyu626543';
  const cleanName = decodeURIComponent(rawParam).trim().replace(/^@/, '');
  const handle = cleanName || 'sungyu626543';

  const title = `@${handle} | 마이링크`;
  const description = `${handle}님의 마이링크 프로필 — 포트폴리오, 소셜 채널, 최신 작업물을 한 페이지에서 확인하세요.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-link-mu-lilac.vercel.app';
  const profileUrl = `${siteUrl}/${cleanName}`;

  return {
    title,
    description,
    keywords: [handle, '마이링크', '링크인바이오', '포트폴리오', '프로필'],
    openGraph: {
      title,
      description,
      type: 'profile',
      url: profileUrl,
      images: [
        {
          url: `${profileUrl}/opengraph-image`,
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
      images: [`${profileUrl}/opengraph-image`],
    },
    alternates: {
      canonical: profileUrl,
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
