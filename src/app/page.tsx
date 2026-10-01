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
  ArrowUpRight,
  Flame,
  Terminal,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Social SVG Icons (Neobrutalism custom vector)
// ─────────────────────────────────────────────
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.79v-7.6H6.46M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  bgColor: string;
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
  color: string;
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
  role: 'FULLSTACK DEV',
  title: '풀스택 소프트웨어 엔지니어 & 프로덕트 빌더 🚀',
  bio: '복잡한 문제를 단순하고 직관적인 코드로 풀어냅니다. 현대적인 웹 기술 스택(Next.js, TypeScript)과 실용적인 사용자 경험을 집요하게 연구합니다.',
  location: '서울, 대한민국',
  university: '한양대학교 컴퓨터소프트웨어학부',
  email: 'sunkyu@hanyang.ac.kr',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  isAvailableForHire: true,
  likes: 142,
};

const skills: SkillItem[] = [
  { name: 'React / Next.js', level: 95, color: 'bg-[#FFE600]' },
  { name: 'TypeScript', level: 92, color: 'bg-[#38BDF8]' },
  { name: 'Tailwind CSS', level: 90, color: 'bg-[#00F59B]' },
  { name: 'Node.js / Express', level: 82, color: 'bg-[#A78BFA]' },
  { name: 'PostgreSQL / Prisma', level: 80, color: 'bg-[#FF6B81]' },
  { name: 'Docker / CI/CD', level: 75, color: 'bg-[#FB923C]' },
];

const techBadges = [
  { name: 'Next.js 16', bg: 'bg-[#FFE600]' },
  { name: 'TypeScript', bg: 'bg-[#38BDF8]' },
  { name: 'React 19', bg: 'bg-[#00F59B]' },
  { name: 'Tailwind', bg: 'bg-[#A78BFA]' },
  { name: 'Node.js', bg: 'bg-[#FF6B81]' },
  { name: 'PostgreSQL', bg: 'bg-[#FBBF24]' },
  { name: 'Figma', bg: 'bg-[#F472B6]' },
  { name: 'Docker', bg: 'bg-[#67E8F9]' },
];

const links: LinkItem[] = [
  {
    id: 'portfolio',
    title: '개인 포트폴리오 웹사이트 🌐',
    subtitle: '주요 프로젝트와 최신 작업물을 한눈에 둘러보세요',
    url: 'https://sunkyu.dev',
    icon: 'portfolio',
    badge: 'MUST VISIT',
    bgColor: 'bg-[#FFE600]',
    featured: true,
  },
  {
    id: 'blog',
    title: '기술 블로그 · Tech Insights ✍️',
    subtitle: '웹 성능 최적화, 프론트엔드 아키텍처 및 개발 회고록',
    url: 'https://velog.io/@sunkyu',
    icon: 'blog',
    badge: 'NEW POST',
    bgColor: 'bg-[#E0E7FF]',
    featured: true,
  },
  {
    id: 'github',
    title: 'GitHub 오픈소스 레포지토리 ⭐',
    subtitle: '유용한 오픈소스 컴포넌트 라이브러리와 유틸리티',
    url: 'https://github.com',
    icon: 'github',
    badge: '1.2k STARS',
    bgColor: 'bg-[#A7F3D0]',
  },
  {
    id: 'newsletter',
    title: '개발자 뉴스레터 구독 📮',
    subtitle: '매주 실무 팁과 글로벌 웹 개발 트렌드를 보내드립니다',
    url: 'https://newsletter.example.com',
    icon: 'newsletter',
    badge: 'FREE',
    bgColor: 'bg-[#FECDD3]',
  },
  {
    id: 'calendar',
    title: '1:1 커피챗 & 멘토링 신청 💬',
    subtitle: '코드 리뷰, 커리어 고민, 협업 아이디어 언제든 환영합니다',
    url: 'https://calendly.com',
    icon: 'calendar',
    badge: 'AVAILABLE',
    bgColor: 'bg-[#BAE6FD]',
  },
  {
    id: 'email',
    title: '이메일 직접 보내기 ✉️',
    subtitle: 'sunkyu@hanyang.ac.kr (프로젝트 및 채용 제안)',
    url: 'mailto:sunkyu@hanyang.ac.kr',
    icon: 'email',
    bgColor: 'bg-[#FED7AA]',
  },
  {
    id: 'coffee',
    title: '커피 한 잔 서포트하기 ☕',
    subtitle: '오픈소스 활동과 양질의 아티클 제작에 큰 힘이 됩니다!',
    url: 'https://buymeacoffee.com',
    icon: 'coffee',
    badge: 'BUY COFFEE',
    bgColor: 'bg-[#FDE047]',
  },
];

