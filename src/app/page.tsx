'use client';

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  LayoutGrid,
  List,
  Check,
  Plus,
} from 'lucide-react';

import { useMyLinkStore } from '@/store/useMyLinkStore';
import { dummyEditorialLinks, dummyProfileLinks } from '@/data/dummyLinks';
import { ProfileBanner } from '@/components/links/ProfileBanner';
import { StatsSummary } from '@/components/links/StatsSummary';
import { LinkList } from '@/components/links/LinkList';
import { AddLinkDialog } from '@/components/links/AddLinkDialog';
import { EditorialGrid } from '@/components/links/EditorialGrid';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ViewMode = 'list' | 'editorial';

/**
 * 마이링크 (MyLink) 메인 페이지
 * - 전면 Tailwind CSS 유틸리티 스타일 적용 (모듈 CSS 배제)
 * - shadcn/ui 기반 재사용 컴포넌트(ProfileBanner, StatsSummary, LinkList, EditorialGrid) 조립
 */
export default function LinksPage() {
  const { profile, incrementLinkClick, resetToInitial, addLink, deleteLink, loadLinksFromFirestore, isLinksLoaded, isSyncing } = useMyLinkStore();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SSR Hydration safeguard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Firestore에서 링크 데이터 로드
  useEffect(() => {
    if (mounted) {
      loadLinksFromFirestore();
    }
  }, [mounted, loadLinksFromFirestore]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Firestore 로드 완료 시 스토어 데이터 사용, 미완료 시 더미 데이터 폴백
  const links = mounted && isLinksLoaded && profile?.links
    ? profile.links
    : mounted && !isLinksLoaded
      ? dummyProfileLinks  // 아직 로딩 중이면 더미 표시
      : dummyProfileLinks;

  const handleAddLink = async (newLink: Parameters<typeof addLink>[0]) => {
    try {
      await addLink(newLink);
      if (viewMode !== 'list') {
        setViewMode('list');
      }
    } catch (error) {
      showToast('⚠️ Firestore 저장 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleAddLink] Firestore 오류:', error);
    }
  };

  const handleResetData = () => {
    resetToInitial();
    showToast('더미 데이터가 기본 상태로 초기화되었습니다.');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-sm text-[#707072] font-medium animate-pulse">
          마이링크 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#111111] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-[#007d48]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── Top Brand Bar ── */}
      <header className="w-full bg-white border-b border-[#e5e5e5] sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tighter text-sm uppercase text-[#111111]">
              MYLINK
            </span>
            <span className="text-[#cacacb]">/</span>
            <span className="text-xs font-semibold text-[#707072]">
              LINKTREE
            </span>
          </div>

          {/* View Mode Switch, Add Link & Reset Action (shadcn Button & Tailwind) */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-[#f5f5f5] p-0.5 rounded-full border border-[#e5e5e5]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-[#707072] hover:text-[#111111]'
                }`}
                title="기본 링크트리 목록 뷰"
              >
                <List className="w-3.5 h-3.5" />
                <span>목록</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'editorial'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-[#707072] hover:text-[#111111]'
                }`}
                title="나이키 에디토리얼 그리드 뷰"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>에디토리얼</span>
              </button>
            </div>

            <AddLinkDialog
              onAddLink={handleAddLink}
              onShowToast={showToast}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]"
                  title="새 링크 추가"
                  aria-label="새 링크 추가"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              }
            />

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleResetData}
              className="rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]"
              title="더미 데이터 새로고침 / 리셋"
              aria-label="더미 데이터 새로고침"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Container (Mobile First, max-w-xl) ── */}
      <main className="max-w-xl mx-auto px-4 pb-16">
        {/* Profile Header Component (shadcn Avatar, Badges & Socials) */}
        <ProfileBanner profile={profile} onShowToast={showToast} />

        <Separator className="my-2 bg-[#e5e5e5]" />

        {/* Telemetry & Statistics Summary (shadcn Card) */}
        <StatsSummary links={links} className="my-4" />

        {/* View Mode: 1) Standard Linktree List View (shadcn Input, Button, Card, Dialog) */}
        {viewMode === 'list' && (
          <LinkList
            links={links}
            onLinkClick={incrementLinkClick}
            onShowToast={showToast}
            onAddLink={handleAddLink}
            onDeleteLink={deleteLink}
          />
        )}

        {/* View Mode: 2) Nike Editorial Grid View (shadcn Card, Badge) */}
        {viewMode === 'editorial' && (
          <EditorialGrid items={dummyEditorialLinks} />
        )}

        {/* ── Footer ── */}
        <footer className="mt-12 text-center text-xs text-[#707072]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-semibold text-[#111111]">마이링크 (MyLink)</span>
            <span>·</span>
            <span>Firestore 기반 링크 관리</span>
          </div>
          <p className="text-[11px] text-[#9e9ea0]">
            Next.js 16 · React 19 · shadcn/ui · Zustand 5 · Pure Tailwind CSS v4
          </p>
        </footer>
      </main>
    </div>
  );
}
