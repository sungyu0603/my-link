'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  LogOut,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  Link2,
  MousePointerClick,
  ChevronDown,
  Database,
  Loader2,
  UserCog,
  User,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { logoutUser } from '@/lib/auth';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';

interface ProfileDropdownProps {
  onShowToast?: (message: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { authUser, profile, clearUserDataOnLogout, isSyncing } = useMyLinkStore();

  const userName = authUser?.displayName || profile?.name || '김선규';
  const userEmail = authUser?.email || 'user@example.com';
  const avatarUrl = authUser?.photoURL || profile?.avatarUrl;
  const userHandle = (profile?.handle || authUser?.displayName || authUser?.email?.split('@')[0] || 'user')
    .trim()
    .toLowerCase()
    .replace(/^@/, '');

  // 통계 계산
  const links = profile?.links || [];
  const totalLinks = links.length;
  const totalClicks = links.reduce(
    (sum, link) => sum + (link.clickCount ?? link.clicks ?? 0),
    0
  );
  const topLink =
    links.length > 0
      ? [...links].sort(
          (a, b) => (b.clickCount ?? b.clicks ?? 0) - (a.clickCount ?? a.clicks ?? 0)
        )[0]
      : null;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sunkyu.dev';
    const targetUrl = `${origin}/${userHandle}`;
    navigator.clipboard.writeText(targetUrl);
    setIsCopied(true);
    toast.success(`내 개인 링크 주소가 복사되었습니다: /${userHandle}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePreviewOpen = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      window.open(`${origin}/${userHandle}`, '_blank');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      clearUserDataOnLogout();
      setIsOpen(false);
      toast.success('성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.error('[ProfileDropdown] 로그아웃 실패:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* ── Profile Trigger Button (초소형 화면: 아바타 위주 축약) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 pl-1 pr-1.5 sm:pr-2.5 rounded-full border border-[#e5e5e5] hover:border-[#111111] hover:bg-[#f5f5f5] transition-all bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-[#111111]/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${userName} 계정 메뉴`}
      >
        <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border border-[#111111]/10 shrink-0">
          <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
          <AvatarFallback className="text-[10px] sm:text-[11px] font-bold bg-[#111111] text-white">
            {userName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <span className="hidden min-[380px]:inline text-xs font-semibold text-[#111111] max-w-[70px] sm:max-w-[110px] truncate">
          {userName}님
        </span>

        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#707072] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#111111]' : ''
          }`}
        />
      </button>

      {/* ── Dropdown Menu Popup (화면 너비 초과 방지 max-w 및 너비 계산) ── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-[20rem] sm:w-80 rounded-2xl bg-white border border-[#e5e5e5] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right text-left">
          {/* 1. Header: Account Profile Info */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-[#fafafa] to-white border-b border-[#f0f0f0]">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-[#111111] p-0.5 shadow-xs shrink-0">
                <AvatarImage src={avatarUrl} alt={userName} className="rounded-full object-cover" />
                <AvatarFallback className="text-xs sm:text-sm font-bold bg-[#111111] text-white">
                  {userName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                    {userName}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4 border-[#111111] bg-[#111111] text-white font-medium rounded-full shrink-0"
                  >
                    Pro
                  </Badge>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#707072] truncate font-medium">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Quick Stats Summary Card (클릭 시 /stats 이동) */}
          <Link
            href="/stats"
            onClick={() => setIsOpen(false)}
            className="block p-2.5 sm:p-3 bg-white hover:bg-[#fafafa] transition-colors cursor-pointer group"
            title="통계 페이지로 이동"
          >
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#f5f5f5] group-hover:bg-[#f0f0f0] border border-[#e5e5e5]/80 flex items-center justify-around text-center transition-colors">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#707072] font-medium mb-0.5">
                  <Link2 className="w-3 h-3 text-[#111111] shrink-0" />
                  <span>등록 링크</span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-[#111111]">
                  {totalLinks}개
                </span>
              </div>

              <div className="h-5 sm:h-6 w-[1px] bg-[#e5e5e5]" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#707072] font-medium mb-0.5">
                  <MousePointerClick className="w-3 h-3 text-[#007d48] shrink-0" />
                  <span>총 클릭수</span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-[#111111]">
                  {totalClicks.toLocaleString()}회
                </span>
              </div>
            </div>

            {topLink && (
              <div className="mt-2 px-2.5 py-1.5 bg-[#fbfbfb] rounded-lg border border-[#f0f0f0] flex items-center justify-between text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5 text-[#707072] truncate mr-1">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">인기: <strong>{topLink.title}</strong></span>
                </div>
                <span className="font-semibold text-[#111111] shrink-0">
                  {topLink.clickCount ?? topLink.clicks ?? 0}회
                </span>
              </div>
            )}
          </Link>

          <Separator className="bg-[#f0f0f0]" />

          {/* 3. Action Items */}
          <div className="p-1 sm:p-1.5 space-y-0.5">
            {/* 개인별 공개 페이지 바로가기 */}
            <Link
              href={`/${userHandle}`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#111111] bg-[#f5f5f5]/60 hover:bg-[#f5f5f5] rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <User className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span className="truncate">내 개인 페이지 이동</span>
              </div>
              <span className="text-[10px] text-[#707072] font-mono shrink-0">/{userHandle}</span>
            </Link>

            {/* 통계 페이지 바로가기 */}
            <Link
              href="/stats"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-medium text-[#111111] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#707072] shrink-0" />
                <span className="truncate">링크 클릭 통계 분석</span>
              </div>
              <span className="text-[10px] text-[#9e9ea0] shrink-0">/stats</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsEditDialogOpen(true);
              }}
              className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-medium text-[#111111] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <UserCog className="w-3.5 h-3.5 text-[#707072] shrink-0" />
                <span className="truncate">프로필 정보 수정</span>
              </div>
              <span className="text-[10px] text-[#9e9ea0] shrink-0">편집</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-medium text-[#111111] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Copy className="w-3.5 h-3.5 text-[#707072] shrink-0" />
                <span className="truncate">내 링크트리 주소 복사</span>
              </div>
              {isCopied ? (
                <span className="text-[10px] text-[#007d48] font-bold flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" /> 복사됨
                </span>
              ) : (
                <span className="text-[10px] text-[#9e9ea0] shrink-0">URL</span>
              )}
            </button>

            <button
              type="button"
              onClick={handlePreviewOpen}
              className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-xs font-medium text-[#111111] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#707072] shrink-0" />
                <span className="truncate">공개 링크트리 미리보기</span>
              </div>
              <span className="text-[10px] text-[#9e9ea0] shrink-0">새 창</span>
            </button>
          </div>

          <Separator className="bg-[#f0f0f0]" />

          {/* 4. Cloud DB Sync Status */}
          <div className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#fafafa] flex items-center justify-between text-[10px] sm:text-[11px] text-[#707072] gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Database className="w-3 h-3 text-[#707072] shrink-0" />
              <span className="font-medium text-[#505052] truncate">
                {isSyncing ? '동기화 중...' : '실시간 클라우드'}
              </span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] text-[#9e9ea0] bg-white px-1.5 py-0.5 rounded border border-[#e5e5e5] shrink-0">
              users/{authUser?.uid ? authUser.uid.slice(0, 5) : '...'}
            </span>
          </div>

          <Separator className="bg-[#f0f0f0]" />

          {/* 5. Logout Action */}
          <div className="p-1 sm:p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600 shrink-0" />
              ) : (
                <LogOut className="w-3.5 h-3.5 text-red-600 shrink-0" />
              )}
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile Edit Dialog */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};
