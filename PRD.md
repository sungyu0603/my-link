# [PRD] 마이링크 (MyLink) 제품 요구사항 정의서

- **문서 버전:** v1.4.0 (Tailwind CSS 단일화 및 shadcn/ui 기반 재사용 컴포넌트 아키텍처 확정)
- **작성일:** 2026-11-17
- **작성자:** Antigravity (AI Pair Programmer)
- **상태:** 확정 (모듈 CSS 배제 및 Pure Tailwind CSS 통일, shadcn/ui 재사용 컴포넌트 구성)

---

## 1. 프로젝트 개요 (Executive Summary)

### 1.1 제품 소개
**"마이링크(MyLink)"**는 소셜 미디어, 웹사이트, 프로젝트 링크를 모바일 최적화된 하나의 랜딩 페이지로 모아 보여주는 **링크트리(Linktree) 클론 서비스**입니다.

### 1.2 시연 및 단계별 개발 목표 (Demo Strategy)
- **단계적 시연(Step-by-Step Demo):** 한 번에 모든 기능을 구축하지 않고, 시연 흐름에 맞추어 **"로컬스토리지 기반 프로필 페이지"**부터 순차적으로 구현합니다.
- **1단계 핵심 목표:** 복잡한 관리자 대시보드, 회원가입/인증, 통계 차트는 **추후 단계로 유예**하고, 브라우저의 **LocalStorage** 데이터를 기반으로 동작하는 완성도 높은 **프로필 페이지**를 구현합니다.

---

## 2. 사용자 페르소나 및 핵심 시나리오 (User Personas & Scenarios)

### 2.1 사용자 페르소나
| 페르소나 | 역할 | 주요 니즈 |
|---|---|---|
| **시연자 / 크리에이터 (김선규)** | 프로필 소유자 | 복잡한 백엔드 없이도 브라우저 상에서 본인의 SNS, 포트폴리오, 프로젝트 링크를 감각적으로 모아 보여주고 시연하고 싶음 |
| **방문자 / 팔로워 (엔드 유저)** | 링크 탐색자 | 인스타그램이나 X(트위터) 프로필 링크를 누르고 들어와 크리에이터의 주요 작업물과 채널에 빠르게 접근하고 싶음 |

### 2.2 핵심 사용자 시나리오

#### 시나리오 A: 방문자의 프로필 탐색 및 링크 이동
1. **진입:** 방문자가 모바일(또는 PC) 브라우저에서 마이링크 페이지에 접속합니다.
2. **첫인상 탐색:** 상단 원형 아바타, 이름, 한 줄 소개(Bio), 구직/활동 상태 배지를 한눈에 확인합니다.
3. **소셜 채널 탐색:** 상단 소셜 아이콘 바(GitHub, Instagram, YouTube 등)에서 원하는 플랫폼 아이콘을 탭하여 해당 SNS로 이동합니다.
4. **목적 링크 클릭:** '대표 링크' 배지가 붙은 프로젝트나 블로그 링크 카드를 탭하여 새 탭(`target="_blank"`)에서 콘텐츠를 확인합니다.

#### 시나리오 B: 시연자(호스트)의 로컬스토리지 데이터 로드 및 시연
1. **첫 방문 자동 초기화:** 시연자가 브라우저를 처음 열면, 준비된 기본 프로필 데이터(`initialProfileData`)가 Zustand 스토어를 거쳐 브라우저 `localStorage`에 자동 생성됩니다.
2. **실시간 렌더링:** 별도의 로딩 지연 없이 로컬스토리지의 프로필 정보와 링크 카드들이 즉각적으로 화면에 렌더링됩니다.
3. **데이터 지속성 검증:** 브라우저를 새로고침하거나 창을 닫았다 다시 열어도, 로컬스토리지에 저장된 데이터가 그대로 유지되어 일관된 상태가 보장됩니다.
4. **시연 편의 조작:** 시연 중 로컬스토리지 데이터를 초기화(Reset)하거나 샘플 데이터를 변경할 때, 화면이 즉각 반응하여 반영되는 모습을 시연 청중에게 선보입니다.

---

## 3. 개발 범위 정의 (Scope Definition)

