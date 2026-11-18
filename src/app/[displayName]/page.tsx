'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Eye,
  Share2,
  UserX,
  ArrowLeft,
  Loader2,
  Sparkles,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/layout/Header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconHelper } from '@/components/profile/IconHelper';
import {
  UserProfileInfo,
  incrementLinkClickCount,
} from '@/lib/firestore-links';
import { ProfileLink } from '@/types/profile';
import { usePublicProfileQuery } from '@/hooks/useProfileQuery';
import { useIncrementClickMutation } from '@/hooks/useLinksQuery';

export default function UserPublicPage() {
  const params = useParams();
  const rawParam = params?.displayName;
  const displayName = Array.isArray(rawParam) ? rawParam[0] : rawParam || '';
  const decodedUsername = displayName ? decodeURIComponent(displayName).trim() : '';

  // TanStack Query를 통한 유저 프로필 및 링크 데이터 페칭
  const {
    data: publicUserData,
    isLoading,
    isError,
  } = usePublicProfileQuery(decodedUsername);

  const incrementClickMutation = useIncrementClickMutation(publicUserData?.userId);

  const [isCopied, setIsCopied] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const lastClickedTimeRef = useRef<Record<string, number>>({});

  const userProfile = publicUserData?.profile;
  const rawLinks = publicUserData?.links || [];

  // 조회수(clickCount) 내림차순 정렬
  const links = useMemo(() => {
    return [...rawLinks].sort((a, b) => {
      const clickDiff = (b.clickCount ?? b.clicks ?? 0) - (a.clickCount ?? a.clicks ?? 0);
      if (clickDiff !== 0) return clickDiff;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [rawLinks]);

  const userNotFound = isError || (!isLoading && !publicUserData);

  // 프로필 주소 클립보드 복사
  const handleCopyProfileUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success('프로필 링크가 클립보드에 복사되었습니다.');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 개별 링크 주소 복사
  const handleCopyLink = (e: React.MouseEvent, link: ProfileLink) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedLinkId(link.id);
    toast.success(`'${link.title}' 링크가 복사되었습니다.`);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  // 링크 클릭 핸들러 (Firestore users/{userId}/links/{linkId} 의 clickCount increment(1) 1회만 정확히 증가)
  const handleLinkClick = (link: ProfileLink) => {
    const now = Date.now();
    const lastClicked = lastClickedTimeRef.current[link.id] || 0;
    // 1초 이내 동일 링크 중복 클릭 방지 (2번 증가 방지)
    if (now - lastClicked < 1000) {
      return;
    }
    lastClickedTimeRef.current[link.id] = now;

    // 단일 mutation 호출로 정확히 1회만 increment(1) 수행
    incrementClickMutation.mutate(link.id);
  };

  // ── 1. 로딩 상태 화면 ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-[#111111]" />
            <p className="text-xs font-medium text-[#707072]">
              @{decodeURIComponent(displayName)} 프로필을 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. 404 페이지: username 없거나 일치하는 사용자가 없는 경우 ──
  if (userNotFound || !userProfile) {
    const decodedName = decodeURIComponent(displayName || '');
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#e5e5e5] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-5 text-[#111111]">
              <UserX className="w-8 h-8 text-[#707072]" />
            </div>

            <span className="text-xs font-mono font-bold tracking-wider text-[#9e9ea0] uppercase mb-1">
              404 User Not Found
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-2 tracking-tight">
              사용자를 찾을 수 없습니다
            </h1>
            <p className="text-xs sm:text-sm text-[#707072] leading-relaxed mb-6">
              <strong className="text-[#111111]">@{decodedName}</strong> 사용자는 존재하지 않거나,
              사용자명이 변경되었을 수 있습니다. 주소를 다시 한 번 확인해 주세요.
            </p>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full px-5 bg-[#111111] text-white hover:bg-black font-semibold text-xs h-9 gap-1.5 transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                홈으로 이동
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── 3. 정상 화면: 프로필 카드 + 링크 목록 ──
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col text-[#111111] antialiased">
      {/* 글로벌 네비게이션 헤더 */}
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-10">
        <div className="space-y-6 sm:space-y-8">
          {/* ── 상단: 프로필 카드 (이름, 소개글) ── */}
          <section
            aria-label="프로필 정보"
            className="w-full bg-white border border-[#e5e5e5] rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden"
          >
            {/* 상단 장식용 그라디언트 헤어라인 */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#111111] via-[#505052] to-[#111111]" />

            {/* 공유 버튼 */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={handleCopyProfileUrl}
                className="p-2 rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                title="프로필 링크 복사"
                aria-label="프로필 링크 복사"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-[#007d48]" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* 아바타 */}
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#111111] p-0.5 shadow-md">
                <AvatarImage
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="text-xl sm:text-2xl font-extrabold bg-[#111111] text-white">
                  {userProfile.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* 이름 및 배지 */}
            <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111]">
                {userProfile.name}
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 h-5 border-[#111111] bg-[#111111] text-white font-medium rounded-full"
              >
                공개
              </Badge>
            </div>

            {/* 핸들 (@username) */}
            <p className="text-xs sm:text-sm font-mono text-[#707072] mb-3">
              @{userProfile.username}
            </p>

            {/* 소개글 (소개글이 비어있으면 기본 문구 제공) */}
            <p className="text-xs sm:text-sm text-[#505052] leading-relaxed max-w-md mx-auto whitespace-pre-line font-normal">
              {userProfile.bio || '안녕하세요! 저의 링크와 작업물을 모아둔 공간입니다.'}
            </p>
          </section>

          {/* ── 하단: 링크 목록 (클릭 시 새 탭) ── */}
          <section aria-label="링크 목록" className="w-full space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Link2 className="w-3.5 h-3.5 text-[#111111]" />
                <span>링크 목록</span>
                <span className="text-[#707072] font-normal">({links.length})</span>
              </div>
            </div>

            {links.length === 0 ? (
              /* 빈 링크 안내 */
              <Card className="p-8 text-center bg-white border border-[#e5e5e5] rounded-2xl shadow-none">
                <p className="text-xs sm:text-sm text-[#707072]">
                  아직 등록된 링크가 없습니다.
                </p>
              </Card>
            ) : (
              /* 링크 카드 리스트 */
              <div className="space-y-2.5">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#111111] hover:bg-[#fafafa] transition-all duration-150 active:scale-[0.99] cursor-pointer shadow-xs"
                  >
                    {/* Featured / Badge Tag */}
                    {link.badge && (
                      <span className="absolute -top-2 right-4 px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#111111] text-white tracking-wide uppercase shadow-xs">
                        {link.badge}
                      </span>
                    )}

                    {/* 아이콘 + 제목/설명 */}
                    <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors duration-200">
                        <IconHelper
                          name={link.iconName}
                          className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-xs sm:text-sm font-bold text-[#111111] truncate group-hover:underline underline-offset-2">
                            {link.title}
                          </h2>
                          {link.isFeatured && (
                            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                        </div>

                        {link.subtitle && (
                          <p className="text-[11px] sm:text-xs text-[#707072] truncate mt-0.5">
                            {link.subtitle}
                          </p>
                        )}

                        {/* 플랫폼명/제목 · 조회수 (작은 회색 텍스트, 텍스트 없이 아이콘과 숫자만 표시) */}
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#707072]">
                          <span className="truncate max-w-[140px] sm:max-w-[200px] font-medium">
                            {link.title}
                          </span>
                          <span className="text-[#cacacb]">·</span>
                          <span className="flex items-center gap-1 shrink-0 font-mono text-[#707072]" title="조회수">
                            <Eye className="w-3 h-3 text-[#707072]" />
                            <span>{(link.clickCount ?? link.clicks ?? 0).toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 액션: 복사 & 새 창 아이콘 */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, link)}
                        className="p-2 rounded-lg text-[#707072] hover:text-[#111111] hover:bg-[#f0f0f0] transition-colors"
                        title="URL 복사"
                        aria-label="URL 복사"
                      >
                        {copiedLinkId === link.id ? (
                          <Check className="w-3.5 h-3.5 text-[#007d48]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div
                        className="p-2 text-[#707072] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all"
                        title="새 탭에서 열기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* ── 하단 푸터 ── */}
          <footer className="pt-6 pb-4 text-center border-t border-[#f0f0f0] space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#707072]">
              <span>자신만의 링크를 만들고 싶으신가요?</span>
              <Link
                href="/"
                className="font-bold text-[#111111] hover:underline underline-offset-2"
              >
                MYLINK 시작하기
              </Link>
            </div>
            <p className="text-[10px] font-mono text-[#9e9ea0]">
              POWERED BY MYLINK / LINKTREE
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
