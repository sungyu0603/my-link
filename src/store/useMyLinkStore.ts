import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProfileData } from '../data/initialProfile';
import { UserProfile, ProfileLink, SocialLink, ThemePreset } from '../types/profile';
import {
  fetchLinks,
  subscribeLinks as subscribeToFirestoreLinks,
  createLink,
  updateLinkDoc,
  deleteLinkDoc,
  fetchUserProfile,
  saveUserProfileData,
} from '../lib/firestore-links';
import { AuthUserInfo } from '../lib/auth';

// 테마 상세 확장 인터페이스
export interface ThemeDetailConfig {
  preset: ThemePreset;
  buttonShape: 'pill' | 'rounded' | 'sharp' | 'outline';
  customBgColor?: string;
  customButtonColor?: string;
}

interface MyLinkState {
  // 인증 사용자 정보
  authUser: AuthUserInfo | null;
  isAuthReady: boolean;
  setAuthUser: (user: AuthUserInfo | null) => void;

  // 현재 활성화된 프로필 데이터
  profile: UserProfile;
  themeConfig: ThemeDetailConfig;

  // Firestore 동기화 상태
  isLinksLoaded: boolean;
  isSyncing: boolean;

  // Firestore에서 링크 구독 및 불러오기 (경로: users/{user.uid}/links)
  subscribeLinks: (uid?: string) => () => void;
  loadLinksFromFirestore: (uid?: string, force?: boolean) => Promise<void>;
  loadUserProfileFromFirestore: (uid: string) => Promise<void>;

  // 프로필 정보 수정
  updateProfile: (data: Partial<UserProfile>) => void;
  updateUserProfileInFirestore: (data: {
    username: string;
    name: string;
    bio: string;
  }) => Promise<boolean>;
  setThemePreset: (preset: ThemePreset) => void;
  setButtonShape: (shape: ThemeDetailConfig['buttonShape']) => void;
  setCustomColors: (bg?: string, button?: string) => void;

