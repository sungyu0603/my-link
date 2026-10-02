import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProfileData } from '../data/initialProfile';
import { UserProfile, ProfileLink, SocialLink, ThemePreset } from '../types/profile';

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
  
  // 프로필 정보 수정
  updateProfile: (data: Partial<UserProfile>) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setButtonShape: (shape: ThemeDetailConfig['buttonShape']) => void;
  setCustomColors: (bg?: string, button?: string) => void;

  // 링크 조작
  addLink: (link: Omit<ProfileLink, 'id' | 'clicks'>) => void;
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
    (set) => ({
      profile: initialProfileData,
      themeConfig: {
        preset: initialProfileData.theme || 'midnight',
        buttonShape: 'pill',
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

      addLink: (linkData) =>
        set((state) => {
          const newLink: ProfileLink = {
            ...linkData,
            id: `link_${Date.now()}`,
            clicks: 0,
          };
          return {
            profile: {
              ...state.profile,
              links: [newLink, ...state.profile.links],
            },
          };
        }),

      updateLink: (id, updated) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, ...updated } : link
            ),
          },
        })),

      deleteLink: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.filter((link) => link.id !== id),
          },
        })),

      reorderLinks: (newLinks) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: newLinks,
          },
        })),

      toggleLinkActive: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, isFeatured: !link.isFeatured } : link
            ),
          },
        })),

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

      incrementLinkClick: (linkId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
            ),
          },
        })),

      resetToInitial: () =>
        set(() => ({
          profile: initialProfileData,
          themeConfig: {
            preset: initialProfileData.theme || 'midnight',
            buttonShape: 'pill',
          },
        })),
    }),
    {
      name: 'mylink-app-storage',
    }
  )
);
