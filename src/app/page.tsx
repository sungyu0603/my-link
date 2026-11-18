'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useMyLinkStore } from '@/store/useMyLinkStore';
import { subscribeAuthState, syncUserProfile, extractAuthUser } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { ProfileBanner } from '@/components/links/ProfileBanner';
import { StatsSummary } from '@/components/links/StatsSummary';
import { LinkList } from '@/components/links/LinkList';
import { EditorialGrid } from '@/components/links/EditorialGrid';
import { UnauthenticatedView } from '@/components/links/UnauthenticatedView';
import { Separator } from '@/components/ui/separator';
import { dummyEditorialLinks } from '@/data/dummyLinks';

type ViewMode = 'list' | 'editorial';

/**
 * 마이링크 (MyLink) 메인 페이지
 * - Firebase Auth (Google 소셜 로그인) 및 onAuthStateChanged 상태 감지
 * - Firestore users/{user.uid}/links 경로를 통한 사용자별 개인화 데이터 관리
 * - 로그인/미로그인 상태에 따른 반응형 화면 분기
 * - Sonner 기반 토스트 알림 연동
 */
export default function LinksPage() {
  const {
    authUser,
    isAuthReady,
    setAuthUser,
    profile,
    updateProfile,
    incrementLinkClick,
    resetToInitial,
    addLink,
    updateLink,
    deleteLink,
    subscribeLinks,
    loadLinksFromFirestore,
    loadUserProfileFromFirestore,
    isLinksLoaded,
  } = useMyLinkStore();

  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // SSR Hydration safeguard
  useEffect(() => {
    setMounted(true);
  }, []);

  // onAuthStateChanged를 통한 구글 로그인 인증 상태 감지 및 Firestore 개인화 연동
  useEffect(() => {
    if (!mounted) return;

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = subscribeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const userInfo = extractAuthUser(firebaseUser);
        setAuthUser(userInfo);

        try {
          // 1) Firestore users/{user.uid} 프로필 동기화 및 로드
          const syncedProfile = await syncUserProfile(firebaseUser);
          updateProfile(syncedProfile);
          await loadUserProfileFromFirestore(firebaseUser.uid);

          // 2) Firestore users/{user.uid}/links 컬렉션 단발성 로드 & 실시간 구독
          await loadLinksFromFirestore(firebaseUser.uid, true);

          if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
          }
          unsubscribeSnapshot = subscribeLinks(firebaseUser.uid);
        } catch (error) {
          console.error('[LinksPage] 유저 데이터 동기화 실패:', error);
        }
      } else {
        setAuthUser(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [
    mounted,
    setAuthUser,
    updateProfile,
    loadUserProfileFromFirestore,
    loadLinksFromFirestore,
    subscribeLinks,
  ]);

  const links = mounted && profile?.links ? profile.links : [];

  const handleAddLink = async (newLink: Parameters<typeof addLink>[0]) => {
    try {
      await addLink(newLink);
      if (viewMode !== 'list') {
        setViewMode('list');
      }
      toast.success('새 링크가 등록되었습니다.');
    } catch (error) {
      toast.error('Firestore 저장 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleAddLink] Firestore 오류:', error);
    }
  };

  const handleUpdateLink = async (id: string, updated: Parameters<typeof updateLink>[1]) => {
    try {
      await updateLink(id, updated);
      toast.success('링크 정보가 수정되었습니다.');
    } catch (error) {
      toast.error('Firestore 수정 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleUpdateLink] Firestore 오류:', error);
      throw error;
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
      toast.success('링크가 삭제되었습니다.');
    } catch (error) {
      toast.error('Firestore 삭제 실패 — 보안 규칙을 확인해주세요.');
      console.error('[handleDeleteLink] Firestore 오류:', error);
      throw error;
    }
  };

  const handleResetData = () => {
    resetToInitial();
    if (authUser?.uid) {
      loadLinksFromFirestore(authUser.uid, true);
    }
    toast.info('데이터를 새로고침했습니다.');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-sm text-[#707072] font-medium animate-pulse flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>마이링크 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      {/* ── Global Header (로그인/로그아웃 및 프로필 드롭다운) ── */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddLink={handleAddLink}
        onResetData={handleResetData}
      />

      {/* ── Main Container (Mobile First, max-w-xl) ── */}
      <main className="max-w-xl mx-auto px-4 pb-16">
        {!isAuthReady ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin text-[#111111]" />
            <p className="text-xs text-[#707072] font-medium">인증 상태 확인 중...</p>
          </div>
        ) : !authUser ? (
          /* ── 미로그인 상태 화면 : 서비스 설명 및 Google 로그인 유도 ── */
          <UnauthenticatedView />
        ) : (
          /* ── 로그인 상태 화면 : users/{user.uid}/links 개인화 데이터 화면 ── */
          <>
            {/* 사용자 프로필 배너 */}
            <ProfileBanner profile={profile} />

            <Separator className="my-2 bg-[#e5e5e5]" />

            {/* 통계 요약 (shadcn Card) */}
            <StatsSummary links={links} className="my-4" />

            {/* View Mode: 1) Standard Linktree List View */}
            {viewMode === 'list' && (
              !isLinksLoaded ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-[#e5e5e5]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#111111]" />
                  <p className="text-xs text-[#707072] font-medium">Firestore에서 개인 링크 불러오는 중...</p>
                </div>
              ) : (
                <LinkList
                  links={links}
                  onLinkClick={incrementLinkClick}
                  onAddLink={handleAddLink}
                  onUpdateLink={handleUpdateLink}
                  onDeleteLink={handleDeleteLink}
                />
              )
            )}

            {/* View Mode: 2) Nike Editorial Grid View */}
            {viewMode === 'editorial' && (
              <EditorialGrid items={dummyEditorialLinks} />
            )}
          </>
        )}

        {/* ── Footer ── */}
        <footer className="mt-12 text-center text-xs text-[#707072]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-semibold text-[#111111]">마이링크 (MyLink)</span>
            <span>·</span>
            <span>Firestore 개인화 클라우드</span>
          </div>
          <p className="text-[11px] text-[#9e9ea0]">
            Next.js 16 · Firebase Auth & Firestore · Tailwind CSS v4
          </p>
        </footer>
      </main>
    </div>
  );
}
