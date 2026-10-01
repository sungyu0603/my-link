import { ThemePreset } from '@/types/profile';

export interface ThemeStyles {
  name: string;
  badge: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  accentText: string;
  glow: string;
}

export const THEMES: Record<ThemePreset, ThemeStyles> = {
  midnight: {
    name: '미드나잇 다크',
    badge: '🌙 Dark',
    bgGradient: 'bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#070a12]',
    cardBg: 'bg-slate-900/60 backdrop-blur-md',
    cardBorder: 'border-slate-800/80',
    cardHover: 'hover:border-indigo-500/50 hover:bg-slate-800/80 hover:shadow-indigo-500/10',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    accentBg: 'bg-indigo-600 hover:bg-indigo-500',
    accentText: 'text-indigo-400',
    glow: 'shadow-lg shadow-indigo-950/40',
  },
  minimal: {
    name: '모던 미니멀',
    badge: '☀️ Light / Clean',
    bgGradient: 'bg-gradient-to-br from-slate-100 via-zinc-100 to-stone-200',
    cardBg: 'bg-white/80 backdrop-blur-md',
    cardBorder: 'border-slate-200/90',
    cardHover: 'hover:border-slate-400 hover:bg-white hover:shadow-slate-300/40',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentBg: 'bg-slate-900 hover:bg-slate-800',
    accentText: 'text-slate-900',
    glow: 'shadow-lg shadow-slate-200/50',
  },
  sunset: {
    name: '선셋 엠버',
    badge: '🌅 Sunset',
    bgGradient: 'bg-gradient-to-br from-[#1f0a24] via-[#2f102f] to-[#14051b]',
    cardBg: 'bg-purple-950/40 backdrop-blur-md',
    cardBorder: 'border-pink-900/50',
    cardHover: 'hover:border-pink-500/60 hover:bg-purple-900/50 hover:shadow-pink-500/20',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-pink-200',
    textMuted: 'text-pink-300/70',
    accentBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90',
    accentText: 'text-pink-400',
    glow: 'shadow-lg shadow-pink-950/50',
  },
  emerald: {
    name: '에메랄드 포레스트',
    badge: '🌲 Emerald',
    bgGradient: 'bg-gradient-to-br from-[#021f18] via-[#042f24] to-[#01140f]',
    cardBg: 'bg-emerald-950/40 backdrop-blur-md',
    cardBorder: 'border-emerald-800/40',
    cardHover: 'hover:border-emerald-400/60 hover:bg-emerald-900/40 hover:shadow-emerald-500/20',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200',
    textMuted: 'text-emerald-300/70',
    accentBg: 'bg-emerald-600 hover:bg-emerald-500',
    accentText: 'text-emerald-400',
    glow: 'shadow-lg shadow-emerald-950/50',
  },
  cyberpunk: {
    name: '사이버펑크 네온',
    badge: '⚡ Neon',
    bgGradient: 'bg-gradient-to-br from-[#0a051d] via-[#10072b] to-[#04020a]',
    cardBg: 'bg-[#180b38]/50 backdrop-blur-md',
    cardBorder: 'border-cyan-500/30',
    cardHover: 'hover:border-cyan-400 hover:bg-[#230f52]/70 hover:shadow-cyan-500/20',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200',
    textMuted: 'text-violet-300/70',
    accentBg: 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-95',
    accentText: 'text-cyan-400',
    glow: 'shadow-lg shadow-cyan-950/50',
  },
};