| 구분 | 기능 항목 | 상태 | 설명 |
|---|---|:---:|---|
| **Step 1<br>(현재 집중)** | **로컬스토리지 연동** | ✅ 포함 | Zustand + LocalStorage를 통해 브라우저에 저장된 데이터를 불러오고 실시간 동기화 |
| | **모바일 최적화 프로필 뷰** | ✅ 포함 | 스마트폰 화면 비율(최대 480px) 중앙 정렬의 유려한 반응형 UI |
| | **프로필 헤더 & 아바타** | ✅ 포함 | 프로필 이미지, 닉네임, 한 줄 소개(Bio), 구직/활동 상태 배지 |
| | **소셜 미디어 아이콘 바** | ✅ 포함 | GitHub, Instagram, YouTube, X, LinkedIn, Email 링크 |
| | **커스텀 링크 버튼 목록** | ✅ 포함 | 제목, 서브텍스트, 아이콘(Lucide), 뱃지(대표/HOT), 외부 링크 연결 |
| | **시연용 데이터 초기화/샘플** | ✅ 포함 | 시연 중 데이터를 초기 상태로 되돌리거나 확인할 수 있는 편의 기능 |
| **Step 2+<br>(향후 단계)** | **관리자 대시보드 (2-Split Editor)** | ⏸️ 유예 | 좌측 링크 편집기 + 우측 실시간 모바일 목업 (후속 개발) |
| | **통계 및 분석 (Analytics)** | ⏸️ 유예 | 일자별 방문자 수, 링크별 클릭 수, CTR 통계 차트 (후속 개발) |
| | **회원가입 / 소셜 로그인 인증** | ⏸️ 유예 | Google, Kakao 로그인 및 다중 사용자 세션 관리 (후속 개발) |

---

## 4. 1단계 핵심 기능 요구사항 (Step 1 Functional Requirements)

### 4.1 LocalStorage 기반 상태 로드 & 영속화
- **저장소 키:** `mylink-app-storage`
- **초기 로딩:**
  - 사용자가 처음 접속 시 `initialProfileData`를 LocalStorage에 자동 세팅.
  - 이미 저장된 데이터가 있다면 LocalStorage에서 즉시 복원하여 화면에 렌더링.
  - SSR/CSR 불일치(Hydration Mismatch)를 방지하는 마운트 처리.

### 4.2 프로필 헤더 컴포넌트 (`ProfileHeader`)
- **아바타:** 원형 프로필 이미지 (호버 시 부드러운 확대 애니메이션).
- **이름 & 뱃지:** 사용자 이름/닉네임, 공식 인증 뱃지 또는 상태 표시(예: "✨ 새로운 아이디어 빌딩 환영").
- **Bio (한 줄 소개):** 개성 있는 소개글 텍스트.
- **소셜 아이콘 바:** 각 플랫폼(GitHub, LinkedIn, Instagram 등)의 SVG/Lucide 아이콘이 배치되며, 클릭 시 새 탭에서 열림.

### 4.3 링크 카드 목록 컴포넌트 (`LinkList` & `LinkCard`)
- **카드 구성 요소:**
  - 좌측: 링크 카테고리에 맞는 Lucide 아이콘
  - 중앙: 링크 타이틀(Title) 및 부가 설명(Subtitle)
  - 우측: 배지(예: `대표 링크`, `NEW`, `인기`) 및 외부 이동 화살표 아이콘
- **인터랙션:** 마우스 호버 시 떠오르는 모션 효과, 클릭 시 `target="_blank"`로 새 창 연결.

### 4.4 레이아웃 및 뷰포트 사양
- **모바일 퍼스트 뷰포트:** 스마트폰 화면 비율(최대 480px, `max-w-md`) 중앙 정렬 레이아웃.
- **나이키 컨테이너 원칙:** 불필요한 카드 외곽 드롭 섀도우를 배제하고, 깔끔한 1px 헤어라인 인셋/디바이더(`hairline-soft`)를 활용하여 매거진/카탈로그처럼 플랫하고 단단한 인상을 제공.

### 4.5 shadcn/ui 기반 Nike 디자인 시스템 구축 사양 (design.md 연계)

`design.md`에 정의된 **Nike Commerce & Editorial Design System**의 핵심 미학을 `shadcn/ui` 아키텍처 위에 1:1로 매핑하여 구축합니다.

