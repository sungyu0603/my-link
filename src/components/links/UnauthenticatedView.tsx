'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { loginWithGoogle, getFirebaseAuthErrorMessage } from '@/lib/auth';

interface UnauthenticatedViewProps {
  onShowToast?: (message: string) => void;
}

export const UnauthenticatedView: React.FC<UnauthenticatedViewProps> = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState<string>('localhost');
  const [copiedHostname, setCopiedHostname] = useState(false);

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
      console.error('[UnauthenticatedView] 로그인 실패 상세:', { code, error });
      setErrorCode(code);
      setErrorMessage(friendlyMessage);
      toast.error(`로그인 실패 (${code})`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 flex flex-col items-center text-center">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-5 text-[#111111] shadow-xs">
        <Lock className="w-6 h-6" />
      </div>

      {/* Main Title & Description */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/5 text-[#111111] text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>마이링크(MyLink) 개인화 서비스</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] mb-3">
        로그인 후 나만의 링크를 관리하세요
      </h1>

      <p className="text-sm sm:text-base text-[#707072] max-w-md mx-auto leading-relaxed mb-6">
        본 서비스는 사용자별 독립된 Firestore 데이터베이스(
        <code className="text-xs font-mono bg-[#f0f0f0] px-1.5 py-0.5 rounded text-[#111111]">
          users/{'{uid}'}/links
        </code>
        )를 기반으로 작동합니다. Google 계정으로 1초 만에 로그인하고 나만의 포트폴리오 링크를 완성해보세요.
      </p>

      {/* 에러 발생 시 상세 해결 가이드 박스 */}
      {errorMessage && (
        <div className="w-full max-w-lg mb-6 p-4 rounded-xl border border-red-200 bg-red-50/90 text-left animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-red-900 mb-1">도메인 승인 오류 해결 안내</p>
              <p className="text-red-700 leading-relaxed mb-3">{errorMessage}</p>

              {errorCode === 'auth/unauthorized-domain' && (
                <div className="mt-2 p-3 bg-white/80 rounded-lg border border-red-200 text-red-950 text-[11px] leading-relaxed">
                  <p className="font-bold mb-1.5 text-red-900">
                    현재 접속 중인 호스트: <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded font-mono font-semibold">{currentHostname}</code>
                  </p>
                  <p className="text-gray-700 mb-3">
                    Firebase는 보안을 위해 등록된 도메인에서만 로그인을 허용합니다. 아래 2가지 중 하나를 진행해주세요:
                  </p>

                  <div className="space-y-2.5">
                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-1">방법 A. Firebase 콘솔에 도메인 추가 (추천)</p>
                      <p className="text-gray-600 mb-2">
                        열려 있는 콘솔 창에서 <strong>설정</strong> 탭 클릭 → <strong>승인된 도메인</strong> 섹션에서 아래 값을 각각 <strong>도메인 추가</strong> 해주세요:
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs border border-gray-300 font-bold">
                          {currentHostname}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyHostname(currentHostname)}
                          className="inline-flex items-center gap-1 text-[11px] bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded font-medium transition-colors"
                        >
                          {copiedHostname ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          <span>복사</span>
                        </button>

                        {currentHostname !== 'localhost' && (
                          <button
                            type="button"
                            onClick={() => handleCopyHostname('localhost')}
                            className="inline-flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded font-medium transition-colors"
                          >
                            <span>localhost 복사</span>
                          </button>
                        )}
                        {currentHostname !== '127.0.0.1' && (
                          <button
                            type="button"
                            onClick={() => handleCopyHostname('127.0.0.1')}
                            className="inline-flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded font-medium transition-colors"
                          >
                            <span>127.0.0.1 복사</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-1">방법 B. 브라우저 주소창 변경</p>
                      <p className="text-gray-600">
                        현재 브라우저 주소가 <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">http://127.0.0.1:3000</code>이라면, 주소창에 <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-blue-600 font-bold">http://localhost:3000</code>을 입력해 접속해보세요.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://console.firebase.google.com/project/mylink-project-12bf9/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-red-900 font-bold hover:underline"
                  >
                    <span>Firebase Authentication 설정(승인된 도메인) 바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Primary Google Login CTA Button */}
      <Button
        type="button"
        size="lg"
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="w-full max-w-xs h-12 rounded-full bg-[#111111] text-white hover:bg-black font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg group mb-12"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Google 계정으로 시작하기</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>

      {/* Feature Guide Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <Card className="border-[#e5e5e5] bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#111111]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#111111]">안전한 개인 클라우드</h2>
            <p className="text-[11px] text-[#707072] leading-relaxed">
              Google 인증 UID를 통해 오직 본인만의 링크 데이터베이스를 안전하게 격리 보관합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5] bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#111111]">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#111111]">실시간 데이터 동기화</h2>
            <p className="text-[11px] text-[#707072] leading-relaxed">
              Firestore Snapshot 리스너로 기기 간 링크 추가, 수정, 삭제가 즉시 실시간 동기화됩니다.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5] bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#111111]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#111111]">클릭 수 실시간 분석</h2>
            <p className="text-[11px] text-[#707072] leading-relaxed">
              각 링크별 방문자 클릭수를 실시간 누적 집계하여 통계 지표를 직관적으로 제공합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