  // 링크 조작 (Firestore users/{user.uid}/links 동기화)
  addLink: (link: Omit<ProfileLink, 'id' | 'clicks' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLink: (id: string, updated: Partial<ProfileLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (links: ProfileLink[]) => void;
  toggleLinkActive: (id: string) => void;

  // 소셜 링크 조작
  addSocial: (social: Omit<SocialLink, 'id'>) => void;
  updateSocial: (id: string, updated: Partial<SocialLink>) => void;
  deleteSocial: (id: string) => void;

  // 통계 이벤트
  incrementLinkClick: (linkId: string) => void;
  resetToInitial: () => void;
  clearUserDataOnLogout: () => void;
}

export const useMyLinkStore = create<MyLinkState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthReady: false,
      profile: initialProfileData,
      themeConfig: {
        preset: initialProfileData.theme || 'midnight',
        buttonShape: 'pill',
      },
      isLinksLoaded: false,
      isSyncing: false,

      setAuthUser: (authUser) => {
        set({ authUser, isAuthReady: true });
        if (authUser) {
          // 사용자 이름과 아바타를 프로필에 즉시 반영
          set((state) => ({
            profile: {
              ...state.profile,
              name: authUser.displayName || state.profile.name || '김선규',
              avatarUrl: authUser.photoURL || state.profile.avatarUrl,
              handle: authUser.email ? authUser.email.split('@')[0] : state.profile.handle,
            },
          }));
        }
      },

      /* ── Firestore 유저 프로필 로드 (경로: users/{uid}) ── */
      loadUserProfileFromFirestore: async (uid: string) => {
        try {
          const remoteProfile = await fetchUserProfile(uid);
          if (remoteProfile) {
            set((state) => ({
              profile: {
                ...state.profile,
                ...remoteProfile,
                // 링크는 links 하위 컬렉션에서 별도 관리되므로 보존
                links: state.profile.links,
              },
            }));
          }
        } catch (error) {
          console.error('[Firestore] loadUserProfileFromFirestore 오류:', error);
        }
      },

      /* ── Firestore 실시간 링크 목록 구독 (경로: users/{user.uid}/links) ── */
      subscribeLinks: (overrideUid?: string) => {
        const uid = overrideUid || get().authUser?.uid;
        if (!uid) {
          set({ isLinksLoaded: true, isSyncing: false });
          return () => {};
        }

        set({ isSyncing: true });
        const unsubscribe = subscribeToFirestoreLinks(
          uid,
          (links) => {
            set((state) => ({
              profile: {
                ...state.profile,
                links,
              },
              isLinksLoaded: true,
              isSyncing: false,
            }));
          },
          (error) => {
            console.error(`[Firestore] 실시간 동기화 에러 (${uid}):`, error);
            set({ isSyncing: false, isLinksLoaded: true });
          }
        );
        return unsubscribe;
      },

      /* ── Firestore에서 링크 로드 (단발성) (경로: users/{user.uid}/links) ── */
      loadLinksFromFirestore: async (overrideUid?: string, force = false) => {
        const uid = overrideUid || get().authUser?.uid;
        if (!uid) {
          set({ isLinksLoaded: true, isSyncing: false });
          return;
        }

        if (get().isLinksLoaded && !force) return;

        try {
          set({ isSyncing: true });
          const links = await fetchLinks(uid);
          set((state) => ({
            profile: {
              ...state.profile,
              links,
            },
            isLinksLoaded: true,
            isSyncing: false,
          }));
        } catch (error) {
          console.error(`[Firestore] 링크 로드 실패 (${uid}):`, error);
          set({ isSyncing: false, isLinksLoaded: true });
        }
      },

      updateProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
        })),

      /* ── 프로필 정보 업데이트 (users/{userId}/profile 동기화) ── */
      updateUserProfileInFirestore: async (data: {
        username: string;
        name: string;
        bio: string;
      }): Promise<boolean> => {
        const uid = get().authUser?.uid;
        const cleanUsername = data.username.trim().toLowerCase().replace(/^@/, '');
        const cleanName = data.name.trim();
        const cleanBio = data.bio.trim();

        const currentProfile = get().profile;
        const currentHandle = (currentProfile.handle || '').trim().toLowerCase().replace(/^@/, '');
        const currentName = (currentProfile.name || '').trim();
        const currentBio = (currentProfile.bio || '').trim();

        // 변경된 사항이 없으면 Firestore 업데이트 및 상태 재설정을 건너뜀
        if (
          cleanUsername === currentHandle &&
          cleanName === currentName &&
          cleanBio === currentBio
        ) {
          return false;
        }

        // 1) 로컬 상태에 즉시 반영
        set((state) => ({
          profile: {
            ...state.profile,
            handle: cleanUsername,
            name: cleanName,
            bio: cleanBio,
          },
          authUser: state.authUser
            ? {
                ...state.authUser,
                displayName: cleanName,
              }
            : null,
        }));

        // 2) Firestore users/{uid} 및 users/{uid}/profile 에 영구 저장
        if (uid) {
          set({ isSyncing: true });
          try {
            await saveUserProfileData(uid, {
              username: cleanUsername,
              name: cleanName,
              bio: cleanBio,
            });
          } catch (error) {
            console.error('[Firestore] 프로필 저장 실패:', error);
            throw error;
          } finally {
            set({ isSyncing: false });
          }
        }

        return true;
      },

      setThemePreset: (preset) =>
        set((state) => ({
          profile: { ...state.profile, theme: preset },
          themeConfig: { ...state.themeConfig, preset },
        })),

      setButtonShape: (buttonShape) =>
        set((state) => ({
          themeConfig: { ...state.themeConfig, buttonShape },
        })),

      setCustomColors: (bg, button) =>
        set((state) => ({
          themeConfig: {
            ...state.themeConfig,
            customBgColor: bg,
            customButtonColor: button,
          },
        })),

      /* ── 링크 추가 → users/{user.uid}/links 저장 후 로컬 반영 ── */
      addLink: async (linkData) => {
        const uid = get().authUser?.uid || 'anonymous';
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const optimisticLink: ProfileLink = {
          ...linkData,
          id: tempId,
          clicks: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const currentLinks = Array.isArray(state.profile?.links) ? state.profile.links : [];
          return {
            profile: {
              ...state.profile,
              links: [optimisticLink, ...currentLinks],
            },
          };
        });

        try {
          const savedLink = await createLink(uid, linkData);
          set((state) => ({
            profile: {
              ...state.profile,
              links: state.profile.links.map((link) =>
                link.id === tempId ? savedLink : link
              ),
            },
          }));
        } catch (error) {
          console.error('[Firestore] 링크 저장 실패:', error);
          set((state) => ({
            profile: {
              ...state.profile,
              links: state.profile.links.filter((link) => link.id !== tempId),
            },
          }));
          throw error;
        }
      },

      /* ── 링크 수정 → users/{user.uid}/links/{id} 동기화 ── */
      updateLink: async (id, updated) => {
        const uid = get().authUser?.uid || 'anonymous';
        const prevLink = get().profile.links.find((l) => l.id === id);
        const now = new Date().toISOString();

        set((state) => ({
          profile: {
            ...state.profile,
            links: (state.profile?.links || []).map((link) =>
              link.id === id ? { ...link, ...updated, updatedAt: now } : link
            ),
          },
        }));

        if (!id.startsWith('temp_')) {
          try {
            await updateLinkDoc(uid, id, updated);
          } catch (error) {
            console.error('[Firestore] 링크 수정 실패:', error);
            if (prevLink) {
              set((state) => ({
                profile: {
                  ...state.profile,
                  links: (state.profile?.links || []).map((link) =>
                    link.id === id ? prevLink : link
                  ),
                },
              }));
            }
            throw error;
          }
        }
      },

      /* ── 링크 삭제 → users/{user.uid}/links/{id} 동기화 ── */
      deleteLink: async (id) => {
        const uid = get().authUser?.uid || 'anonymous';
        const backup = get().profile.links.find((l) => l.id === id);

        set((state) => ({
          profile: {
            ...state.profile,
            links: (state.profile?.links || []).filter((link) => link.id !== id),
          },
        }));

        if (!id.startsWith('temp_')) {
          try {
            await deleteLinkDoc(uid, id);
          } catch (error) {
            console.error('[Firestore] 링크 삭제 실패:', error);
            if (backup) {
              set((state) => ({
                profile: {
                  ...state.profile,
                  links: [...state.profile.links, backup],
                },
              }));
            }
            throw error;
          }
        }
      },

      reorderLinks: (newLinks) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: newLinks,
          },
        })),

      /* ── 대표 링크 토글 ── */
      toggleLinkActive: (id) => {
        const uid = get().authUser?.uid || 'anonymous';
        const link = get().profile.links.find((l) => l.id === id);
        const newFeatured = !link?.isFeatured;

        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, isFeatured: newFeatured } : link
            ),
          },
        }));

        if (!id.startsWith('temp_')) {
          updateLinkDoc(uid, id, { isFeatured: newFeatured }).catch((error) => {
            console.error('[Firestore] 대표 링크 토글 실패:', error);
          });
        }
      },

      addSocial: (socialData) =>
        set((state) => {
          const newSocial: SocialLink = {
            ...socialData,
            id: `social_${Date.now()}`,
          };
          return {
            profile: {
              ...state.profile,
              socials: [...state.profile.socials, newSocial],
            },
          };
        }),

      updateSocial: (id, updated) =>
        set((state) => ({
          profile: {
            ...state.profile,
            socials: state.profile.socials.map((soc) =>
              soc.id === id ? { ...soc, ...updated } : soc
            ),
          },
        })),

      deleteSocial: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            socials: state.profile.socials.filter((soc) => soc.id !== id),
          },
        })),

      /* ── 클릭 수 증가 ── */
      incrementLinkClick: (linkId) => {
        const uid = get().authUser?.uid || 'anonymous';
        const link = get().profile.links.find((l) => l.id === linkId);
        const newClicks = (link?.clicks || 0) + 1;

        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === linkId ? { ...link, clicks: newClicks } : link
            ),
          },
        }));

        if (!linkId.startsWith('temp_')) {
          updateLinkDoc(uid, linkId, { clicks: newClicks }).catch((error) => {
            console.error('[Firestore] 클릭 수 업데이트 실패:', error);
          });
        }
      },

      resetToInitial: () => {
        const uid = get().authUser?.uid;
        set(() => ({
          profile: initialProfileData,
          themeConfig: {
            preset: initialProfileData.theme || 'midnight',
            buttonShape: 'pill',
          },
          isLinksLoaded: false,
        }));
        if (uid) {
          get().loadLinksFromFirestore(uid, true);
        }
      },

      clearUserDataOnLogout: () => {
        set({
          authUser: null,
          profile: {
            ...initialProfileData,
            links: [],
          },
          isLinksLoaded: false,
          isSyncing: false,
        });
      },
    }),
    {
      name: 'mylink-app-storage',
      partialize: (state) => ({
        themeConfig: state.themeConfig,
      }),
    }
  )
);
