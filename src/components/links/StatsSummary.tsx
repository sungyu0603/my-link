'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ProfileLink } from '@/types/profile';

interface StatsSummaryProps {
  links: ProfileLink[];
  className?: string;
}

/**
 * shadcn/ui Card 기반의 통계 요약 재사용 컴포넌트
 * - 순수 Tailwind CSS 유틸리티 클래스 적용 (모바일 반응형 최적화)
 */
export const StatsSummary: React.FC<StatsSummaryProps> = ({ links, className = '' }) => {
  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + item.clicks, 0);
  }, [links]);

  const featuredCount = useMemo(() => {
    return links.filter((item) => item.isFeatured).length;
  }, [links]);

  return (
    <div className={`grid grid-cols-3 gap-1.5 sm:gap-2.5 ${className}`}>
      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-2 sm:p-3 text-center shadow-none">
        <span className="block text-[10px] sm:text-[11px] font-medium text-[#707072] mb-0.5 truncate">
          전체 링크
        </span>
        <span className="text-sm sm:text-base md:text-lg font-bold text-[#111111] truncate block">
          {links.length}개
        </span>
      </Card>

      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-2 sm:p-3 text-center shadow-none">
        <span className="block text-[10px] sm:text-[11px] font-medium text-[#707072] mb-0.5 truncate">
          대표 링크
        </span>
        <span className="text-sm sm:text-base md:text-lg font-bold text-[#111111] truncate block">
          {featuredCount}개
        </span>
      </Card>

      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-2 sm:p-3 text-center shadow-none">
        <span className="block text-[10px] sm:text-[11px] font-medium text-[#707072] mb-0.5 truncate">
          누적 방문 수
        </span>
        <span className="text-sm sm:text-base md:text-lg font-bold text-[#111111] truncate block">
          {totalClicks.toLocaleString()}회
        </span>
      </Card>
    </div>
  );
};