#### 1) 핵심 디자인 철학
- **Mechanical Restraint (극도의 시각적 절제):** 불필요한 장식적 그라디언트 및 부드러운 그림자(Soft Shadow)를 일절 배제(`shadow-none`).
- **Pill vs Zero-Radius 대비 규칙:**
  - **인터랙션/액션 요소(Button, Badge, Chip, Input):** 완전한 필 형태(`rounded-full`, 30px pill) 적용.
  - **컨테이너/구조 요소(Card, Dialog, Panel):** 직각 및 제로 섀도우(`rounded-none`, `shadow-none`) 적용.
- **Nike Tap Feedback:** 버튼 클릭/터치 시 햅틱 감각의 미세 축소 모션(`active:scale-[0.96] active:opacity-70`, `.btn-press:active`) 기본 내장.

#### 2) 색상 토큰 체계 (Color Tokens → CSS Variables)
`shadcn/ui`의 Semantic CSS 변수를 나이키 전용 팔레트로 표준화합니다:
- **`--background` / Canvas (`#ffffff`):** 순백색 캔버스 배경.
- **`--foreground` / Ink (`#111111`):** 브랜드의 유일한 메인 컬러. 텍스트, 헤드라인, 메인 액센트.
- **`--primary` / Primary CTA (`#111111`, Text `#ffffff`):** 블랙 필 버튼 및 주요 강조.
- **`--secondary` / Soft Cloud (`#f5f5f5`, Text `#111111`):** 제품 카드 베이스 및 보조 CTA 필.
- **`--muted` & `--muted-foreground` (`#f5f5f5` / `#707072`):** 보조 영역 및 설명 텍스트(카테고리 서브타이틀 등).
- **`--border` / Hairline (`#cacacb` / `#e5e5e5`):** 1px 명시적 구분선.
- **`--destructive` / Sale Red (`#d30005`):** 세일/할인 및 위험 상태 알림에만 제한적으로 사용되는 단 하나의 유색 포인트.
- **`--success` (`#007d48`):** 인증 완료 및 성공 상태 표시.

#### 3) shadcn/ui 컴포넌트별 나이키 커스터마이징 규격

| 컴포넌트 | 기본 shadcn 형태 | 나이키 디자인 시스템 적용 사양 (`design.md`) |
|---|---|---|
| **Button** (`src/components/ui/button.tsx`) | `rounded-md` | **`rounded-full` (Pill Geometry)**<br>• Primary: Black on White (`bg-[#111111] text-white`)<br>• Secondary: Soft Cloud (`bg-[#f5f5f5] text-[#111111]`)<br>• Tap Feedback: `active:scale-[0.96] active:opacity-70` 내장 |
| **Card** (`src/components/ui/card.tsx`) | `rounded-xl border shadow-sm` | **`rounded-none shadow-none` (Zero Shadow, Zero Radius)**<br>• 순백색 또는 Soft Cloud(`#f5f5f5`) 베이스<br>• 1px 헤어라인 보더(`border-[#e5e5e5]`) |
| **Badge** (`src/components/ui/badge.tsx`) | `rounded-md` | **`rounded-full` (Pill Badge)**<br>• `HOT`/`대표`: Ink 블랙 또는 Sale 레드(`#d30005`)<br>• 카테고리 칩: Soft Cloud(`#f5f5f5`) |
| **Avatar** (`src/components/ui/avatar.tsx`) | `rounded-full` | **`rounded-full`** (원형 1:1 아바타, 1px Hairline 보더 적용) |
| **Separator** (`src/components/ui/separator.tsx`) | 기본 divider | **1px Hairline Divider** (`bg-[#cacacb]` 또는 `bg-[#e5e5e5]`) |

#### 4) 타이포그래피 계층 (Typography Scale)
- **Display Campaign (`font-display-campaign`):** `Bebas Neue` / `Futura` 대문자(Uppercase), line-height 0.9, letter-spacing -0.02em (포트폴리오 타이틀 및 헤어로고).
- **UI & Body (`font-sans`):** `Inter` / `Helvetica Now` 체계, letter-spacing -0.01em.
  - Heading XL (32px / 500 / lh 1.2)
  - Body MD (16px / 400 / lh 1.5)
  - Button MD (16px / 500 / lh 1.5)
  - Caption SM (12px / 500 / lh 1.5)

