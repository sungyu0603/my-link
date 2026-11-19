import { ImageResponse } from 'next/og';

export const alt = '마이링크 | 나만의 링크 페이지를 30분 만에';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: '#111111', textTransform: 'uppercase' }}>
              MYLINK
            </span>
            <span style={{ fontSize: 16, color: '#cacacb' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: '#707072', textTransform: 'uppercase' }}>
              All-in-One Link Platform
            </span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#f5f5f5', border: '1px solid #e5e5e5',
            padding: '8px 18px', borderRadius: 999,
            fontSize: 12, fontWeight: 600, color: '#111111', letterSpacing: '0.04em',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#007d48' }} />
            <span style={{ textTransform: 'uppercase' }}>Free Forever</span>
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '920px' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#707072', textTransform: 'uppercase' }}>
            Linktree · Portfolio · Profile
          </span>

          <h1 style={{ fontSize: 92, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.95, margin: 0, color: '#111111' }}>
            마이링크
          </h1>

          {/* Slogan — "30분 만에" is yellow */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#39393b' }}>
              나만의 링크 페이지를
            </span>
            <span style={{
              fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2,
              color: '#111111',
              backgroundColor: '#FFE600',
              padding: '0 10px',
              borderRadius: 6,
            }}>
              30분 만에
            </span>
          </div>

          <p style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.5, color: '#707072', margin: '4px 0 0 0' }}>
            소프트웨어 엔지니어, 디자이너, 크리에이터를 위한 미니멀 에디토리얼 링크 플랫폼.
            복잡한 개발 없이 감각적인 나만의 디지털 프로필을 완성하세요.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
            <div style={{
              backgroundColor: '#111111', color: '#ffffff',
              padding: '12px 28px', borderRadius: 999,
              fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>시작하기</span>
              <span>→</span>
            </div>
            <span style={{ fontSize: 13, color: '#707072', fontWeight: 600 }}>Google 원클릭 계정 연동</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '20px', borderTop: '1px solid #e5e5e5',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>모바일 퍼스트 반응형</span>
            <span style={{ color: '#cacacb' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#707072' }}>실시간 클릭 통계 분석</span>
            <span style={{ color: '#cacacb' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#707072' }}>개인 Firestore 클라우드</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#111111', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            mylink.io
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
