'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, TrendingUp } from 'lucide-react';
import { ProfileLink } from '@/types/profile';
import { ThemeStyles } from './ThemeConfig';
import { IconHelper } from './IconHelper';

interface LinkCardProps {
  link: ProfileLink;
  themeStyles: ThemeStyles;
  onLinkClick: (id: string) => void;
  onShowToast: (message: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  themeStyles,
  onLinkClick,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    onShowToast(`링크 주소가 복사되었습니다: ${link.title}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    onLinkClick(link.id);
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
        themeStyles.cardBg
      } ${themeStyles.cardBorder} ${themeStyles.cardHover} ${
        link.isFeatured ? 'ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/5' : ''
      }`}
    >
      {/* Featured Star/Ribbon Pill */}
      {link.badge && (
        <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm uppercase tracking-wider">
          {link.badge}
        </span>
      )}

      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pr-2">
        {/* Icon Box */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-105 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-200">
          <IconHelper name={link.iconName} className="w-5 h-5 text-indigo-400" />
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-semibold truncate group-hover:text-indigo-400 transition-colors ${themeStyles.textPrimary}`}>
              {link.title}
            </h2>
          </div>
          {link.subtitle && (
            <p className={`text-xs sm:text-sm truncate mt-0.5 ${themeStyles.textMuted}`}>
              {link.subtitle}
            </p>
          )}

          {/* Click counter micro info */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
            <TrendingUp className="w-3 h-3 text-slate-500" />
            <span>{link.clicks.toLocaleString()}회 방문</span>
          </div>
        </div>
      </div>

      {/* Action Icons (Copy & External Arrow) */}
      <div className="flex items-center gap-1 flex-shrink-0 pl-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="URL 복사"
          aria-label="URL 복사"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        <div className="p-2 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};