### 4.6 시연 및 테스트용 링크 더미 데이터셋 사양 (`src/data/dummyLinks.ts`)

제품 시연, 오프라인 환경 테스트 및 UI 그리드 레이아웃 검증을 위해 현실적인 실무형 링크 더미 데이터를 기본 탑재하여 사용합니다.

#### 1) 표준 프로필 링크 세트 (`dummyProfileLinks`)
- **타입:** `ProfileLink[]` (`src/types/profile.ts`)
- **활용처:** `initialProfileData.links`, Zustand 스토어(`useMyLinkStore`), 기본 `LinkCard` 컴포넌트
- **카테고리 구성:**
  - **대표 & 포트폴리오 (`general`):** 공식 웹 포트폴리오, 인터랙티브 경력 기술서, 창작 후원(Buy Me a Coffee)
  - **기술 콘텐츠 (`content`):** 기술 블로그(Velog), 주간 프론트엔드 뉴스레터, 개발 유튜브 채널
  - **오픈소스 & 프로젝트 (`project`):** GitHub 오픈소스 레포, HyperLink 데모, AI Code Reviewer Action
  - **네트워킹 & 연락처 (`contact`):** 1:1 커피챗(Calendly), 프로젝트 협업/채용 문의 이메일
- **속성 지원:** 대표 강조 배지(`isFeatured`), 누적 클릭 수(`clicks`), 카테고리 태그, Lucide 아이콘 매핑

#### 2) Nike 에디토리얼 커머스 링크 세트 (`dummyEditorialLinks`)
- **타입:** `EditorialLinkItem[]` (`LinkCardItem`)
- **활용처:** `src/app/page.tsx` 나이키 에디토리얼 쇼케이스 카탈로그 그리드
- **속성 지원:** 
  - 1:1 고해상도 에디토리얼 포토그래피 URL (`imageUrl`)
  - 필터 칩 연동 태그 (`CORE`, `WRITING`, `NETWORK`)
  - 나이키 미니멀 컬러 스와치 점 배열 (`swatches`)
  - 프로모션 뱃지 (`JUST IN`, `HIGH DEMAND`, `LIMITED SLOTS` 등)
  - 릴리즈 버전 및 상태 텍스트 (`priceNote`, `isSale`)

### 4.7 스타일링 표준 및 shadcn/ui 기반 컴포넌트 재사용 아키텍처

#### 1) 스타일링 표준 (Styling Policy)
- **모듈 CSS(`*.module.css`) 사용 배제:** 스타일 파일의 파편화 및 네이밍 중복을 방지하기 위해 CSS Modules 방식을 배제합니다.
- **Tailwind CSS v4 전면 단일화:** 모든 레이아웃, 반응형 브레이크포인트, 상태(hover, active, focus), 타이포그래피 및 색상 시스템을 100% **Tailwind CSS v4 유틸리티 클래스**로 통일합니다.
- **디자인 토큰 일관성:** `globals.css`의 CSS 변수(`--background`, `--foreground`, `--border` 등)와 나이키 팔레트 토큰을 유틸리티 클래스 기반으로 직접 활용합니다.

#### 2) shadcn/ui 기반 재사용 컴포넌트 계층 (Component Composition)
페이지 레이어(`src/app/page.tsx`)에 UI 코드를 직접 인라인 하드코딩하지 않고, 책임을 분리한 재사용 가능 컴포넌트로 모듈화하여 조립합니다:

| 계층 | 디렉터리 경로 | 주요 컴포넌트 | 역할 및 재사용성 |
|---|---|---|---|
| **UI Primitive** | `src/components/ui/` | `card`, `button`, `badge`, `avatar`, `separator`, `input`, `dialog` | shadcn/ui 기반 기본 원자 컴포넌트 |
| **Domain Reusable** | `src/components/links/` | `LinkCardItem.tsx` | 단일 링크 카드 렌더링, URL 복사, 클릭 수 증가, 대표/HOT 뱃지, 링크 삭제 |
| | | `LinkList.tsx` | 검색(`Input`), 카테고리 필터(`Button`), 카드 목록 렌더링 캡슐화, 링크 추가 다이얼로그 연계 |
| | | `AddLinkDialog.tsx` | 모달 폼을 통한 로컬 신규 링크 추가, 실시간 카드 미리보기, 카테고리/아이콘/배지 설정 |
| | | `ProfileBanner.tsx` | 아바타(`Avatar`), Bio, 뱃지(`Badge`), 소셜 아이콘 바, 프로필 공유 |
| | | `StatsSummary.tsx` | 전체 링크, 대표 링크, 누적 방문 수 요약 카드(`Card`) |
| | | `EditorialGrid.tsx` | 나이키 스타일 1:1 이미지 및 메타데이터 쇼케이스 그리드 |
| **Page Assembler** | `src/app/page.tsx` | `LinksPage` | 위 도메인 컴포넌트들을 선언적으로 조합하여 상태 및 뷰 모드 제어 |

