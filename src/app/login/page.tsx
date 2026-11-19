'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { loginWithGoogle, getFirebaseAuthErrorMessage } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      toast.success('구글 계정으로 로그인되었습니다.');
      router.push('/');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        const msg = getFirebaseAuthErrorMessage(error);
        toast.error(`로그인 실패: ${msg}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailSubmitted(true);
    toast.success('로그인 링크가 전송되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 text-[#111111]">
      {/* Back to Home */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707072] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>메인으로 돌아가기</span>
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto mb-4 font-black text-xl shadow-sm">
            ⚡
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111]/5 text-[#111111] text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>30분 완성 나만의 링크</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">
            마이링크 시작하기
          </h1>
          <p className="text-xs text-[#707072] mt-1.5 font-medium">
            Google 계정으로 1초 만에 로그인하고 나만의 링크 페이지를 만드세요.
          </p>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full h-12 rounded-xl bg-white hover:bg-[#f5f5f5] text-[#111111] border border-[#e5e5e5] font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-xs mb-5"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
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
          <span>Google 계정으로 계속하기</span>
        </Button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e5e5]" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-[#707072]">
            또는 이메일로 시작
          </span>
        </div>

        {/* Email Magic Link Form */}
        {emailSubmitted ? (
          <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#16a34a] mx-auto" />
            <p className="text-xs font-bold text-[#166534]">로그인 링크가 전송되었습니다</p>
            <p className="text-[11px] text-[#15803d]">
              <strong>{email}</strong> 메일함을 확인해주세요.
            </p>
            <button
              type="button"
              onClick={() => setEmailSubmitted(false)}
              className="text-[11px] text-[#707072] hover:text-[#111111] underline pt-1 block mx-auto"
            >
              다른 이메일로 입력
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                이메일 주소
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-10 px-3 rounded-lg border border-[#e5e5e5] text-xs bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111111] transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 rounded-lg bg-[#111111] hover:bg-black text-white text-xs font-semibold transition-all"
            >
              이메일로 시작하기
            </Button>
          </form>
        )}

        {/* Bottom Benefits Strip */}
        <div className="mt-8 pt-6 border-t border-[#e5e5e5] grid grid-cols-2 gap-3 text-left">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#707072] leading-tight">
              <strong className="text-[#111111] block">개인 데이터 격리</strong>
              안전한 Firestore 클라우드
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#707072] leading-tight">
              <strong className="text-[#111111] block">실시간 자동 동기화</strong>
              클릭 통계 실시간 집계
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
