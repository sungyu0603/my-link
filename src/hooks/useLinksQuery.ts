'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchLinks,
  createLink,
  updateLinkDoc,
  deleteLinkDoc,
  incrementFirestoreLinkClicks,
} from '@/lib/firestore-links';
import { ProfileLink } from '@/types/profile';
import { useMyLinkStore } from '@/store/useMyLinkStore';

/**
 * 특정 사용자의 링크 목록 조회 Query
 */
export function useLinksQuery(userId: string | undefined | null) {
  return useQuery({
    queryKey: ['links', userId],
    queryFn: async (): Promise<ProfileLink[]> => {
      if (!userId) return [];
      return await fetchLinks(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2, // 2분 캐싱
  });
}

/**
 * 새 링크 추가 Mutation (TanStack Query 기반)
 */
export function useAddLinkMutation(userId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      linkData: Omit<ProfileLink, 'id' | 'clicks' | 'createdAt' | 'updatedAt'>
    ) => {
      const targetUid = userId || 'anonymous';
      return await createLink(targetUid, linkData);
    },
    onSuccess: (newLink) => {
      // TanStack Query 캐시를 직접 업데이트 (refetch 없이 즉시 반영)
      if (userId) {
        queryClient.setQueryData<ProfileLink[]>(['links', userId], (prev) => {
          const list = prev ?? [];
          // 중복 방지: 같은 id가 이미 있으면 교체, 없으면 맨 앞에 추가
          const exists = list.some((l) => l.id === newLink.id);
          return exists ? list.map((l) => (l.id === newLink.id ? newLink : l)) : [newLink, ...list];
        });
      }
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      // ※ syncStoreAddLink 호출 제거 — onSnapshot이 store를 갱신하므로 중복 추가 방지
      toast.success(`새 링크가 등록되었습니다: ${newLink.title}`);
    },
    onError: (error: any) => {
      console.error('[useAddLinkMutation] 링크 추가 실패:', error);
      toast.error('링크를 추가하는 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 기존 링크 수정 Mutation
 */
export function useUpdateLinkMutation(userId: string | undefined | null) {
  const queryClient = useQueryClient();
  const { updateLink: syncStoreUpdateLink } = useMyLinkStore();

  return useMutation({
    mutationFn: async ({
      id,
      updated,
    }: {
      id: string;
      updated: Partial<ProfileLink>;
    }) => {
      const targetUid = userId || 'anonymous';
      await updateLinkDoc(targetUid, id, updated);
      return { id, updated };
    },
    onSuccess: ({ id, updated }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      syncStoreUpdateLink(id, updated);
      toast.success('링크 정보가 수정되었습니다.');
    },
    onError: (error: any) => {
      console.error('[useUpdateLinkMutation] 링크 수정 실패:', error);
      toast.error('링크를 수정하는 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 링크 삭제 Mutation
 */
export function useDeleteLinkMutation(userId: string | undefined | null) {
  const queryClient = useQueryClient();
  const { deleteLink: syncStoreDeleteLink } = useMyLinkStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const targetUid = userId || 'anonymous';
      await deleteLinkDoc(targetUid, id);
      return id;
    },
    onSuccess: (deletedId) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      syncStoreDeleteLink(deletedId);
      toast.success('링크가 삭제되었습니다.');
    },
    onError: (error: any) => {
      console.error('[useDeleteLinkMutation] 링크 삭제 실패:', error);
      toast.error('링크를 삭제하는 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 링크 클릭수 증가 Mutation
 */
export function useIncrementClickMutation(userId: string | undefined | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!userId) return;
      await incrementFirestoreLinkClicks(userId, linkId);
      return linkId;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
      }
    },
  });
}
