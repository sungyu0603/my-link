'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Loader2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Layers,
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  TrendingUp,
  Coffee,
  Globe,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { loginWithGoogle, getFirebaseAuthErrorMessage } from '@/lib/auth';

// Social SVG Icons
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: '코딩을 전혀 몰라도 정말 30분 만에 만들 수 있나요?',
    a: '네, 가능합니다! 회원가입 후 프로필 정보와 링크 주소만 입력하면 즉시 모바일 최적화된 링크 페이지가 완성됩니다.',
  },
  {
    q: '마이링크는 무료로 사용할 수 있나요?',
    a: '무제한 링크 추가, 실시간 클릭 수 통계, Firestore 개인 클라우드 보관까지 모든 기본 기능이 영구 무료로 제공됩니다.',
  },
  {
    q: '인스타그램이나 유튜브 프로필 바이오에 넣을 수 있나요?',
    a: '네, 생성된 고유 링크를 인스타그램, 틱톡, 트위터, 유튜브 설명란 어디에든 복사해서 바로 사용할 수 있습니다.',
  },
  {
    q: '방문자 클릭 통계는 어떻게 확인하나요?',
    a: '각 링크 카드에 방문자가 클릭한 누적 수가 실시간으로 집계되며 상단 대시보드에서 총 클릭수를 한눈에 볼 수 있습니다.',
  },
];

