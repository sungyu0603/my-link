import { ImageResponse } from 'next/og';

// 이미지 규격 및 타입
export const alt = '마이링크 사용자 프로필';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ displayName: string }> | { displayName: string };
}

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.displayName || 'creator';
  const cleanParam = decodeURIComponent(rawParam).trim().replace(/^@/, '');
  const displayTitle = cleanParam || '크리에이터';
  const initial = (displayTitle.slice(0, 2) || 'MY').toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          color: '#111111',
          padding: '48px 64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* ── Top Global Header Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '1px solid #e5e5e5',
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#111111',
                textTransform: 'uppercase',
              }}
            >
              MYLINK
            </span>
            <span style={{ fontSize: 16, color: '#cacacb' }}>/</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#707072',
                textTransform: 'uppercase',
              }}
            >
              USER PROFILE
            </span>
          </div>

          {/* Right URL pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e5e5e5',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: '#111111',
            }}
          >
            <span style={{ color: '#707072' }}>mylink.io/@</span>
            <span>{cleanParam}</span>
          </div>
        </div>

        {/* ── Center: Exact Profile Banner Layout ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            flexGrow: 1,
            padding: '24px 0',
          }}
        >
          {/* Left Column: Profile Info (Avatar + Name + Bio + Badges) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '14px',
              maxWidth: '560px',
            }}
          >
            {/* Avatar with Available for Hire Indicator */}
            <div style={{ position: 'relative', display: 'flex' }}>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  border: '2px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  fontWeight: 800,
                  color: '#111111',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {initial}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#007d48',
                  border: '3px solid #ffffff',
                }}
              />
            </div>

            {/* Name & Handle */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#111111',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {displayTitle}
              </h1>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: '#707072',
                }}
              >
                @{cleanParam}
              </span>
            </div>

            {/* Title / Role */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#111111',
                margin: 0,
              }}
            >
              Software Engineer & Creator
            </div>

            {/* Bio Description */}
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#707072',
                margin: 0,
              }}
            >
              소프트웨어 개발과 프로덕트 빌딩. 일상의 유용한 링크와 작업물을 한곳에 모아 보여줍니다.
            </p>

            {/* Status Badges Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: 999,
                  border: '1px solid rgba(0,125,72,0.3)',
                  backgroundColor: 'rgba(0,125,72,0.05)',
                  color: '#007d48',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '5px 12px',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#007d48',
                  }}
                />
                <span>Available for Hire</span>
              </div>

              <div
                style={{
                  borderRadius: 999,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  color: '#111111',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '5px 12px',
                }}
              >
                <span>Seoul, KR</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Linktree Cards Preview (Nike Editorial Cards) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '460px',
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: '#ffffff',
                border: '1px solid #111111',
                borderRadius: 14,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  🚀
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    대표 프로젝트 포트폴리오
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    최신 웹 & 모바일 작업물 모음
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 14, color: '#111111', fontWeight: 700 }}>↗</span>
            </div>

            {/* Card 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  💻
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    GitHub 오픈소스 저장소
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    깃허브 기여 및 코드 활동
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 14, color: '#707072', fontWeight: 700 }}>↗</span>
            </div>

            {/* Card 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  📝
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    기술 & 엔지니어링 블로그
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    개발 회고 및 아티클
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 14, color: '#707072', fontWeight: 700 }}>↗</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Footer Strip ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #e5e5e5',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#707072' }}>
              마이링크에서 전체 링크와 프로필을 확인하세요
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#111111',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>프로필 보러가기</span>
            <span>→</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
