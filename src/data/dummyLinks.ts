import { ProfileLink } from '../types/profile';

/**
 * 1. 표준 MyLink 규격 (ProfileLink) 더미 데이터
 * - 포트폴리오, 기술 블로그, 오픈소스, 뉴스레터, 협업/멘토링 등 다양한 실무형 링크 세트
 */
export const dummyProfileLinks: ProfileLink[] = [
  // ── 대표 및 포트폴리오 ──
  {
    id: 'link-01',
    title: '공식 포트폴리오 웹사이트 🌐',
    subtitle: '주요 상용화 프로젝트, 아키텍처 다이어그램 및 상세 케이스 스터디',
    url: 'https://sunkyu.dev',
    iconName: 'Globe',
    badge: '대표 링크',
    isFeatured: true,
    clicks: 3420,
    category: 'general',
  },
  {
    id: 'link-02',
    title: '인터랙티브 웹 이력서 & 경력 기술서 📄',
    subtitle: '경력 사항, 실무 기술 스택 숙련도 및 프로젝트 기여도 한눈에 보기',
    url: 'https://resume.sunkyu.dev',
    iconName: 'BookOpen',
    badge: '2026 최신화',
    isFeatured: true,
    clicks: 1850,
    category: 'general',
  },

  // ── 기술 블로그 & 아티클 (콘텐츠) ──
  {
    id: 'link-03',
    title: '기술 블로그 (Tech Insights & Engineering) ✍️',
    subtitle: 'Next.js 16 최적화 기법, 분산 아키텍처 설계 및 프론트엔드 성능 튜닝 회고',
    url: 'https://velog.io/@sunkyu',
    iconName: 'BookOpen',
    badge: 'HOT 아티클',
    isFeatured: true,
    clicks: 5240,
    category: 'content',
  },
  {
    id: 'link-04',
    title: '주간 프론트엔드 엔지니어링 뉴스레터 📮',
    subtitle: '매주 월요일 아침, 글로벌 최신 웹 트렌드와 엄선된 오픈소스 큐레이션',
    url: 'https://newsletter.sunkyu.dev',
    iconName: 'Mail',
    badge: '무료 구독 (1.8k명)',
    isFeatured: false,
    clicks: 980,
    category: 'content',
  },
  {
    id: 'link-05',
    title: 'YouTube 개발 튜토리얼 채널 🎬',
    subtitle: '실무 단위 테스트, 반응형 UI 시스템 및 성능 측정 실전 라이브 코딩',
    url: 'https://youtube.com/@sunkyu-dev',
    iconName: 'Youtube',
    badge: '영상 42편',
    isFeatured: false,
    clicks: 2120,
    category: 'content',
  },

  // ── 오픈소스 & 프로젝트 ──
  {
    id: 'link-06',
    title: 'GitHub 오픈소스 레포지토리 & 유틸리티 📦',
    subtitle: '재사용 가능한 React 19 UI 컴포넌트 킷 및 TypeScript 타입 헬퍼 라이브러리',
    url: 'https://github.com/seongyu-kim',
    iconName: 'Github',
    badge: '1.2k Stars',
    isFeatured: true,
    clicks: 4190,
    category: 'project',
  },
  {
    id: 'link-07',
    title: 'HyperLink - 올인원 링크인바이오 플랫폼 🚀',
    subtitle: 'Next.js 기반 초경량 크리에이터 프로필 & 실시간 클릭 애널리틱스 솔루션',
    url: 'https://hyperlink.sunkyu.dev',
    iconName: 'Sparkles',
    badge: 'Live Demo',
    isFeatured: false,
    clicks: 1670,
    category: 'project',
  },
  {
    id: 'link-08',
    title: 'AI Code Reviewer GitHub Action 🤖',
    subtitle: 'PR 생성 시 보안 취약점과 코드 스멜을 자동 감지하는 LLM 분석 봇',
    url: 'https://github.com/marketplace/actions/ai-code-reviewer',
    iconName: 'Github',
    badge: 'v2.1 배포',
    isFeatured: false,
    clicks: 860,
    category: 'project',
  },

  // ── 네트워킹, 멘토링 & 연락처 ──
  {
    id: 'link-09',
    title: '1:1 커피챗 & 기술 멘토링 예약 💬',
    subtitle: '커리어 전환, 포트폴리오 리뷰, 스타트업 개발 아키텍처 고민 상담',
    url: 'https://calendly.com/sunkyu-kim',
    iconName: 'MessageSquare',
    badge: '이번 주 예약 가능',
    isFeatured: false,
    clicks: 740,
    category: 'contact',
  },
  {
    id: 'link-10',
    title: '프로젝트 협업 & 외주/채용 제안 이메일 ✉️',
    subtitle: '공식 제휴 문의 및 이력서 검토 제안 (24시간 이내 직접 회신)',
    url: 'mailto:sunkyu@hanyang.ac.kr',
    iconName: 'Mail',
    badge: '빠른 회신',
    isFeatured: false,
    clicks: 530,
    category: 'contact',
  },
  {
    id: 'link-11',
    title: '창작 활동 커피 한 잔 후원하기 ☕',
    subtitle: '양질의 오픈소스 개발과 무료 기술 콘텐츠 발행에 따뜻한 응원을 보태주세요',
    url: 'https://buymeacoffee.com/sunkyu',
    iconName: 'Coffee',
    badge: 'Buy Me a Coffee',
    isFeatured: false,
    clicks: 390,
    category: 'general',
  },
];

