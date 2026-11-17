'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, TrendingUp, Sparkles, Trash2 } from 'lucide-react';
import { ProfileLink } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconHelper } from '@/components/profile/IconHelper';

interface LinkCardItemProps {
  link: ProfileLink;
  onLinkClick: (id: string) => void;
  onShowToast: (message: string) => void;
  onDeleteLink?: (id: string) => void;
}

export const LinkCardItem: React.FC<LinkCardItemProps> = ({
  link,
  onLinkClick,
  onShowToast,
  onDeleteLink,
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteLink) {
      onDeleteLink(link.id);
      onShowToast(`"${link.title}" 링크가 삭제되었습니다.`);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // If clicking on an inner interactive button, don't trigger link navigation
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onLinkClick(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Badge variant determination based on PRD & Nike token rules
  const isHotOrSale = link.badge?.includes('HOT') || link.badge?.includes('배포');
  const isFeatured = link.isFeatured || link.badge?.includes('대표');

  return (
    <Card
      onClick={handleClick}
      className={`group relative flex flex-row items-center justify-between p-4 sm:p-5 border cursor-pointer transition-all duration-200 select-none bg-white hover:bg-[#fafafa] active:scale-[0.985] active:opacity-90 ${
        isFeatured
          ? 'border-primary shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
          : 'border-[#e5e5e5] hover:border-primary'
      } rounded-xl`}
    >
      {/* Featured Indicator Pill */}
      {link.badge && (
        <div className="absolute -top-2.5 right-4 sm:right-6 z-10">
          <Badge
            variant={isFeatured ? 'default' : isHotOrSale ? 'destructive' : 'secondary'}
            className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs"
          >
            {isFeatured && <Sparkles className="w-3 h-3 mr-1 inline" />}
            {link.badge}
          </Badge>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pr-3">
        {/* Left Icon Box */}
        <div
          className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isFeatured
              ? 'bg-primary text-primary-foreground'
              : 'bg-[#f5f5f5] text-[#111111] group-hover:bg-primary group-hover:text-primary-foreground'
          }`}
        >
          <IconHelper name={link.iconName} className="w-5 h-5" />
        </div>

        {/* Text Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-[#111111] truncate group-hover:underline decoration-1 underline-offset-4">
              {link.title}
            </h3>
          </div>

          {link.subtitle && (
            <p className="text-xs sm:text-[13px] text-[#707072] truncate mt-0.5 font-normal">
              {link.subtitle}
            </p>
          )}

          {/* Micro Telemetry / Clicks Count */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#9e9ea0]">
            <TrendingUp className="w-3 h-3 text-[#707072]" />
            <span className="font-medium text-[#707072]">
              {link.clicks.toLocaleString()}회 방문
            </span>
            <span className="text-[#cacacb]">·</span>
            <span className="capitalize text-[#9e9ea0]">
              {link.category === 'general' ? '포트폴리오' : link.category === 'content' ? '콘텐츠' : link.category === 'project' ? '프로젝트' : '연락처'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Copy & External Arrow & Delete) */}
      <div className="flex items-center gap-1 flex-shrink-0 pl-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] transition-colors"
          title="URL 복사"
          aria-label="URL 복사"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#007d48]" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>

        {onDeleteLink && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            className="rounded-full text-[#707072] hover:text-[#d30005] hover:bg-[#d30005]/10 transition-colors"
            title="링크 삭제"
            aria-label="링크 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-[#707072] group-hover:text-[#111111] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          title="새 탭에서 열기"
          aria-label="새 탭에서 열기"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
