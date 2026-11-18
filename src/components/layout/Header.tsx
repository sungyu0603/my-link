'use client';

import React, { useState } from 'react';
import {
  List,
  LayoutGrid,
  Plus,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AddLinkDialog } from '@/components/links/AddLinkDialog';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { loginWithGoogle, getFirebaseAuthErrorMessage } from '@/lib/auth';
import { useMyLinkStore } from '@/store/useMyLinkStore';

interface HeaderProps {
  viewMode: 'list' | 'editorial';
  onViewModeChange: (mode: 'list' | 'editorial') => void;
  onAddLink: (link: any) => Promise<void>;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onAddLink,
  onResetData,
}) => {
  const { authUser, isAuthReady } = useMyLinkStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      toast.success('구글 계정으로 로그인되었습니다.');
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('[Header] 로그인 실패:', error);
        const friendlyMessage = getFirebaseAuthErrorMessage(error);
        toast.error(friendlyMessage);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] sticky top-0 z-40">
      <div className="max-w-xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-1 sm:gap-2">
        {/* Brand Logo (반응형: 좁은 화면에서는 LINKTREE 축약) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-extrabold tracking-tighter text-sm sm:text-base uppercase text-[#111111]">
            MYLINK
          </span>
          <span className="text-[#cacacb] hidden min-[400px]:inline">/</span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#707072] hidden min-[400px]:inline">
            LINKTREE
          </span>
        </div>

        {/* Right Section: Auth State & Actions (반응형 최적화) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {!isAuthReady ? (
            <div className="h-8 flex items-center px-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#707072]" />
            </div>
          ) : authUser ? (
            /* ── 로그인 상태 : 링크 툴바 + 프로필 인터랙티브 드롭다운 ── */
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* View Switcher (초소형 화면 대응 콤팩트 패딩) */}
              <div className="flex items-center bg-[#f5f5f5] p-0.5 rounded-full border border-[#e5e5e5]">
                <button
                  type="button"
                  onClick={() => onViewModeChange('list')}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#707072] hover:text-[#111111]'
                  }`}
                  title="목록 뷰"
                  aria-label="목록 뷰"
                >
                  <List className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">목록</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('editorial')}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    viewMode === 'editorial'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#707072] hover:text-[#111111]'
                  }`}
                  title="에디토리얼 뷰"
                  aria-label="에디토리얼 뷰"
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">에디토리얼</span>
                </button>
              </div>

              {/* Add Link Trigger */}
              <AddLinkDialog
                onAddLink={onAddLink}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] shrink-0"
                    title="새 링크 추가"
                    aria-label="새 링크 추가"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                }
              />

              {/* Reset Data Trigger */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onResetData}
                className="h-8 w-8 rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] shrink-0"
                title="새로고침"
                aria-label="새로고침"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>

              {/* ── Rich Profile Dropdown Menu (반응형 아바타 & 팝업) ── */}
              <ProfileDropdown />
            </div>
          ) : (
            /* ── 로그아웃 상태 : "Google로 로그인" 버튼 ── */
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="h-8 px-2.5 sm:px-3.5 rounded-full border-[#111111] bg-[#111111] text-white hover:bg-black hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 sm:gap-2 shadow-xs shrink-0"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span className="whitespace-nowrap">Google로 로그인</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
