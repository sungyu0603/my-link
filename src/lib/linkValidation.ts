import { z } from 'zod';
import {
  Globe,
  BookOpen,
  Sparkles,
  Coffee,
  Mail,
  MessageSquare,
  Link as LinkIcon,
} from 'lucide-react';
import { ProfileLink } from '@/types/profile';

export const MAX_TITLE = 50;
export const MAX_URL = 500;
export const MAX_SUBTITLE = 100;
export const MAX_BADGE = 10;

export const linkFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '링크 이름을 입력해주세요.')
    .min(2, '링크 이름은 최소 2자 이상이어야 합니다.')
    .max(MAX_TITLE, `링크 이름은 최대 ${MAX_TITLE}자 이하로 입력해주세요.`),

  url: z
    .string()
    .trim()
    .min(1, '링크 주소(URL)를 입력해주세요.')
    .max(MAX_URL, `URL은 최대 ${MAX_URL}자 이하이어야 합니다.`)
    .refine((v) => !/\s/.test(v), {
      message: 'URL에 공백(스페이스)이 포함될 수 없습니다.',
    })
    .refine(
      (v) => {
        if (v.startsWith('mailto:')) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.replace('mailto:', ''));
        }
        let n = v;
        if (!/^https?:\/\//i.test(n)) n = `https://${n}`;
        try {
          const p = new URL(n);
          if (!['http:', 'https:'].includes(p.protocol)) return false;
          const h = p.hostname;
          return (
            h === 'localhost' ||
            h === '127.0.0.1' ||
            (h.includes('.') && !h.startsWith('.') && !h.endsWith('.'))
          );
        } catch {
          return false;
        }
      },
      { message: '올바른 웹 주소(예: velog.io/@user, https://example.com)를 입력해주세요.' }
    ),

  subtitle: z
    .string()
    .max(MAX_SUBTITLE, `설명은 최대 ${MAX_SUBTITLE}자 이하이어야 합니다.`),

  category: z.enum(['general', 'content', 'project', 'contact']),

  iconName: z.string(),

  badge: z
    .string()
    .max(MAX_BADGE, `배지는 최대 ${MAX_BADGE}자 이하이어야 합니다.`),

  isFeatured: z.boolean(),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;

export const ICON_OPTIONS = [
  { id: 'globe', label: '웹사이트', icon: Globe },
  { id: 'bookopen', label: '블로그', icon: BookOpen },
  { id: 'sparkles', label: '스파클', icon: Sparkles },
  { id: 'github', label: 'GitHub', icon: LinkIcon },
  { id: 'coffee', label: '후원', icon: Coffee },
  { id: 'mail', label: '이메일', icon: Mail },
  { id: 'messagesquare', label: '메시지', icon: MessageSquare },
  { id: 'link', label: '기본 링크', icon: LinkIcon },
] as const;

export const CATEGORY_OPTIONS: { id: ProfileLink['category']; label: string }[] = [
  { id: 'general', label: '포트폴리오' },
  { id: 'content', label: '콘텐츠 & 글' },
  { id: 'project', label: '오픈소스/프로젝트' },
  { id: 'contact', label: '네트워킹 & 연락처' },
];

export const BADGE_PRESETS = ['대표', 'HOT', 'NEW', '추천', 'BEST'] as const;

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('mailto:')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * 수정/생성 시각을 '방금 전', 'N분 전', 'N시간 전', 'YYYY.MM.DD' 등의 친절한 문자열로 변환
 */
export function formatRelativeTime(dateString?: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 0) return '방금 전';
  if (diffSec < 60) return '방금 전';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}일 전`;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/**
 * 상세 툴팁용 정확한 일시 포맷 (예: 2026. 11. 18 13:52)
 */
export function formatExactDateTime(dateString?: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${d} ${h}:${min}`;
}

