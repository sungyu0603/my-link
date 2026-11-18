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
} from '../lib/firestore-links';

// 테마 상세 확장 인터페이스
export interface ThemeDetailConfig {
  preset: ThemePreset;
  buttonShape: 'pill' | 'rounded' | 'sharp' | 'outline';
  customBgColor?: string;
  customButtonColor?: string;
}

interface MyLinkState {
  // 현재 활성화된 프로필 데이터
  profile: UserProfile;
  themeConfig: ThemeDetailConfig;

  // Firestore 동기화 상태
  isLinksLoaded: boolean;
  isSyncing: boolean;

  // Firestore에서 링크 구독 및 불러오기
  subscribeLinks: () => () => void;
  loadLinksFromFirestore: (force?: boolean) => Promise<void>;

  // 프로필 정보 수정
  updateProfile: (data: Partial<UserProfile>) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setButtonShape: (shape: ThemeDetailConfig['buttonShape']) => void;
  setCustomColors: (bg?: string, button?: string) => void;

  // 링크 조작 (Firestore 동기화)
  addLink: (link: Omit<ProfileLink, 'id' | 'clicks'>) => Promise<void>;
  updateLink: (id: string, updated: Partial<ProfileLink>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (links: ProfileLink[]) => void;
  toggleLinkActive: (id: string) => void;

  // 소셜 링크 조작
  addSocial: (social: Omit<SocialLink, 'id'>) => void;
  updateSocial: (id: string, updated: Partial<SocialLink>) => void;
  deleteSocial: (id: string) => void;

  // 통계 이벤트
  incrementLinkClick: (linkId: string) => void;
  resetToInitial: () => void;
}

export const useMyLinkStore = create<MyLinkState>()(
  persist(
    (set, get) => ({
      profile: initialProfileData,
      themeConfig: {
        preset: initialProfileData.theme || 'midnight',
        buttonShape: 'pill',
      },
      isLinksLoaded: false,
      isSyncing: false,

      /* ── Firestore 실시간 링크 목록 구독 (경로: users/anonymous/links, createdAt 내림차순) ── */
      subscribeLinks: () => {
        set({ isSyncing: true });
        const unsubscribe = subscribeToFirestoreLinks(
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
            console.error('[Firestore] 실시간 동기화 에러:', error);
            set({ isSyncing: false, isLinksLoaded: true });
          }
        );
        return unsubscribe;
      },

      /* ── Firestore에서 링크 로드 (단발성) ── */
      loadLinksFromFirestore: async (force = false) => {
        if (get().isLinksLoaded && !force) return;

        try {
          set({ isSyncing: true });
          const links = await fetchLinks();
          set((state) => ({
            profile: {
              ...state.profile,
              links,
            },
            isLinksLoaded: true,
            isSyncing: false,
          }));
        } catch (error) {
          console.error('[Firestore] 링크 로드 실패:', error);
          set({ isSyncing: false, isLinksLoaded: true });
        }
      },

      updateProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
        })),

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

      /* ── 링크 추가 → Firestore 저장 후 로컬 반영 ── */
      addLink: async (linkData) => {
        // 1) 낙관적 업데이트: 임시 ID로 즉시 UI 반영
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const optimisticLink: ProfileLink = {
          ...linkData,
          id: tempId,
          clicks: 0,
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

        // 2) Firestore에 비동기 저장 → 실제 ID로 교체
        try {
          const savedLink = await createLink(linkData);
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
          // 실패 시 낙관적 업데이트 롤백
          set((state) => ({
            profile: {
              ...state.profile,
              links: state.profile.links.filter((link) => link.id !== tempId),
            },
          }));
          throw error; // 호출부에서 에러 처리 가능
        }
      },

      /* ── 링크 수정 → Firestore 동기화 ── */
      updateLink: (id, updated) => {
        // 낙관적 업데이트
        set((state) => ({
          profile: {
            ...state.profile,
            links: (state.profile?.links || []).map((link) =>
              link.id === id ? { ...link, ...updated } : link
            ),
          },
        }));

        // temp_ 프리픽스인 경우 아직 Firestore에 없으므로 스킵
        if (!id.startsWith('temp_')) {
          updateLinkDoc(id, updated).catch((error) => {
            console.error('[Firestore] 링크 수정 실패:', error);
          });
        }
      },

      /* ── 링크 삭제 → Firestore 동기화 ── */
      deleteLink: (id) => {
        // 롤백용 백업
        const backup = get().profile.links.find((l) => l.id === id);

        // 낙관적 업데이트
        set((state) => ({
          profile: {
            ...state.profile,
            links: (state.profile?.links || []).filter((link) => link.id !== id),
          },
        }));

        // Firestore 삭제
        if (!id.startsWith('temp_')) {
          deleteLinkDoc(id).catch((error) => {
            console.error('[Firestore] 링크 삭제 실패:', error);
            // 실패 시 롤백
            if (backup) {
              set((state) => ({
                profile: {
                  ...state.profile,
                  links: [...state.profile.links, backup],
                },
              }));
            }
          });
        }
      },

      reorderLinks: (newLinks) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: newLinks,
          },
        })),

      /* ── 대표 링크 토글 → Firestore 동기화 ── */
      toggleLinkActive: (id) => {
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
          updateLinkDoc(id, { isFeatured: newFeatured }).catch((error) => {
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

      /* ── 클릭 수 증가 → Firestore 동기화 ── */
      incrementLinkClick: (linkId) => {
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
          updateLinkDoc(linkId, { clicks: newClicks }).catch((error) => {
            console.error('[Firestore] 클릭 수 업데이트 실패:', error);
          });
        }
      },

      resetToInitial: () =>
        set(() => ({
          profile: initialProfileData,
          themeConfig: {
            preset: initialProfileData.theme || 'midnight',
            buttonShape: 'pill',
          },
          isLinksLoaded: false,
        })),
    }),
    {
      name: 'mylink-app-storage',
      // Firestore가 관리하는 링크 데이터와 로딩 상태는 로컬 스토리지 캐시에서 제외
      partialize: (state) => ({
        themeConfig: state.themeConfig,
        profile: {
          ...state.profile,
          links: [],
        },
      }),
    }
  )
);
