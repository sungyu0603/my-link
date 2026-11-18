'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchUserProfile,
  saveUserProfileData,
  findUserIdByUsername,
  fetchUserFullProfile,
  fetchLinks,
  UserProfileInfo,
} from '@/lib/firestore-links';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { UserProfile, ProfileLink } from '@/types/profile';

export interface UpdateProfileInput {
  username: string;
  name: string;
  bio: string;
}

export interface PublicUserData {
  userId: string;
  profile: UserProfileInfo;
  links: ProfileLink[];
}

/**
 * 특정 사용자의 프로필 조회 Query (인증된 본인 또는 특정 UID)
 */
export function useUserProfileQuery(userId: string | undefined | null) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      return await fetchUserProfile(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
  });
}

/**
 * Username 기반 공개 프로필 & 링크 동시 조회 Query (/[displayName] 페이지용)
 */
export function usePublicProfileQuery(rawUsername: string | undefined | null) {
  const cleanUsername = (rawUsername || '').trim();

  return useQuery({
    queryKey: ['publicProfile', cleanUsername.toLowerCase().replace(/^@/, '')],
    queryFn: async (): Promise<PublicUserData | null> => {
      if (!cleanUsername) return null;

      // 1) username으로 userId 검색 (where 쿼리)
      const userId = await findUserIdByUsername(cleanUsername);
      if (!userId) return null;

      // 2) 프로필 로드: users/{userId}/profile
      const profile = await fetchUserFullProfile(userId);
      if (!profile) return null;

      // 3) 링크 로드: users/{userId}/links
      const links = await fetchLinks(userId);

      return {
        userId,
        profile,
        links,
      };
    },
    enabled: Boolean(cleanUsername),
    staleTime: 1000 * 60 * 2, // 2분 캐싱
  });
}

/**
 * 프로필 업데이트 Mutation (낙관적 업데이트 / Optimistic Update 지원)
 */
export function useUpdateProfileMutation(userId: string | undefined | null) {
  const queryClient = useQueryClient();
  const { updateProfile, profile: currentStoreProfile } = useMyLinkStore();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!userId) {
        throw new Error('로그인이 필요합니다.');
      }
      await saveUserProfileData(userId, input);
      return input;
    },
    // ── 1. 낙관적 업데이트 수행 (서버 응답을 기다리지 않고 즉시 UI 및 캐시 변경) ──
    onMutate: async (newInput: UpdateProfileInput) => {
      if (!userId) return;

      // 이전 쿼리 요청들 취소
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });
      await queryClient.cancelQueries({ queryKey: ['publicProfile'] });

      // 롤백용 이전 캐시 스냅샷 저장
      const previousUserProfile = queryClient.getQueryData<UserProfile>(['userProfile', userId]);
      const previousStoreState = {
        name: currentStoreProfile.name,
        handle: currentStoreProfile.handle,
        bio: currentStoreProfile.bio,
      };

      // Query 캐시에 새 데이터 즉시 반영 (낙관적 업데이트)
      queryClient.setQueryData<UserProfile | null>(['userProfile', userId], (old) => {
        if (!old) return old;
        return {
          ...old,
          name: newInput.name,
          handle: newInput.username,
          bio: newInput.bio,
        };
      });

      // Zustand 전역 상태에도 즉시 반영 (화면 동기화)
      updateProfile({
        name: newInput.name,
        handle: newInput.username,
        bio: newInput.bio,
      });

      return { previousUserProfile, previousStoreState };
    },
    // ── 2. 에러 발생 시 이전 스냅샷으로 즉시 롤백 ──
    onError: (err: any, _newInput, context) => {
      console.error('[useUpdateProfileMutation] 프로필 저장 에러:', err);

      if (userId && context?.previousUserProfile) {
        queryClient.setQueryData(['userProfile', userId], context.previousUserProfile);
      }
      if (context?.previousStoreState) {
        updateProfile(context.previousStoreState);
      }

      toast.error('프로필 저장 중 오류가 발생하여 이전 상태로 롤백되었습니다.');
    },
    // ── 3. 성공 알림 및 백그라운드 재동기화 ──
    onSuccess: (savedInput) => {
      toast.success(`프로필이 성공적으로 업데이트되었습니다: @${savedInput.username}`);
    },
    // ── 4. 요청 완료 후 서버 데이터와 캐시 완전 무효화 동기화 ──
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    },
  });
}