const projects: ProjectItem[] = [
  {
    id: 'p1',
    title: '⚡ HyperLink - 링크인바이오 플랫폼',
    description: '크리에이터와 개발자를 위한 초경량 고성능 링크 관리 및 방문자 통계 분석 플랫폼.',
    tags: ['Next.js 16', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    stars: 480,
    status: 'active',
    period: '2025.10 – 진행 중',
    url: 'https://github.com',
    color: 'bg-[#FFE600]',
  },
  {
    id: 'p2',
    title: '🤖 AI Code Reviewer Bot',
    description: 'GitHub PR 생성 시 코드 품질, 보안 취약점, 성능 개선점을 분석해주는 LLM 기반 자동 리뷰 봇.',
    tags: ['Node.js', 'OpenAI API', 'GitHub Actions', 'Docker'],
    stars: 820,
    status: 'completed',
    period: '2025.04 – 2025.08',
    url: 'https://github.com',
    color: 'bg-[#BAE6FD]',
  },
  {
    id: 'p3',
    title: '💻 DevSpace - 개발자 생산성 대시보드',
    description: 'GitHub 알림, 테크 피드, 투두 리스트를 한 화면에서 다루는 모던 New Tab 확장 프로그램.',
    tags: ['React 19', 'Zustand', 'Chrome Extension', 'Tailwind'],
    stars: 310,
    status: 'completed',
    period: '2025.01 – 2025.03',
    url: 'https://github.com',
    color: 'bg-[#A7F3D0]',
  },
];

// ─────────────────────────────────────────────
// Link Icon Selector
// ─────────────────────────────────────────────
function LinkIcon({ type }: { type: LinkItem['icon'] }) {
  const cls = 'w-5 h-5 text-black';
  switch (type) {
    case 'github': return <GithubIcon className={cls} />;
    case 'instagram': return <InstagramIcon className={cls} />;
    case 'linkedin': return <LinkedinIcon className={cls} />;
    case 'blog': return <BookOpen className={cls} strokeWidth={2.5} />;
    case 'portfolio': return <Globe className={cls} strokeWidth={2.5} />;
    case 'email': return <Mail className={cls} strokeWidth={2.5} />;
    case 'coffee': return <Coffee className={cls} strokeWidth={2.5} />;
    case 'calendar': return <CalendarDays className={cls} strokeWidth={2.5} />;
    case 'newsletter': return <MessageSquare className={cls} strokeWidth={2.5} />;
    default: return <ExternalLink className={cls} strokeWidth={2.5} />;
  }
}

// ─────────────────────────────────────────────
// Main Neobrutalism Profile Page
// ─────────────────────────────────────────────
export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likes, setLikes] = useState(profile.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
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
        await navigator.share({ title: '김선규 | 소프트웨어 개발자 프로필', url });
        return;
      } catch {
        /* fallback to copy */
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('✨ 프로필 링크가 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes((p) => p + 1);
      setIsLiked(true);
      showToast('💖 응원해주셔서 정말 감사합니다!');
    } else {
      setLikes((p) => p - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-14 px-4 font-sans text-black selection:bg-[#FFE600] selection:text-black">
      
      {/* ── Top Floating Action Bar ── */}
      <header className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-[#FFE600] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
          <Terminal className="w-3.5 h-3.5" />
          <span>PORTFOLIO_V2.0</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-extrabold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'COPIED!' : 'SHARE'}</span>
        </button>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-2xl mx-auto space-y-6">

        {/* ════════════════════════════════════════
            1. HERO PROFILE CARD (NEOBRUTALISM)
        ════════════════════════════════════════ */}
        <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] rounded-3xl overflow-hidden relative">

          {/* Decorative Checkerboard / Graphic Banner */}
          <div className="h-36 sm:h-44 bg-[#FFE600] border-b-4 border-black relative overflow-hidden flex items-center justify-between px-6">
            {/* Background Graphic Lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 15px, transparent 0, transparent 30px)',
              }}
            />
            
            {/* Quirky Banner Badges */}
            <div className="relative z-10 hidden sm:flex flex-col gap-1.5">
              <span className="inline-block px-3 py-1 bg-black text-white font-mono font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#fff]">
                ⚡ FULL-STACK ARCHITECT
              </span>
              <span className="inline-block px-3 py-1 bg-[#00F59B] text-black font-extrabold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                🚀 BUILDER & PROBLEM SOLVER
              </span>
            </div>

            <div className="relative z-10 ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B81] text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] rotate-[3deg]">
                <Flame className="w-4 h-4 fill-white" />
                OPEN FOR HIRES
              </span>
            </div>
          </div>

          {/* Main Info Body */}
          <div className="px-6 sm:px-8 pb-8 pt-0">
            {/* Avatar & Floating Actions */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              
              {/* Avatar Box */}
              <div className="relative group">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-[#FFE600] border-4 border-black shadow-[6px_6px_0px_0px_#000]">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="144px"
                  />
                </div>
                {/* Active Indicator Pin */}
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-[#00F59B] text-black border-2 border-black font-black text-[11px] shadow-[2px_2px_0px_0px_#000] rotate-[-4deg]">
                  ONLINE ●
                </div>
              </div>

              {/* Heart Cheer Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black font-black text-sm uppercase transition-all duration-150 cursor-pointer ${
                    isLiked
                      ? 'bg-[#FF6B81] text-white shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:bg-pink-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : 'fill-none'}`} strokeWidth={3} />
                  <span>CHEER {likes}</span>
                </button>
              </div>
            </div>

            {/* Profile Meta Details */}
            <div className="space-y-4 text-center sm:text-left">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black flex items-center justify-center sm:justify-start gap-2">
                    {profile.name}
                    <CheckCircle2 className="w-6 h-6 text-black fill-[#00F59B]" strokeWidth={2.5} />
                  </h1>
                  <span className="font-mono font-bold text-sm text-neutral-600 bg-neutral-200 px-2 py-0.5 border border-black rounded inline-block self-center sm:self-auto">
                    {profile.handle}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-[#FFE600] border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-1deg]">
                    {profile.title}
                  </span>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-neutral-800 bg-[#FAF7EE] p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
                {profile.bio}
              </p>

              {/* Location & Affiliation Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 font-bold text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                  {profile.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0E7FF] border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg">
                  <Code2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                  {profile.university}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A7F3D0] border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg">
                  <Briefcase className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                  협업 & 외주 가능
                </span>
              </div>

              {/* Social Channels Row */}
              <div className="pt-3 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                {[
                  { icon: <GithubIcon className="w-4 h-4" />, href: 'https://github.com', bg: 'bg-[#FFE600]', label: 'GitHub' },
                  { icon: <LinkedinIcon className="w-4 h-4" />, href: 'https://linkedin.com', bg: 'bg-[#BAE6FD]', label: 'LinkedIn' },
                  { icon: <TwitterIcon className="w-4 h-4" />, href: 'https://twitter.com', bg: 'bg-[#FECDD3]', label: 'X (Twitter)' },
                  { icon: <InstagramIcon className="w-4 h-4" />, href: 'https://instagram.com', bg: 'bg-[#A7F3D0]', label: 'Instagram' },
                  { icon: <Mail className="w-4 h-4" strokeWidth={2.5} />, href: `mailto:${profile.email}`, bg: 'bg-[#FED7AA]', label: 'Email' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className={`p-2.5 ${s.bg} border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all rounded-xl cursor-pointer`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Stats Neobrutalism Grid */}
              <div className="pt-4 grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-center">
                  <span className="block text-2xl font-black">{links.length}</span>
                  <span className="text-[11px] font-black uppercase text-black/70">LINKS</span>
                </div>
                <div className="p-3 bg-[#00F59B] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-center">
                  <span className="block text-2xl font-black">{projects.length}</span>
                  <span className="text-[11px] font-black uppercase text-black/70">PROJECTS</span>
                </div>
                <div className="p-3 bg-[#38BDF8] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-center">
                  <span className="block text-2xl font-black">8.5k+</span>
                  <span className="text-[11px] font-black uppercase text-black/70">VIEWS</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            2. TICKER / BADGE STRIP
        ════════════════════════════════════════ */}
        <section className="bg-black text-[#FFE600] py-2.5 px-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono font-black text-xs uppercase overflow-hidden">
          {techBadges.map((badge) => (
            <span
              key={badge.name}
              className={`px-2.5 py-1 ${badge.bg} text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg`}
            >
              #{badge.name}
            </span>
          ))}
        </section>

        {/* ════════════════════════════════════════
            3. LINK CARDS (NEOBRUTALISM CARDS)
        ════════════════════════════════════════ */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white rounded">EXPLORE</span>
              <span>CURATED LINKS</span>
            </h2>
            <span className="font-mono text-xs font-bold text-neutral-600">({links.length} ITEMS)</span>
          </div>

          <div className="space-y-3">
            {links.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.url.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer ${item.bgColor}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                    <LinkIcon type={item.icon} />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base sm:text-lg text-black leading-tight">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-black text-white font-mono font-black text-[10px] uppercase rounded border border-black shadow-[1px_1px_0px_0px_#fff]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm font-bold text-neutral-800 truncate mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arrow Action */}
                <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0 ml-2 group-hover:bg-[#FFE600] group-hover:text-black transition-colors border-2 border-black">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={3} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            4. SKILLS & PROFICIENCY (COLLAPSIBLE)
        ════════════════════════════════════════ */}
        <section className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="w-full flex items-center justify-between p-5 bg-[#FFE600] border-b-2 border-black font-black text-base uppercase cursor-pointer hover:bg-yellow-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-black" strokeWidth={3} />
              <span>SKILL PROFICIENCY MATRIX</span>
            </div>
            {showSkills ? <ChevronUp className="w-5 h-5 text-black" strokeWidth={3} /> : <ChevronDown className="w-5 h-5 text-black" strokeWidth={3} />}
          </button>

          {showSkills && (
            <div className="p-6 space-y-4 bg-white">
              {skills.map((skill, i) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between items-center font-black text-xs uppercase">
                    <span>{skill.name}</span>
                    <span className="px-2 py-0.5 bg-black text-white font-mono rounded">{skill.level}%</span>
                  </div>
                  {/* Gauge Bar */}
                  <div className="h-4 bg-[#FAF7EE] border-2 border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                    <div
                      className={`h-full border-r-2 border-black ${skill.color} transition-all duration-700 ease-out`}
                      style={{
                        width: `${animatedLevels[i]}%`,
                        transitionDelay: `${i * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════
            5. FEATURED PROJECTS (COLLAPSIBLE)
        ════════════════════════════════════════ */}
        <section className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full flex items-center justify-between p-5 bg-[#00F59B] border-b-2 border-black font-black text-base uppercase cursor-pointer hover:bg-emerald-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-black" strokeWidth={3} />
              <span>PROJECT SHOWCASE</span>
              <span className="px-2 py-0.5 bg-black text-white font-mono text-xs rounded">
                {projects.length}
              </span>
            </div>
            {showProjects ? <ChevronUp className="w-5 h-5 text-black" strokeWidth={3} /> : <ChevronDown className="w-5 h-5 text-black" strokeWidth={3} />}
          </button>

          {showProjects && (
            <div className="p-5 space-y-4 bg-[#FAF7EE]">
              {projects.map((proj) => (
                <a
                  key={proj.id}
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-5 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all rounded-xl cursor-pointer group`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-black text-black group-hover:text-indigo-600 transition-colors">
                      {proj.title}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-black text-[#FFE600] font-mono font-black text-[10px] uppercase rounded border border-black">
                      {proj.status === 'active' ? 'IN PROGRESS' : 'DONE'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed mb-3">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#FAF7EE] text-black font-bold text-[10px] border border-black rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-black text-neutral-600 border-t-2 border-black/10 pt-2.5">
                    <span className="flex items-center gap-1 font-mono">
                      <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {proj.period}
                    </span>
                    <span className="flex items-center gap-1 font-mono bg-[#FFE600] px-2 py-0.5 border border-black rounded text-black">
                      <Star className="w-3.5 h-3.5 fill-black" strokeWidth={2} />
                      {proj.stars}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════
            6. FOOTER (NEOBRUTALISM)
        ════════════════════════════════════════ */}
        <footer className="text-center py-6 space-y-2">
          <div className="inline-block px-4 py-2 bg-black text-white font-mono font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#FFE600] rotate-[-1deg]">
            © 2026 KIM SEONGYU · BUILT WITH NEXT.JS 16
          </div>
          <p className="text-xs font-black text-neutral-600">
            NEOBRUTALISM EDITION · ALL RIGHTS RESERVED
          </p>
        </footer>

      </main>

      {/* ── Toast Popup (Neobrutalism Sticker Style) ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#FFE600] text-black border-3 border-black shadow-[5px_5px_0px_0px_#000] font-black text-xs uppercase rounded-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-black" strokeWidth={2.5} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
