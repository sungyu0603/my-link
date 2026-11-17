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
 * - 순수 Tailwind CSS 유틸리티 클래스 적용 (모듈 CSS 배제)
 */
export const StatsSummary: React.FC<StatsSummaryProps> = ({ links, className = '' }) => {
  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + item.clicks, 0);
  }, [links]);

  const featuredCount = useMemo(() => {
    return links.filter((item) => item.isFeatured).length;
  }, [links]);

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-3 text-center shadow-none">
        <span className="block text-[11px] font-medium text-[#707072]">
          전체 링크
        </span>
        <span className="text-base sm:text-lg font-bold text-[#111111]">
          {links.length}개
        </span>
      </Card>

      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-3 text-center shadow-none">
        <span className="block text-[11px] font-medium text-[#707072]">
          대표 링크
        </span>
        <span className="text-base sm:text-lg font-bold text-[#111111]">
          {featuredCount}개
        </span>
      </Card>

      <Card className="bg-white border border-[#e5e5e5] rounded-xl p-3 text-center shadow-none">
        <span className="block text-[11px] font-medium text-[#707072]">
          누적 방문 수
        </span>
        <span className="text-base sm:text-lg font-bold text-[#111111]">
          {totalClicks.toLocaleString()}회
        </span>
      </Card>
    </div>
  );
};
