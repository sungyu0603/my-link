'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { EditorialLinkItem } from '@/data/dummyLinks';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface EditorialGridProps {
  items: EditorialLinkItem[];
  className?: string;
}

/**
 * shadcn/ui Badge 및 Card 기반의 Nike 에디토리얼 그리드 재사용 컴포넌트
 * - 순수 Tailwind CSS 유틸리티 클래스 적용 (모듈 CSS 배제)
 */
export const EditorialGrid: React.FC<EditorialGridProps> = ({ items, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${className}`}>
      {items.map((item) => (
        <Card
          key={item.id}
          className="group block bg-white border border-[#e5e5e5] hover:border-[#111111] rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.985] shadow-none p-0 cursor-pointer"
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {/* 1:1 Aspect Editorial Photography */}
            <div className="relative aspect-square w-full bg-[#f5f5f5] overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              {item.badge && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <Badge
                    variant={item.isSale ? 'destructive' : 'default'}
                    className="rounded-full text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase"
                  >
                    {item.badge}
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-xs rounded-full p-1.5 text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Editorial Metadata */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#707072] uppercase tracking-wider">
                  {item.tag}
                </span>
                {item.priceNote && (
                  <span className="text-[11px] font-semibold text-[#111111]">
                    {item.priceNote}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[#111111] truncate group-hover:underline">
                {item.name}
              </h4>
              <p className="text-xs text-[#707072] truncate mt-0.5">
                {item.category}
              </p>

              {/* Swatches dots (Pure Tailwind CSS color preview) */}
              {item.swatches && item.swatches.length > 0 && (
                <div className="flex items-center gap-1 mt-2.5">
                  {item.swatches.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          </a>
        </Card>
      ))}
    </div>
  );
};
