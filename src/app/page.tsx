'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Globe,
  BookOpen,
  Mail,
  Coffee,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: 'github' | 'blog' | 'email' | 'portfolio' | 'instagram' | 'coffee';
  badge?: string;
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleShare = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sunkyu.dev';
    if (navigator.share) {
      try {
        await navigator.share({
          title: '김선규 프로필',
          text: '안녕하세요! 바이브 코딩을 배우고 있는 한양대생 김선규입니다.',
          url: currentUrl,
        });
        return;
      } catch {
        // Fallback to copy if cancelled
      }
    }
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('프로필 주소가 복사되었습니다! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const links: LinkItem[] = [
    {
      id: 'github',
      title: 'GitHub',
      subtitle: '진행 중인 토이 프로젝트와 코드 저장소',
      url: 'https://github.com',
      icon: 'github',
      badge: 'Code',
    },
    {
      id: 'blog',
      title: '기술 블로그',
      subtitle: '배운 내용과 바이브 코딩 개발 일지',
      url: 'https://velog.io',
      icon: 'blog',
      badge: 'Blog',
    },
    {
      id: 'portfolio',
      title: '작업물 & 포트폴리오',
      subtitle: '만들어본 웹 서비스와 프로젝트 모음',
      url: 'https://github.com',
      icon: 'portfolio',
    },
    {
      id: 'instagram',
      title: 'Instagram',
      subtitle: '일상과 캠퍼스 라이프',
      url: 'https://instagram.com',
      icon: 'instagram',
    },
    {
      id: 'email',
      title: '이메일 보내기',
      subtitle: '프로젝트 협업 & 커피챗 언제든 환영합니다',
      url: 'mailto:sunkyu@hanyang.ac.kr',
      icon: 'email',
    },
    {
      id: 'coffee',
      title: '커피 한 잔 후원하기',
      subtitle: '공부와 코딩에 큰 응원이 됩니다 ☕',
      url: 'https://buymeacoffee.com',
      icon: 'coffee',
    },
  ];

  const renderIcon = (type: LinkItem['icon']) => {
    const className = 'w-5 h-5';
    switch (type) {
      case 'github':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case 'blog':
        return <BookOpen className={className} />;
      case 'portfolio':
        return <Globe className={className} />;
      case 'email':
        return <Mail className={className} />;
      case 'coffee':
        return <Coffee className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col items-center justify-between px-4 py-12 sm:py-16 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Centered Content */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center text-center z-10">
        {/* Profile Avatar */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-sky-400 to-indigo-600 shadow-xl shadow-indigo-950/50">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-[#0c1017]">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="김선규"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
          </div>
          {/* Active Status Dot */}
          <span
            className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0c1017] rounded-full shadow-md"
            title="온라인"
          />
        </div>

        {/* Name & Badges */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          김선규
        </h1>

        {/* Tag Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            한양대학교
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-950/70 text-sky-300 border border-sky-800/40">
            <Sparkles className="w-3 h-3 text-sky-400" />
            바이브 코딩
          </span>
        </div>

        {/* Bio (Exact user request) */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
          안녕하세요! 바이브 코딩을 배우고 있는 한양대생입니다.
        </p>

        {/* Quick Share Button */}
        <div className="mb-8">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white border border-white/10 transition-all duration-200 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>주소 복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>프로필 공유하기</span>
              </>
            )}
          </button>
        </div>

        {/* Link Cards List (Clean, Centered, Card style) */}
        <div className="w-full space-y-3">
          {links.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-850 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-indigo-950/30"
            >
              <div className="flex items-center gap-3.5 text-left min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/20 transition-all flex-shrink-0">
                  {renderIcon(item.icon)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 pl-2">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Centered Minimal Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 space-y-1.5 z-10">
        <p>© 2026 김선규 · All rights reserved.</p>
        <p className="text-[11px] text-slate-400">
          Powered by <span className="text-indigo-400">MyLink</span>
        </p>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white border border-white/15 shadow-2xl backdrop-blur-md text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
