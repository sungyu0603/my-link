'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { ProfileLink } from '@/types/profile';
import { LinkCardItem } from './LinkCardItem';
import { AddLinkDialog } from './AddLinkDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type CategoryFilter = 'ALL' | 'general' | 'content' | 'project' | 'contact';

interface LinkListProps {
  links: ProfileLink[];
  onLinkClick: (id: string) => void;
  onShowToast?: (message: string) => void;
  onAddLink?: (link: Omit<ProfileLink, 'id' | 'clicks'>) => Promise<void> | void;
  onUpdateLink?: (id: string, updated: Partial<ProfileLink>) => Promise<void> | void;
  onDeleteLink?: (id: string) => Promise<void> | void;
  enableSearch?: boolean;
  enableFilter?: boolean;
  className?: string;
}

/**
 * shadcn/ui 기반의 링크 목록 & 탐색 재사용 컴포넌트
 * - 순수 Tailwind CSS 유틸리티 클래스 적용 (모바일 반응형 최적화)
 * - 검색(Input), 카테고리 필터링(Button), 링크 카드 렌더링(LinkCardItem) 캡슐화
 */
export const LinkList: React.FC<LinkListProps> = ({
  links,
  onLinkClick,
  onShowToast,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  enableSearch = true,
  enableFilter = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');

  // Filter links based on category & search term
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesCategory =
        selectedCategory === 'ALL' || link.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.subtitle && link.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (link.badge && link.badge.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [links, selectedCategory, searchQuery]);

  return (
    <div className={`w-full ${className}`}>
      {/* ── Search Input (shadcn Input + Lucide Icon) ── */}
      {enableSearch && (
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707072]" />
          <Input
            type="text"
            placeholder="링크 이름, 설명, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-4 h-10 text-xs sm:text-sm bg-white border-[#e5e5e5] focus-visible:border-[#111111] rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs text-[#707072] hover:text-[#111111] bg-[#f5f5f5] rounded-full px-2 py-0.5 transition-colors cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      )}

      {/* ── Category Pill Filter Tabs (가로 스크롤 터치 친화적 지원) ── */}
      {enableFilter && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3.5 scrollbar-none touch-pan-x flex-nowrap -mx-1 px-1">
          <Button
            type="button"
            variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('ALL')}
            className={`rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 h-8 px-3 ${
              selectedCategory === 'ALL'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-[#e5e5e5] text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]'
            }`}
          >
            전체 ({links.length})
          </Button>

          <Button
            type="button"
            variant={selectedCategory === 'general' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('general')}
            className={`rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 h-8 px-3 ${
              selectedCategory === 'general'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-[#e5e5e5] text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]'
            }`}
          >
            포트폴리오
          </Button>

          <Button
            type="button"
            variant={selectedCategory === 'content' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('content')}
            className={`rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 h-8 px-3 ${
              selectedCategory === 'content'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-[#e5e5e5] text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]'
            }`}
          >
            콘텐츠 & 아티클
          </Button>

          <Button
            type="button"
            variant={selectedCategory === 'project' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('project')}
            className={`rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 h-8 px-3 ${
              selectedCategory === 'project'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-[#e5e5e5] text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]'
            }`}
          >
            오픈소스
          </Button>

          <Button
            type="button"
            variant={selectedCategory === 'contact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('contact')}
            className={`rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 h-8 px-3 ${
              selectedCategory === 'contact'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-[#e5e5e5] text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5]'
            }`}
          >
            네트워킹 & 연락처
          </Button>
        </div>
      )}

      {/* ── Link Cards Rendering ── */}
      <div className="flex flex-col gap-2.5">
        {filteredLinks.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-[#e5e5e5] rounded-xl shadow-none">
            <p className="text-sm text-[#707072] mb-3">
              {links.length === 0
                ? '등록된 링크가 없습니다. 새 링크를 추가해보세요!'
                : '검색 조건에 일치하는 링크가 없습니다.'}
            </p>
            {links.length === 0 && onAddLink ? (
              <AddLinkDialog
                onAddLink={onAddLink}
                onShowToast={onShowToast}
                trigger={
                  <Button className="rounded-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 cursor-pointer">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    첫 링크 추가하기
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="rounded-full text-xs cursor-pointer"
              >
                필터 초기화
              </Button>
            )}
          </Card>
        ) : (
          filteredLinks.map((link) => (
            <LinkCardItem
              key={link.id}
              link={link}
              onLinkClick={onLinkClick}
              onShowToast={onShowToast}
              onUpdateLink={onUpdateLink}
              onDeleteLink={onDeleteLink}
            />
          ))
        )}
      </div>
    </div>
  );
};