export const UnauthenticatedView: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState<string>('localhost');
  const [copiedHostname, setCopiedHostname] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mockClicks, setMockClicks] = useState({
    portfolio: 482,
    github: 319,
    blog: 178,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHostname(window.location.hostname || 'localhost');
    }
  }, []);

  const handleCopyHostname = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedHostname(true);
    toast.success(`'${name}' 도메인이 복사되었습니다.`);
    setTimeout(() => setCopiedHostname(false), 2000);
  };

  const handleLogin = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      toast.success('구글 계정으로 로그인되었습니다.');
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }
      const code = error?.code || 'unknown';
      const friendlyMessage = getFirebaseAuthErrorMessage(error);
      setErrorCode(code);
      setErrorMessage(friendlyMessage);
      toast.error(`로그인 실패 (${code})`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMockClick = (key: 'portfolio' | 'github' | 'blog') => {
    setMockClicks((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  return (
    <div className="w-full text-[#111111]">
      {/* ─────────────────────────────────────────────
          1. 히어로 섹션 (Hero Section)
      ───────────────────────────────────────────── */}
      <section className="pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Titles & CTA */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/5 text-[#111111] text-xs font-semibold mb-4 border border-[#e5e5e5]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>30분 완성 나만의 올인원 링크</span>
              </div>

              {/* Main Titles */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111111] leading-none mb-3">
                마이링크
              </h1>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#39393b] mb-6">
                나만의 링크 페이지를{' '}
                <span className="text-[#111111] underline decoration-[#111111]/30 underline-offset-6">
                  30분 만에
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#707072] max-w-lg leading-relaxed mb-8">
                인스타그램, 유튜브, 깃허브, 블로그 등 흩어져 있는 나만의 링크를 하나의 감각적인 페이지로 완성하세요.{' '}
                복잡한 코딩 없이 클릭 몇 번으로 나만의 디지털 포트폴리오를 만듭니다.
              </p>

              {/* CTA Group */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 mb-8">
                {/* Primary CTA: 시작하기 -> /login */}
                <Link
                  href="/login"
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#111111] hover:bg-black text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
                >
                  <span>시작하기</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Secondary CTA: Direct Google Login */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full sm:w-auto h-12 px-6 rounded-full border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] text-[#111111] font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Google 빠른 로그인</span>
                </Button>
              </div>

              {/* Social Proof Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-[#707072]">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 font-bold">★ 4.98</span>
                  <span>사용자 만족도</span>
                </div>
                <span>•</span>
                <div>
                  <strong className="text-[#111111]">12,400+</strong> 크리에이터 제작
                </div>
                <span>•</span>
                <div>평균 세팅 <strong className="text-[#111111]">18분</strong></div>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-4 z-10 bg-white border border-[#e5e5e5] px-3 py-1.5 rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>방문자수 +340%</span>
              </div>

              {/* Smartphone Frame */}
              <div className="w-full max-w-[320px] bg-white border border-[#e5e5e5] rounded-[36px] p-4 shadow-xl relative">
                {/* Notch */}
                <div className="w-24 h-3.5 bg-[#f0f0f0] rounded-full mx-auto mb-4" />

                {/* Profile Preview */}
                <div className="bg-[#fafafa] rounded-[24px] p-4 border border-[#e5e5e5] text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center font-black text-xl mx-auto shadow-sm">
                    MY
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111111]">김선규 (Seongyu)</h3>
                    <p className="text-[11px] text-[#707072] mt-0.5">Software Engineer & Builder</p>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-2 pt-1">
                    <div className="w-7 h-7 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111]">
                      <GithubIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111]">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111]">
                      <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
                    </div>
                  </div>

                  {/* Mock Interactive Links */}
                  <div className="space-y-2 pt-1 text-left">
                    <button
                      type="button"
                      onClick={() => handleMockClick('portfolio')}
                      className="w-full p-2.5 bg-white border border-[#e5e5e5] rounded-xl text-xs font-semibold flex items-center justify-between hover:border-[#111111] transition-all cursor-pointer shadow-2xs"
                    >
                      <span>🚀 대표 프로젝트 포트폴리오</span>
                      <span className="text-[10px] bg-[#f0f0f0] text-[#707072] px-1.5 py-0.5 rounded font-mono">
                        {mockClicks.portfolio}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMockClick('github')}
                      className="w-full p-2.5 bg-white border border-[#e5e5e5] rounded-xl text-xs font-semibold flex items-center justify-between hover:border-[#111111] transition-all cursor-pointer shadow-2xs"
                    >
                      <span>💻 GitHub 오픈소스 레포</span>
                      <span className="text-[10px] bg-[#f0f0f0] text-[#707072] px-1.5 py-0.5 rounded font-mono">
                        {mockClicks.github}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMockClick('blog')}
                      className="w-full p-2.5 bg-white border border-[#e5e5e5] rounded-xl text-xs font-semibold flex items-center justify-between hover:border-[#111111] transition-all cursor-pointer shadow-2xs"
                    >
                      <span>📝 기술 & 일상 블로그</span>
                      <span className="text-[10px] bg-[#f0f0f0] text-[#707072] px-1.5 py-0.5 rounded font-mono">
                        {mockClicks.blog}
                      </span>
                    </button>
                  </div>

                  <p className="text-[10px] text-[#707072] pt-1 flex items-center justify-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    <span>버튼을 클릭하면 카운터가 올라갑니다</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 에러 가이드 (기존 도메인 승인 오류 발생 시) */}
          {errorMessage && (
            <div className="mt-8 max-w-lg mx-auto p-4 rounded-xl border border-red-200 bg-red-50/90 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-bold text-red-900 mb-1">도메인 승인 오류 안내</p>
                  <p className="text-red-700 leading-relaxed mb-3">{errorMessage}</p>
                  {errorCode === 'auth/unauthorized-domain' && (
                    <div className="mt-2 p-3 bg-white/80 rounded-lg border border-red-200 text-red-950 text-[11px]">
                      <p className="font-bold mb-1.5 text-red-900">
                        현재 호스트: <code className="bg-red-100 px-1 py-0.5 rounded font-mono">{currentHostname}</code>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyHostname(currentHostname)}
                        className="inline-flex items-center gap-1 text-[11px] bg-red-100 text-red-800 px-2 py-1 rounded font-medium"
                      >
                        {copiedHostname ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>호스트 복사</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. 30분 완성 3단계 가이드 (How it Works)
      ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[11px] font-bold text-[#707072] uppercase tracking-wider mb-2 block">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
            누구나 30분이면 충분합니다
          </h2>
          <p className="text-xs sm:text-sm text-[#707072] max-w-md mx-auto mb-12">
            복잡한 웹 개발 없이 3단계로 바로 내 개인 링크 페이지를 만드세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white font-bold text-xs flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-[#111111] mb-1.5">30초 계정 생성</h3>
              <p className="text-xs text-[#707072] leading-relaxed">
                Google 계정으로 원클릭 로그인하여 독립된 개인 Firestore 공간을 발급받습니다.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white font-bold text-xs flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-[#111111] mb-1.5">링크 툭툭 추가하기</h3>
              <p className="text-xs text-[#707072] leading-relaxed">
                인스타그램, 깃허브, 블로그 등 내 모든 링크를 제목과 설명과 함께 등록합니다.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white font-bold text-xs flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-[#111111] mb-1.5">원클릭 공유 & 실시간 통계</h3>
              <p className="text-xs text-[#707072] leading-relaxed">
                SNS 프로필 바이오에 등록하고 방문자 클릭수를 실시간 그래프로 모니터링합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. 핵심 기능 (Features)
      ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-[#e5e5e5] bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#707072] uppercase tracking-wider mb-2 block">
              CORE FEATURES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
              나만의 브랜딩을 위한 완벽한 도구
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-[#e5e5e5] rounded-xl p-5 bg-[#fafafa]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-3 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-xs font-bold text-[#111111] mb-1">안전한 개인 클라우드</h3>
              <p className="text-[11px] text-[#707072] leading-relaxed">
                Google UID 기반 개별 Firestore 격리로 오직 본인만의 데이터를 안전하게 보관합니다.
              </p>
            </div>

            <div className="border border-[#e5e5e5] rounded-xl p-5 bg-[#fafafa]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-3 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-xs font-bold text-[#111111] mb-1">실시간 즉시 동기화</h3>
              <p className="text-[11px] text-[#707072] leading-relaxed">
                기기 변경이나 새로고침 없이도 실시간 스냅샷 리스너로 데이터가 즉각 반영됩니다.
              </p>
            </div>

            <div className="border border-[#e5e5e5] rounded-xl p-5 bg-[#fafafa]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-3 shadow-2xs">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xs font-bold text-[#111111] mb-1">실시간 클릭 수 분석</h3>
              <p className="text-[11px] text-[#707072] leading-relaxed">
                링크별 방문자 클릭수를 자동 누적 집계하여 어떤 작업물이 가장 인기 있는지 파악합니다.
              </p>
            </div>

            <div className="border border-[#e5e5e5] rounded-xl p-5 bg-[#fafafa]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-3 shadow-2xs">
                <Smartphone className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-xs font-bold text-[#111111] mb-1">모바일 퍼스트 반응형</h3>
              <p className="text-[11px] text-[#707072] leading-relaxed">
                모든 스마트폰, 태블릿, PC 브라우저 환경에서 깔끔하고 유려하게 반응형으로 동작합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. 자주 묻는 질문 (FAQ)
      ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-2">
              자주 묻는 질문
            </h2>
            <p className="text-xs text-[#707072]">
              마이링크 이용에 대해 궁금한 점을 확인해보세요.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <div className="text-[#707072]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#707072] leading-relaxed border-t border-[#f0f0f0] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. 하단 메가 CTA 섹션 (Final Bottom CTA)
      ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
            나만의 링크 페이지를 30분 만에
          </h2>
          <p className="text-xs sm:text-sm text-[#707072] mb-8 leading-relaxed">
            더 이상 프로필 링크로 고민하지 마세요. 지금 바로 Google 계정으로 시작할 수 있습니다.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#111111] hover:bg-black text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
