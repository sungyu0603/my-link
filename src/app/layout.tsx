import type { Metadata } from "next";
import { Bebas_Neue, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-campaign",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),

  // 기본 타이틀 & 템플릿 (하위 페이지가 오버라이드하면 "%s | 마이링크" 형태로 조합됨)
  title: {
    default: '마이링크 | 나만의 링크 페이지를 30분 만에',
    template: '%s | 마이링크',
  },
  description:
    '인스타그램, 깃허브, 유튜브, 블로그를 하나의 감각적인 프로필 페이지로 모으는 올인원 링크인바이오 플랫폼. 코딩 없이 30분 만에 나만의 디지털 포트폴리오를 완성하세요.',
  keywords: [
    '마이링크', '링크인바이오', '링크트리', '프로필 페이지', '포트폴리오',
    '링크 모음', '크리에이터', '인스타그램 바이오링크', 'linktree',
    '개발자 포트폴리오', '블로그 링크', 'mylink',
  ],
  authors: [{ name: '마이링크', url: 'https://mylink.io' }],
  creator: '마이링크',
  publisher: '마이링크',
  category: 'technology',

  // 오픈그래프 (SNS 공유 미리보기)
  openGraph: {
    title: '마이링크 — 나만의 링크 페이지를 30분 만에',
    description:
      '코딩 없이 30분 만에 만드는 감각적인 나만의 링크 페이지. 인스타그램, 깃허브, 유튜브를 한곳에.',
    siteName: '마이링크',
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // 트위터 카드
  twitter: {
    card: 'summary_large_image',
    title: '마이링크 — 나만의 링크 페이지를 30분 만에',
    description: '코딩 없이 30분 만에 만드는 감각적인 나만의 링크 페이지.',
    creator: '@mylink_io',
  },

  // 검색엔진 크롤링 정책
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 사이트 소유 확인 (네이버 & 구글 서치콘솔)
  verification: {
    google: '752cccad500ebd2b',
    other: {
      'naver-site-verification': '81efee4a46e1ce20bd1ecdf5cfa69700',
    },
  },

  // 아이콘
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  // 정식 URL
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    languages: { 'ko-KR': '/' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={cn("h-full", "antialiased", bebasNeue.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111111]">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