---

## 5. 데이터 모델 (Data Model - TypeScript)

```typescript
export interface SocialLink {
  id: string;
  platform: 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email';
  url: string;
  label: string;
}

export interface ProfileLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  iconName: string;
  badge?: string;
  isFeatured?: boolean;
  clicks: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl: string;
  bannerGradient?: string;
  statusMessage?: string;
  isAvailableForHire?: boolean;
  theme: 'midnight' | 'minimal' | 'sunset' | 'emerald';
  socials: SocialLink[];
  links: ProfileLink[];
}
```

---

## 6. 기술 스택 (Step 1 기준)

- **Framework:** Next.js 16 (App Router, Turbopack), React 19
- **Styling:** **Pure Tailwind CSS v4 (모듈 CSS `*.module.css` 일절 배제, 100% 유틸리티 클래스 통일)**
- **Design System & UI:** **shadcn/ui 기반 재사용 컴포넌트 아키텍처 + Nike Commerce Design System 토큰 (`design.md`)**, Lucide React (아이콘)
- **State Management:** **Zustand 5** (`persist` 미들웨어를 활용한 LocalStorage 영속화)
- **Storage:** 브라우저 `localStorage`

---

## 7. 단계별 개발 로드맵 (Milestones)

### 🚩 Step 1: 로컬스토리지 기반 프로필 페이지 & Nike 스타일 shadcn/ui 구축 (완료)
- [x] Zustand 상태 관리 라이브러리 설치 및 `useMyLinkStore` 기반 구성
- [x] shadcn/ui 초기화 (`components.json`, CSS 변수 체계, `lib/utils.ts` 구성)
- [x] 최신 Tailwind CSS v4 및 관련 라이브러리 최신 버전 업데이트 완료
- [x] Nike Commerce Design System (`design.md`) 기반 shadcn/ui 컴포넌트 정책 PRD 반영
- [x] 시연 및 카탈로그 그리드용 실무 링크 더미 데이터셋 구축 (`src/data/dummyLinks.ts`)
- [x] 모듈 CSS 배제 및 Pure Tailwind CSS 기반 스타일링 단일화 정책 반영
- [x] shadcn/ui 기반 도메인 재사용 컴포넌트 분리 (`LinkList`, `LinkCardItem`, `ProfileBanner`, `StatsSummary`, `EditorialGrid`, `AddLinkDialog`)
- [x] 다이얼로그 모달 기반 로컬 신규 링크 추가 기능 구현 (실시간 미리보기, 유효성 검사, LocalStorage 영속화)
- [x] Nike 감성 레이아웃(Pill Geometry, Hairline 보더, Soft Cloud 베이스) 프로필 뷰 연동
- [x] 헤더(아바타, 소개, 소셜 아이콘) 및 링크 카드 컴포넌트 연동
- [x] LocalStorage 데이터 변경 및 클릭 통계 실시간 반영 검증 완료

---

### 🔮 Step 2: 디자인 & 테마 변경 기능 (다음 단계)
- 프로필 내 테마(Midnight, Minimal, Sunset 등) 원클릭 프리셋 전환 UI

### 🔮 Step 3: 관리자 대시보드 & 드래그 앤 드롭 (향후 계획)
- 2분할 관리자 편집 화면 (좌측 에디터 + 우측 모바일 목업)
- 드래그 앤 드롭 링크 순서 변경 및 링크 추가/삭제 폼

### 🔮 Step 4: 통계 분석 & 회원가입 (최종 계획)
- 링크별 클릭 수 집계 및 통계 대시보드
- 소셜 로그인 및 다중 사용자 프로필 지원
