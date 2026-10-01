'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Globe,
  BookOpen,
  Mail,
  Coffee,
  Share2,
  Check,
  ExternalLink,
  Sparkles,
  Code2,
  MapPin,
  Heart,
  Star,
  Zap,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Trophy,
  Layers,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Social SVG Icons (not in this lucide version)
// ─────────────────────────────────────────────
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16M4 20L20 4" />
      <path d="M4 4h6l10 16h-6z" fill="currentColor" stroke="none" opacity="0.15"/>
      <path d="M4 4h6l10 16h-6L4 4z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: 'github' | 'blog' | 'email' | 'portfolio' | 'instagram' | 'coffee' | 'linkedin' | 'calendar' | 'newsletter';
  badge?: string;
  featured?: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  status: 'active' | 'completed';
  period: string;
  url: string;
}

interface SkillItem {
  name: string;
  level: number;
  color: string;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const profile = {
  name: '김선규',
  handle: '@seongyu_kim',
  title: '풀스택 소프트웨어 엔지니어 & 크리에이터',
  bio: '사용자 친화적이고 견고한 웹 프로덕트를 만드는 것을 즐깁니다. 최신 프론트엔드 생태계와 클라우드 아키텍처에 깊은 관심이 있습니다.',
  bioEn: 'Building user-friendly and robust web products. Passionate about modern frontend ecosystems and cloud architecture.',
  location: '서울, 대한민국',
  university: '한양대학교',
  email: 'sunkyu@hanyang.ac.kr',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1200&auto=format&fit=crop&q=80',
  isAvailableForHire: true,
  statusMessage: '✨ 새로운 아이디어 빌딩 중 & 커피챗 환영!',
  likes: 128,
};

const skills: SkillItem[] = [
  { name: 'React / Next.js', level: 95, color: 'from-cyan-400 to-blue-500' },
  { name: 'TypeScript', level: 92, color: 'from-blue-400 to-indigo-500' },
  { name: 'Tailwind CSS', level: 90, color: 'from-teal-400 to-cyan-500' },
  { name: 'Node.js', level: 82, color: 'from-green-400 to-emerald-500' },
  { name: 'PostgreSQL', level: 80, color: 'from-indigo-400 to-purple-500' },
  { name: 'Docker / CI/CD', level: 75, color: 'from-orange-400 to-rose-500' },
];

const techBadges = [
  'Next.js', 'TypeScript', 'React', 'Tailwind', 'Node.js',
  'PostgreSQL', 'Docker', 'Figma', 'Git', 'GraphQL',
];

const links: LinkItem[] = [
  {
    id: 'portfolio',
    title: '개인 포트폴리오 웹사이트',
    subtitle: '주요 프로젝트와 작업물 모음',
    url: 'https://sunkyu.dev',
    icon: 'portfolio',
    badge: '대표 링크',
    featured: true,
  },
  {
    id: 'blog',
    title: '기술 블로그 · Tech Insights',
    subtitle: '웹 최적화, Next.js 아키텍처, 개발 회고록',
    url: 'https://velog.io/@sunkyu',
    icon: 'blog',
    badge: '최신 글 5편',
    featured: true,
  },
  {
    id: 'github',
    title: 'GitHub 오픈소스 레포',
    subtitle: '웹 컴포넌트 라이브러리 및 유틸리티 툴킷',
    url: 'https://github.com',
    icon: 'github',
    badge: '1.2k ⭐',
  },
  {
    id: 'newsletter',
    title: '개발자 뉴스레터 구독',
    subtitle: '매주 실무 팁과 프론트엔드 트렌드 소식',
    url: 'https://newsletter.example.com',
    icon: 'newsletter',
    badge: '무료',
  },
  {
    id: 'calendar',
    title: '1:1 커피챗 & 멘토링 신청',
    subtitle: '커리어 고민, 코드 리뷰, 협업 문의',
    url: 'https://calendly.com',
    icon: 'calendar',
    badge: '예약 가능',
  },
  {
    id: 'email',
    title: '이메일 보내기',
    subtitle: '프로젝트 협업 & 커피챗 언제든 환영',
    url: 'mailto:sunkyu@hanyang.ac.kr',
    icon: 'email',
  },
  {
    id: 'coffee',
    title: '커피 한 잔 후원하기 ☕',
    subtitle: '오픈소스 활동과 아티클 제작에 큰 힘이 됩니다',
    url: 'https://buymeacoffee.com',
    icon: 'coffee',
  },
];

const projects: ProjectItem[] = [
  {
    id: 'p1',
    title: 'HyperLink · 링크인바이오 플랫폼',
    description: '크리에이터와 개발자를 위한 초경량, 커스터마이징 가능한 링크 관리 및 방문자 통계 분석 플랫폼.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    stars: 480,
    status: 'active',
    period: '2025.10 – 진행 중',
    url: 'https://github.com',
  },
  {
    id: 'p2',
    title: 'AI Code Reviewer Bot',
    description: 'GitHub PR 생성 시 코드 품질, 보안 취약점, 성능 개선점을 분석해주는 LLM 기반 자동 리뷰 봇.',
    tags: ['Node.js', 'OpenAI API', 'GitHub Actions', 'Docker'],
    stars: 820,
    status: 'completed',
    period: '2025.04 – 2025.08',
    url: 'https://github.com',
  },
  {
    id: 'p3',
    title: 'DevSpace · 개발자 생산성 대시보드',
    description: 'GitHub 알림, 기술 피드, 투두 리스트를 한곳에서 관리하는 브라우저 New Tab 확장 프로그램.',
    tags: ['React', 'Zustand', 'Chrome Extension', 'Tailwind'],
    stars: 310,
    status: 'completed',
    period: '2025.01 – 2025.03',
    url: 'https://github.com',
  },
];

// ─────────────────────────────────────────────
// Icon renderer
// ─────────────────────────────────────────────
function LinkIcon({ type }: { type: LinkItem['icon'] }) {
  const cls = 'w-5 h-5';
  switch (type) {
    case 'github': return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
    case 'instagram': return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
    case 'linkedin': return <LinkedinIcon className={cls} />;
    case 'blog': return <BookOpen className={cls} />;
    case 'portfolio': return <Globe className={cls} />;
    case 'email': return <Mail className={cls} />;
    case 'coffee': return <Coffee className={cls} />;
    case 'calendar': return <CalendarDays className={cls} />;
    case 'newsletter': return <MessageSquare className={cls} />;
    default: return <ExternalLink className={cls} />;
  }
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likes, setLikes] = useState(profile.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [animatedLevels, setAnimatedLevels] = useState<number[]>(skills.map(() => 0));

  useEffect(() => {
    if (showSkills) {
      const timer = setTimeout(() => {
        setAnimatedLevels(skills.map((s) => s.level));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedLevels(skills.map(() => 0));
    }
  }, [showSkills]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://sunkyu.dev';
    if (navigator.share) {
      try {
        await navigator.share({ title: '김선규 | 프로필', url });
        return;
      } catch { /* fallback */ }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('프로필 주소가 복사되었습니다! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes((p) => p + 1);
      setIsLiked(true);
      showToast('응원해주셔서 감사합니다 💖');
    } else {
      setLikes((p) => p - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* ── Ambient Background Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* ══════════════════════════════════
            BANNER + AVATAR CARD
        ══════════════════════════════════ */}
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50 mb-6">

          {/* Banner */}
          <div className="relative h-40 sm:h-52 w-full overflow-hidden">
            <Image
              src={profile.bannerUrl}
              alt="배너 이미지"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#080c14]" />
            {/* Top action buttons */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:bg-black/70 border border-white/15 text-xs font-medium transition-all active:scale-95 shadow-lg"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? '복사됨!' : '공유하기'}</span>
              </button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="bg-[#0d1220]/90 backdrop-blur-xl px-5 sm:px-8 pb-7">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">

              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-violet-500 via-indigo-500 to-sky-400 shadow-xl shadow-indigo-900/40">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-[#0d1220]">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 112px, 128px"
                      priority
                    />
                  </div>
                </div>
                {/* Availability dot */}
                {profile.isAvailableForHire && (
                  <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-[#0d1220] shadow-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  </span>
                )}
              </div>

              {/* Like + Share */}
              <div className="flex items-center gap-2 sm:pb-2">
                <button
                  onClick={handleLike}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                    isLiked
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  <span>응원하기 {likes}</span>
                </button>
              </div>
            </div>

            {/* Name & Info */}
            <div className="text-center sm:text-left space-y-3">
              {/* Name row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {profile.name}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20 flex-shrink-0" />
                </div>
                <span className="text-sm text-slate-400 font-medium">{profile.handle}</span>
                {profile.isAvailableForHire && (
                  <span className="inline-flex items-center gap-1 mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 w-fit">
                    <Briefcase className="w-3 h-3" />
                    협업 가능
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="text-sm sm:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                {profile.title}
              </p>

              {/* Bio */}
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-300 max-w-xl">
                {profile.bio}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500 italic max-w-xl">
                {profile.bioEn}
              </p>

              {/* Location & Status */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{profile.university}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{profile.statusMessage}</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-3">
                {[
                  { icon: <GithubIcon className="w-4 h-4" />, href: 'https://github.com', label: 'GitHub' },
                  { icon: <LinkedinIcon className="w-4 h-4" />, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: <TwitterIcon className="w-4 h-4" />, href: 'https://twitter.com', label: 'Twitter' },
                  { icon: <InstagramIcon className="w-4 h-4" />, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: <Mail className="w-4 h-4" />, href: `mailto:${profile.email}`, label: 'Email' },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/5 hover:border-white/20 transition-all duration-200 active:scale-95 hover:scale-105"
                  >
                    {icon}
                  </a>
                ))}
              </div>

              {/* Stats */}
              <div className="pt-5 mt-4 border-t border-white/[0.07] grid grid-cols-3 gap-2 text-center">
                {[
                  { value: links.length, label: '등록된 링크', icon: <Layers className="w-4 h-4" /> },
                  { value: projects.length, label: '프로젝트', icon: <Trophy className="w-4 h-4" /> },
                  { value: '8.5k+', label: '누적 클릭', icon: <Zap className="w-4 h-4" /> },
                ].map(({ value, label, icon }) => (
                  <div key={label} className="py-3 px-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                    <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">{icon}</div>
                    <span className="block text-xl font-bold text-white">{value}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            TECH BADGE STRIP
        ══════════════════════════════════ */}
        <div className="mb-6 overflow-hidden">
          <div className="flex flex-wrap gap-2 justify-center">
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/60 hover:border-indigo-600/50 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            LINK CARDS
        ══════════════════════════════════ */}
        <section className="mb-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1 mb-4">
            🔗 Links
          </h2>
          {links.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.url.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                item.featured
                  ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900/60 border-indigo-700/40 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-950/40'
                  : 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700/60'
              }`}
            >
              {item.featured && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-indigo-400 to-violet-500" />
              )}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105 border ${
                  item.featured
                    ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'
                    : 'bg-white/5 border-white/10 text-slate-400 group-hover:bg-indigo-600/15 group-hover:text-indigo-400'
                }`}>
                  <LinkIcon type={item.icon} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold transition-colors ${
                      item.featured ? 'text-indigo-200 group-hover:text-white' : 'text-white/90 group-hover:text-white'
                    }`}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.featured
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-white/8 text-slate-300 border-white/15'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </a>
          ))}
        </section>

        {/* ══════════════════════════════════
            SKILLS (collapsible)
        ══════════════════════════════════ */}
        <section className="mb-6">
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700/50 transition-all text-sm font-bold text-slate-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>기술 스택 & 숙련도</span>
            </div>
            {showSkills ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showSkills && (
            <div className="mt-3 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 space-y-4">
              {skills.map((skill, i) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                    <span className="text-xs font-bold text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700 ease-out`}
                      style={{
                        width: `${animatedLevels[i]}%`,
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════
            PROJECTS (collapsible)
        ══════════════════════════════════ */}
        <section className="mb-8">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700/50 transition-all text-sm font-bold text-slate-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>프로젝트 포트폴리오</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 font-semibold">
                {projects.length}
              </span>
            </div>
            {showProjects ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showProjects && (
            <div className="mt-3 space-y-3">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-indigo-600/40 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-indigo-950/30 transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        project.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {project.status === 'active' ? '진행 중' : '완료'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {project.period}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400/80">
                      <Star className="w-3 h-3" />
                      {project.stars.toLocaleString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════
            FOOTER
        ══════════════════════════════════ */}
        <footer className="text-center space-y-1.5">
          <p className="text-xs text-slate-500">© 2026 김선규 · All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            Made with <span className="text-rose-500">♥</span> · Powered by{' '}
            <span className="text-indigo-400 font-semibold">MyLink</span>
          </p>
        </footer>
      </div>

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 text-white border border-white/15 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
