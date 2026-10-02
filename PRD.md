# [PRD] 마이링크 (MyLink) 제품 요구사항 정의서

- **문서 버전:** v1.1.0 (시연용 단계별 진행 전략 반영)
- **작성일:** 2026-10-02
- **작성자:** Antigravity (AI Pair Programmer)
- **상태:** 확정 (시연 목적에 맞춰 1단계 프로필 페이지 집중)

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

### 4.4 모바일 프레임 레이아웃
- 데스크톱 화면에서도 모바일 기기 화면을 보는 듯한 편안한 카드 형태(max-w-md, 그림자, 둥근 테두리) 제공.
- 모바일 기기 접속 시 화면 전체에 자연스럽게 핏되는 반응형 디자인.

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

- **Framework:** Next.js 16.3.8 (App Router), React 19
- **State Management:** **Zustand 5** (`persist` 미들웨어를 활용한 LocalStorage 영속화)
- **Styling:** Tailwind CSS v4, Lucide React (아이콘)
- **Storage:** 브라우저 `localStorage`

---

## 7. 단계별 개발 로드맵 (Milestones)

### 🚩 Step 1: 로컬스토리지 기반 프로필 페이지 (현재 진행)
- [x] Zustand 상태 관리 라이브러리 설치 및 `useMyLinkStore` 기반 구성
- [x] 시연 목적에 맞춘 1단계 중심 PRD 업데이트
- [ ] LocalStorage 데이터와 연동된 반응형 프로필 페이지 뷰 구성
- [ ] 헤더(아바타, 소개, 소셜 아이콘) 및 링크 카드 컴포넌트 연동
- [ ] 시연 테스트: LocalStorage 데이터 변경 시 프로필 페이지 즉시 반영 확인

---

### 🔮 Step 2: 디자인 & 테마 변경 기능 (다음 단계)
- 프로필 내 테마(Midnight, Minimal, Sunset 등) 원클릭 프리셋 전환 UI

### 🔮 Step 3: 관리자 대시보드 & 드래그 앤 드롭 (향후 계획)
- 2분할 관리자 편집 화면 (좌측 에디터 + 우측 모바일 목업)
- 드래그 앤 드롭 링크 순서 변경 및 링크 추가/삭제 폼

### 🔮 Step 4: 통계 분석 & 회원가입 (최종 계획)
- 링크별 클릭 수 집계 및 통계 대시보드
- 소셜 로그인 및 다중 사용자 프로필 지원
