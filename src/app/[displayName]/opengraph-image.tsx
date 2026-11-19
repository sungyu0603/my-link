import { ImageResponse } from 'next/og';

export const alt = '마이링크 사용자 프로필';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ displayName: string }> | { displayName: string };
}) {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.displayName || 'sungyu626543';
  const cleanParam = decodeURIComponent(rawParam).trim().replace(/^@/, '');
  const handle = cleanParam || 'sungyu626543';
  const initial = (handle.slice(0, 2) || 'MY').toUpperCase();

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
        {/* Top Header Bar */}
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
              fontSize: 13,
              fontWeight: 700,
              color: '#111111',
            }}
          >
            <span style={{ color: '#707072' }}>mylink.io/@</span>
            <span>{handle}</span>
          </div>
        </div>

        {/* Center: Profile Banner & Editorial Link Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            flexGrow: 1,
            padding: '28px 0',
          }}
        >
          {/* Left Column: Profile Info (Avatar + Handle + Title + Badges) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
              maxWidth: '540px',
            }}
          >
            {/* Avatar with Available for Hire Indicator */}
            <div style={{ position: 'relative', display: 'flex' }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  border: '2px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  fontWeight: 800,
                  color: '#111111',
                }}
              >
                {initial}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#007d48',
                  border: '3px solid #ffffff',
                }}
              />
            </div>

            {/* Handle & Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', color: '#111111' }}>
                  @{handle}
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#707072' }}>
                디지털 포트폴리오 & 링크 모음
              </span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#111111',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#007d48' }} />
                <span>Available for Projects</span>
              </div>

              <div
                style={{
                  backgroundColor: '#FFE600',
                  color: '#111111',
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Verified Link
              </div>
            </div>
          </div>

          {/* Right Column: 3 Sleek Editorial Preview Cards */}
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
                border: '2px solid #111111',
                borderRadius: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  P
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    대표 프로젝트 포트폴리오
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    최신 웹 & 모바일 프로젝트 작업물
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 16, color: '#111111', fontWeight: 800 }}>↗</span>
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
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  G
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    GitHub 오픈소스 저장소
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    개발 코드 & 기여 활동 내역
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 16, color: '#707072', fontWeight: 800 }}>↗</span>
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
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  B
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                    기술 블로그 & 아티클
                  </span>
                  <span style={{ fontSize: 11, color: '#707072' }}>
                    엔지니어링 기록과 배움
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 16, color: '#707072', fontWeight: 800 }}>↗</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Strip */}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#707072' }}>
              마이링크에서 전체 링크와 포트폴리오를 확인하세요
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#111111',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: 999,
              fontSize: 13,
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