/**
 * 2. Nike Editorial 스타일 전용 규격 (LinkCardItem) 더미 데이터
 * - 고해상도 언스플래시 이미지, 나이키 컬러 스와치, 태그 및 프라이스/상태 뱃지 포함
 */
export interface EditorialLinkItem {
  id: string;
  name: string;
  category: string;
  badge?: string;
  url: string;
  imageUrl: string;
  tag: 'CORE' | 'WRITING' | 'NETWORK';
  priceNote?: string;
  isSale?: boolean;
  swatches: string[];
}

export const dummyEditorialLinks: EditorialLinkItem[] = [
  {
    id: 'ed-01',
    name: 'Official Portfolio & Case Studies',
    category: "Engineer's Flagship Digital Space",
    badge: 'JUST IN',
    url: 'https://sunkyu.dev',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    tag: 'CORE',
    priceNote: 'Live V2.5',
    swatches: ['#111111', '#cacacb', '#f5f5f5'],
  },
  {
    id: 'ed-02',
    name: 'Technical Blog (Tech Insights)',
    category: 'Systems, Next.js Architecture & Retrospectives',
    badge: 'HIGH DEMAND',
    url: 'https://velog.io/@sunkyu',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    tag: 'WRITING',
    priceNote: '5 New Articles',
    isSale: true,
    swatches: ['#111111', '#0a7281'],
  },
  {
    id: 'ed-03',
    name: 'GitHub Open Source Repositories',
    category: 'Component Libraries & Toolkits',
    badge: '1.2K STARS',
    url: 'https://github.com/seongyu-kim',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
    tag: 'CORE',
    priceNote: 'MIT Licensed',
    swatches: ['#111111', '#4b4b4d'],
  },
  {
    id: 'ed-04',
    name: 'Developer Newsletter Edition',
    category: 'Weekly Frontend Patterns & Production Notes',
    badge: 'WEEKLY',
    url: 'https://newsletter.sunkyu.dev',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    tag: 'WRITING',
    priceNote: 'Free Subscription',
    swatches: ['#ffffff', '#cacacb'],
  },
  {
    id: 'ed-05',
    name: 'HyperLink Cloud Architecture',
    category: 'Production SaaS Case Study & Telemetry System',
    badge: 'FEATURED',
    url: 'https://hyperlink.sunkyu.dev',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    tag: 'CORE',
    priceNote: 'System Specs',
    swatches: ['#111111', '#6366f1', '#e0e7ff'],
  },
  {
    id: 'ed-06',
    name: '1:1 Technical Mentoring & Coffee Chat',
    category: 'Code Architecture & Career Advisory',
    badge: 'LIMITED SLOTS',
    url: 'https://calendly.com/sunkyu-kim',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    tag: 'NETWORK',
    priceNote: 'Available Weekly',
    swatches: ['#111111', '#39393b'],
  },
  {
    id: 'ed-07',
    name: 'Interactive Web Resume & Experience',
    category: 'Engineering Milestones & Skill Graph',
    badge: 'VERIFIED',
    url: 'https://resume.sunkyu.dev',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    tag: 'CORE',
    priceNote: 'PDF & Web',
    swatches: ['#111111', '#e5e5e5'],
  },
  {
    id: 'ed-08',
    name: 'Direct Project Inquiry via Email',
    category: 'sunkyu@hanyang.ac.kr',
    badge: 'PRIORITY',
    url: 'mailto:sunkyu@hanyang.ac.kr',
    imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=80',
    tag: 'NETWORK',
    priceNote: 'Response within 24h',
    swatches: ['#111111'],
  },
  {
    id: 'ed-09',
    name: 'Buy Me a Coffee Sponsorship',
    category: 'Support Open-Source & Engineering Writings',
    badge: 'COMMUNITY',
    url: 'https://buymeacoffee.com/sunkyu',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    tag: 'NETWORK',
    priceNote: 'Back Creator',
    swatches: ['#ffdd00', '#111111'],
  },
];
