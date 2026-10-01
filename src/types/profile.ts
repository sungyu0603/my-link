export interface SocialLink {
  id: string;
  platform: 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email' | 'blog' | 'discord';
  url: string;
  label: string;
}

export interface ProfileLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  iconName: string;
  badge?: string;
  isFeatured?: boolean;
  clicks: number;
  category: 'general' | 'project' | 'content' | 'contact';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  stars?: number;
  period: string;
  status: 'completed' | 'in-progress' | 'maintained';
}

export interface SkillItem {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  level: number; // 1-100
}

export interface GuestbookEntry {
  id: string;
  author: string;
  avatarSeed: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
}

export type ThemePreset = 'midnight' | 'minimal' | 'sunset' | 'emerald' | 'cyberpunk';

export interface UserProfile {
  name: string;
  handle: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl: string;
  bannerGradient: string;
  statusMessage: string;
  isAvailableForHire: boolean;
  theme: ThemePreset;
  socials: SocialLink[];
  links: ProfileLink[];
  projects: ProjectItem[];
  skills: SkillItem[];
}
