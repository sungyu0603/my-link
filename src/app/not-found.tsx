import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md bg-white border border-[#e5e5e5] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-5 text-[#111111]">
          <UserX className="w-8 h-8 text-[#707072]" />
        </div>

        <span className="text-xs font-mono font-bold tracking-wider text-[#9e9ea0] uppercase mb-1">
          404 Not Found
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-2 tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-xs sm:text-sm text-[#707072] leading-relaxed mb-6">
          요청하신 사용자 프로필이나 페이지가 존재하지 않거나, 주소가 잘못 입력되었을 수 있습니다.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-6 bg-[#111111] text-white hover:bg-black font-semibold text-xs h-10 gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          홈으로 돌아가기
        </Link>
      </div>

      <div className="mt-8 text-xs text-[#9e9ea0] font-medium">
        MYLINK / LINKTREE
      </div>
    </div>
  );
}
