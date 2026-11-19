# 🔗 마이링크 (MyLink)

> **링크트리(Linktree) 클론 서비스** — 소셜 미디어, 웹사이트, 프로젝트 링크를 모바일 최적화된 하나의 세련된 랜딩 페이지로 모아 보여주는 개인 링크 허브입니다.

<br/>

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| 🔐 **구글 소셜 로그인** | Firebase Auth 기반 Google 계정 로그인 / 로그아웃 |
| ☁️ **Firestore 클라우드 동기화** | 사용자별 `users/{uid}/links` 경로로 링크 개인화 저장 |
| 👤 **프로필 헤더** | 아바타, 이름, 한 줄 소개(Bio), 소셜 아이콘 바 (GitHub · Instagram · YouTube · X · LinkedIn) |
| 🃏 **커스텀 링크 카드** | 제목, 서브텍스트, Lucide 아이콘, 대표/HOT 배지, 클릭 수 집계 |
| ➕ **링크 추가 / 수정 / 삭제** | 모달 폼 기반 실시간 CRUD, 낙관적 업데이트(Optimistic UI) 적용 |
| 📊 **통계 요약** | 전체 링크 수, 대표 링크 수, 누적 클릭 수 한눈에 확인 |
| 🎨 **나이키 에디토리얼 뷰** | 1:1 이미지 그리드 기반 에디토리얼 카탈로그 쇼케이스 |
| 📱 **모바일 퍼스트** | 스마트폰 비율(max-w-xl) 중앙 정렬, 반응형 레이아웃 |

<br/>

## 🛠 기술 스택

```
Framework     Next.js 16 (App Router, Turbopack) + React 19
Language      TypeScript
Styling       Tailwind CSS v4 (100% 유틸리티 클래스, Module CSS 배제)
Design System shadcn/ui + Nike Commerce & Editorial Design System
Icons         Lucide React
State         Zustand 5 (persist 미들웨어, LocalStorage 영속화)
Backend       Firebase Auth (Google 로그인) + Cloud Firestore
Server Query  TanStack React Query v5
Forms         React Hook Form + Zod (유효성 검사)
Toast         Sonner
Charts        Recharts
Deploy        Vercel + Firebase Functions
```

<br/>

## 🎨 디자인 시스템

**Nike Commerce & Editorial Design System** 철학을 `shadcn/ui` 위에 구현합니다.

- **Mechanical Restraint** — 장식적 그라디언트·소프트 섀도우 완전 배제
- **Pill vs Zero-Radius** — 버튼·배지는 `rounded-full`, 카드·컨테이너는 `rounded-none shadow-none`
- **컬러 토큰** — `#ffffff` 캔버스 / `#111111` 잉크 / `#f5f5f5` Soft Cloud / `#cacacb` Hairline
- **Nike Tap Feedback** — `active:scale-[0.96] active:opacity-70` 햅틱 감각 버튼 모션

<br/>

## 🚀 시작하기

### 사전 준비

- Node.js 20+
- Firebase 프로젝트 (Auth + Firestore 활성화)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
cp .env.local.example .env.local
# → Firebase 프로젝트 설정값 입력

# 개발 서버 실행 (Turbopack)
npm run dev
```

> 브라우저에서 `http://localhost:3000` 접속

### 환경 변수 (`.env.local`)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

<br/>

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 페이지 (로그인/비로그인 분기)
│   ├── [displayName]/        # 개인 프로필 공개 페이지 (동적 라우트)
│   ├── links/                # 링크 관리 페이지
│   ├── stats/                # 통계 페이지
│   └── login/                # 로그인 페이지
├── components/
│   ├── ui/                   # shadcn/ui 기본 원자 컴포넌트
│   ├── links/                # 링크 도메인 컴포넌트
│   │   ├── ProfileBanner.tsx   # 아바타, Bio, 소셜 아이콘 바
│   │   ├── LinkList.tsx        # 검색·필터·카드 목록
│   │   ├── LinkCardItem.tsx    # 단일 링크 카드
│   │   ├── AddLinkDialog.tsx   # 링크 추가 모달
│   │   ├── StatsSummary.tsx    # 통계 요약 카드
│   │   ├── EditorialGrid.tsx   # 나이키 에디토리얼 그리드
│   │   └── UnauthenticatedView.tsx  # 미로그인 랜딩 페이지
│   └── layout/
│       └── Header.tsx          # 글로벌 헤더 (로그인·뷰모드 전환)
├── store/
│   └── useMyLinkStore.ts     # Zustand 전역 상태 (Firestore 동기화 포함)
├── hooks/
│   ├── useLinksQuery.ts      # TanStack Query 링크 CRUD 훅
│   └── useProfileQuery.ts    # TanStack Query 프로필 훅
├── lib/
│   ├── firebase.ts           # Firebase 초기화
│   ├── auth.ts               # Firebase Auth 헬퍼
│   ├── firestore-links.ts    # Firestore CRUD 함수
│   └── linkValidation.ts     # Zod 스키마
├── data/
│   ├── dummyLinks.ts         # 시연용 더미 링크 데이터
│   └── initialProfile.ts     # 초기 프로필 데이터
└── types/
    └── profile.ts            # TypeScript 타입 정의
```

<br/>

## 📐 데이터 모델

```typescript
interface UserProfile {
  name: string;
  handle: string;        // @username
  bio: string;
  avatarUrl: string;
  theme: 'midnight' | 'minimal' | 'sunset' | 'emerald';
  socials: SocialLink[];
  links: ProfileLink[];
}

interface ProfileLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  iconName: string;      // Lucide 아이콘 이름
  badge?: string;        // '대표 링크' | 'HOT' | 'NEW' 등
  isFeatured?: boolean;
  clicks: number;
}
```

<br/>

## 🗺 개발 로드맵

```
✅ Step 1  로컬스토리지 기반 프로필 뷰 + Nike shadcn/ui 디자인 시스템
✅ Step 2  Firebase Auth 구글 로그인 + Firestore 개인화 클라우드 동기화
🔮 Step 3  관리자 대시보드 (2분할 에디터 + 모바일 목업 미리보기)
🔮 Step 4  드래그 앤 드롭 링크 순서 변경
🔮 Step 5  통계 분석 대시보드 (일별 방문자, 링크별 클릭 CTR)
🔮 Step 6  다중 사용자 · 커스텀 도메인 지원
```

<br/>

## 📜 스크립트

```bash
npm run dev      # Turbopack 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 코드 검사
```

<br/>

## 📄 라이선스

[LICENSE](./LICENSE) 파일을 참고하세요.
