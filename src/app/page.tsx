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
  const {
    profile,
    incrementLinkClick,
    resetToInitial,
    addLink,
    updateLink,
    deleteLink,
    subscribeLinks,
    loadLinksFromFirestore,
    isLinksLoaded,
    isSyncing,
  } = useMyLinkStore();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SSR Hydration safeguard
  useEffect(() => {
    setMounted(true);
  }, []);

  // 페이지 로드 시 Firestore에서 링크 로드 및 실시간 구독 (경로: users/anonymous/links, createdAt 최신순 정렬)
  useEffect(() => {
    if (!mounted) return;

    // 1) 초기 로드 즉시 fetch
    loadLinksFromFirestore(true);

    // 2) 실시간 리스너 등록 (새 링크 추가 시 자동 갱신)
    const unsubscribe = subscribeLinks();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [mounted, loadLinksFromFirestore, subscribeLinks]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Firestore에서 로드된 실제 링크 데이터 (로드 완료 전에는 빈 배열)
  const links = mounted && profile?.links ? profile.links : [];

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

  const handleUpdateLink = async (id: string, updated: Parameters<typeof updateLink>[1]) => {
    try {
      await updateLink(id, updated);
    } catch (error) {
      showToast('⚠️ Firestore 수정 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleUpdateLink] Firestore 오류:', error);
      throw error;
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
    } catch (error) {
      showToast('⚠️ Firestore 삭제 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleDeleteLink] Firestore 오류:', error);
      throw error;
    }
  };

  const handleResetData = () => {
    resetToInitial();
    // 초기화 후 Firestore에서 다시 최신 링크 로드
    loadLinksFromFirestore(true);
    showToast('데이터를 새로고침했습니다.');
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
          !isLinksLoaded ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-[#e5e5e5]">
              <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#707072] font-medium">Firestore에서 링크 불러오는 중...</p>
            </div>
          ) : (
            <LinkList
              links={links}
              onLinkClick={incrementLinkClick}
              onShowToast={showToast}
              onAddLink={handleAddLink}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
            />
          )
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
