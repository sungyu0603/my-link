'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Eye,
  Sparkles,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Clock,
} from 'lucide-react';
import { ProfileLink } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconHelper } from '@/components/profile/IconHelper';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  MAX_TITLE,
  MAX_URL,
  MAX_SUBTITLE,
  MAX_BADGE,
  linkFormSchema,
  LinkFormValues,
  ICON_OPTIONS,
  CATEGORY_OPTIONS,
  BADGE_PRESETS,
  normalizeUrl,
  formatRelativeTime,
  formatExactDateTime,
} from '@/lib/linkValidation';

export interface LinkCardItemProps {
  link: ProfileLink;
  onLinkClick: (id: string) => void;
  onShowToast?: (message: string) => void;
  onUpdateLink?: (id: string, updated: Partial<ProfileLink>) => Promise<void> | void;
  onDeleteLink?: (id: string) => Promise<void> | void;
}

export const LinkCardItem: React.FC<LinkCardItemProps> = ({
  link,
  onLinkClick,
  onShowToast,
  onUpdateLink,
  onDeleteLink,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // React Hook Form for Inline Edit
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      title: link.title || '',
      url: link.url || '',
      subtitle: link.subtitle || '',
      category: link.category || 'general',
      iconName: link.iconName || 'globe',
      badge: link.badge || '',
      isFeatured: !!link.isFeatured,
    },
  });

  // Reset form values when link changes or editing is toggled
  useEffect(() => {
    if (isEditing) {
      reset({
        title: link.title || '',
        url: link.url || '',
        subtitle: link.subtitle || '',
        category: link.category || 'general',
        iconName: link.iconName || 'globe',
        badge: link.badge || '',
        isFeatured: !!link.isFeatured,
      });
    }
  }, [isEditing, link, reset]);

  const w = watch();

  /* ── 링크 복사 핸들러 ── */
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    toast.success(`링크 주소가 복사되었습니다: ${link.title}`);
    onShowToast?.(`링크 주소가 복사되었습니다: ${link.title}`);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── 편집 시작 핸들러 ── */
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  /* ── 편집 취소 핸들러 ── */
  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(false);
    setShowAdvanced(false);
    reset({
      title: link.title || '',
      url: link.url || '',
      subtitle: link.subtitle || '',
      category: link.category || 'general',
      iconName: link.iconName || 'globe',
      badge: link.badge || '',
      isFeatured: !!link.isFeatured,
    });
  };

  /* ── 수정 저장 제출 (Firebase 연동) ── */
  const onSaveEdit = async (data: LinkFormValues) => {
    if (!onUpdateLink) return;

    const finalUrl = normalizeUrl(data.url);
    try {
      await onUpdateLink(link.id, {
        title: data.title.trim(),
        subtitle: data.subtitle.trim() || undefined,
        url: finalUrl,
        iconName: data.iconName,
        badge: data.badge.trim() || undefined,
        isFeatured: data.isFeatured,
        category: data.category,
      });

      toast.success(`"${data.title.trim()}" 링크가 수정되었습니다.`);
      onShowToast?.(`"${data.title.trim()}" 링크가 수정되었습니다.`);
      setIsEditing(false);
      setShowAdvanced(false);
    } catch (error) {
      console.error('[LinkCardItem] 수정 실패:', error);
      toast.error('링크 수정에 실패했습니다.');
      onShowToast?.('⚠️ 링크 수정에 실패했습니다.');
    }
  };

  /* ── 삭제 확인 모달 열기 ── */
  const handleOpenDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  /* ── 삭제 확인 시 Firebase 연동 삭제 실행 ── */
  const handleConfirmDelete = async () => {
    if (!onDeleteLink) return;
    try {
      await onDeleteLink(link.id);
      toast.success(`"${link.title}" 링크가 삭제되었습니다.`);
      onShowToast?.(`"${link.title}" 링크가 삭제되었습니다.`);
    } catch (error) {
      console.error('[LinkCardItem] 삭제 실패:', error);
      toast.error('링크 삭제에 실패했습니다.');
      onShowToast?.('⚠️ 링크 삭제에 실패했습니다.');
    }
  };

  /* ── 카드 일반 클릭 (링크 열기) ── */
  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    // 인터랙티브 버튼 클릭 시 카드 네비게이션 방지
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onLinkClick(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  /* ── 배지 프리셋 토글 ── */
  const toggleBadge = (preset: string) => {
    const next = w.badge === preset ? '' : preset;
    setValue('badge', next, { shouldValidate: true });
    if (next === '대표') setValue('isFeatured', true);
  };

  /* ── 폼 필드 테두리 스타일 유틸리티 ── */
  const ring = (name: keyof LinkFormValues, validWhen?: () => boolean) => {
    if (errors[name]) {
      return 'border-[#d30005] focus-visible:border-[#d30005] focus-visible:ring-[#d30005]/20 bg-[#fff8f8]';
    }
    if (touchedFields[name] && validWhen?.()) {
      return 'border-[#007d48]/40 focus-visible:border-[#007d48] focus-visible:ring-[#007d48]/20';
    }
    return 'border-[#e5e5e5] focus-visible:border-primary focus-visible:ring-primary/20';
  };

  // Badge variant determination
  const isHotOrSale = link.badge?.includes('HOT') || link.badge?.includes('배포');
  const isFeatured = link.isFeatured || link.badge?.includes('대표');

  /* ═══════════════════════════════════════════════
   *  1. 인라인 편집 모드 UI
   * ═══════════════════════════════════════════════ */
  if (isEditing) {
    return (
      <Card className="p-4 sm:p-5 border-2 border-primary bg-white rounded-xl shadow-md transition-all duration-200">
        <form onSubmit={handleSubmit(onSaveEdit)} className="flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <h4 className="text-xs sm:text-sm font-bold text-[#111111]">
                링크 인라인 수정
              </h4>
              {link.updatedAt && (
                <span
                  className="text-[10px] text-[#707072] font-normal flex items-center gap-1 bg-[#f5f5f5] px-2 py-0.5 rounded-full"
                  title={`최종 수정 일시: ${formatExactDateTime(link.updatedAt)}`}
                >
                  <Clock className="w-2.5 h-2.5 text-[#707072]" />
                  <span>수정 {formatRelativeTime(link.updatedAt)}</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 rounded-full text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] cursor-pointer"
              title="편집 취소"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. 링크 이름 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#111111]">
                링크 이름 <span className="text-[#d30005]">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  w.title.length > MAX_TITLE ? 'text-[#d30005] font-semibold' : 'text-[#707072]'
                }`}
              >
                {w.title.length}/{MAX_TITLE}
              </span>
            </div>
            <div className="relative">
              <Input
                {...register('title')}
                placeholder="예: 나의 개발 블로그, 포트폴리오"
                autoFocus
                className={`h-9.5 pl-3.5 pr-8 text-xs sm:text-sm rounded-lg transition-colors ${ring(
                  'title',
                  () => w.title.trim().length >= 2
                )}`}
              />
              {touchedFields.title && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {errors.title ? (
                    <AlertCircle className="w-4 h-4 text-[#d30005]" />
                  ) : w.title.trim().length >= 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-[#007d48]" />
                  ) : null}
                </span>
              )}
            </div>
            {errors.title?.message && (
              <p className="flex items-center gap-1 text-[11px] text-[#d30005] font-medium pl-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 2. 링크 주소 (URL) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#111111]">
                링크 주소 (URL) <span className="text-[#d30005]">*</span>
              </label>
              <span className="text-[11px] text-[#707072]">https:// 또는 도메인</span>
            </div>
            <div className="relative">
              <Input
                {...register('url')}
                placeholder="예: velog.io/@username 또는 https://github.com"
                className={`h-9.5 pl-3.5 pr-8 text-xs sm:text-sm rounded-lg transition-colors ${ring(
                  'url',
                  () => w.url.trim().length > 0
                )}`}
              />
              {touchedFields.url && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {errors.url ? (
                    <AlertCircle className="w-4 h-4 text-[#d30005]" />
                  ) : w.url.trim().length > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-[#007d48]" />
                  ) : null}
                </span>
              )}
            </div>
            {errors.url?.message && (
              <p className="flex items-center gap-1 text-[11px] text-[#d30005] font-medium pl-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.url.message}
              </p>
            )}
          </div>

          {/* 3. 상세 옵션 토글 */}
          <button
            type="button"
            onClick={() => setShowAdvanced((p) => !p)}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#707072] hover:text-[#111111] text-xs font-medium transition-colors cursor-pointer mt-0.5"
          >
            <span>상세 옵션 (카테고리, 아이콘, 설명, 배지)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* 4. 접이식 상세 옵션 */}
          {showAdvanced && (
            <div className="flex flex-col gap-3 pt-1 animate-in fade-in duration-150">
              {/* 설명 / 부제목 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#111111]">
                    설명 / 부제목 <span className="text-[#707072] font-normal">(선택)</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      w.subtitle.length > MAX_SUBTITLE ? 'text-[#d30005]' : 'text-[#707072]'
                    }`}
                  >
                    {w.subtitle.length}/{MAX_SUBTITLE}
                  </span>
                </div>
                <Input
                  {...register('subtitle')}
                  placeholder="예: 최신 기술 아티클과 프로젝트 회고록"
                  className={`h-9 px-3 text-xs sm:text-sm rounded-lg ${
                    errors.subtitle ? 'border-[#d30005]' : 'border-[#e5e5e5]'
                  }`}
                />
                {errors.subtitle?.message && (
                  <span className="text-[11px] text-[#d30005]">{errors.subtitle.message}</span>
                )}
              </div>

              {/* 카테고리 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111111]">카테고리</label>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setValue('category', c.id, { shouldValidate: true })}
                      className={`px-2 py-1 text-xs rounded-full font-medium border cursor-pointer transition-all text-center ${
                        w.category === c.id
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-[#f5f5f5] text-[#707072] border-[#e5e5e5] hover:text-[#111111]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 아이콘 */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111111]">아이콘 선택</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ICON_OPTIONS.map((o) => {
                    const IC = o.icon;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setValue('iconName', o.id, { shouldValidate: true })}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
                          w.iconName === o.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-white text-[#707072] border-[#e5e5e5] hover:border-primary hover:text-[#111111]'
                        }`}
                      >
                        <IC className="w-3 h-3" />
                        <span>{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 배지 및 대표 강조 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#111111]">
                  배지 라벨 <span className="text-[#707072] font-normal">(선택)</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {BADGE_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleBadge(p)}
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border cursor-pointer transition-all ${
                        w.badge === p
                          ? 'bg-[#d30005] text-white border-[#d30005]'
                          : 'bg-[#f5f5f5] text-[#707072] border-[#e5e5e5] hover:border-[#707072]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {w.badge && (
                    <button
                      type="button"
                      onClick={() => setValue('badge', '', { shouldValidate: true })}
                      className="text-[11px] text-[#707072] hover:text-[#111111] underline ml-1 cursor-pointer"
                    >
                      초기화
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="rounded w-3.5 h-3.5 cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-medium text-[#111111] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    대표 링크로 강조
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons: [취소] [수정 완료] */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e5e5]">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancelEdit}
              className="h-9 px-4 rounded-full border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] text-xs font-semibold text-[#707072] hover:text-[#111111] cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>수정 완료</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  /* ═══════════════════════════════════════════════
   *  2. 기본 카드 뷰 UI (항상 버튼 표시)
   * ═══════════════════════════════════════════════ */
  return (
    <>
      <Card
        onClick={handleClick}
        className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border cursor-pointer transition-all duration-200 select-none bg-white hover:bg-[#fafafa] active:scale-[0.99] active:opacity-95 gap-3 ${
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
        <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pr-1">
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

            {/* 플랫폼명/제목 · 조회수 (작은 회색 텍스트, 텍스트 없이 아이콘과 숫자만 표시) */}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#707072] flex-wrap">
              <span className="font-medium">{link.title}</span>
              <span className="text-[#cacacb]">·</span>
              <span className="inline-flex items-center gap-1 font-mono text-[#707072]" title="조회수">
                <Eye className="w-3.5 h-3.5 text-[#707072]" />
                <span>{(link.clickCount ?? link.clicks ?? 0).toLocaleString()}</span>
              </span>
              <span className="text-[#cacacb]">·</span>
              <span className="capitalize text-[#9e9ea0]">
                {link.category === 'general'
                  ? '포트폴리오'
                  : link.category === 'content'
                  ? '콘텐츠'
                  : link.category === 'project'
                  ? '프로젝트'
                  : '연락처'}
              </span>
              {link.updatedAt && (
                <>
                  <span className="text-[#cacacb]">·</span>
                  <span
                    className="inline-flex items-center gap-1 text-[#707072] hover:text-[#111111] transition-colors"
                    title={`최종 수정 일시: ${formatExactDateTime(link.updatedAt)}`}
                  >
                    <Clock className="w-3 h-3 text-[#707072]" />
                    <span>수정 {formatRelativeTime(link.updatedAt)}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Action Buttons: ALWAYS VISIBLE (수정, 삭제, 복사, 새창) ── */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0] justify-end flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 수정 버튼 */}
          {onUpdateLink && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border-[#e5e5e5] bg-[#f9f9f9] hover:bg-[#efefef] text-[#111111] text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="링크 수정"
              aria-label="링크 수정"
            >
              <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#111111]" />
              <span>수정</span>
            </Button>
          )}

          {/* 삭제 버튼 */}
          {onDeleteLink && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenDeleteModal}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border-[#ffd5d5] bg-[#fff5f5] hover:bg-[#ffe5e5] text-[#d30005] hover:text-[#b00004] text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="링크 삭제"
              aria-label="링크 삭제"
            >
              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d30005]" />
              <span>삭제</span>
            </Button>
          )}

          {/* URL 복사 버튼 */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            title="URL 복사"
            aria-label="URL 복사"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#007d48]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>

          {/* 새 탭에서 열기 버튼 */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onLinkClick(link.id);
              window.open(link.url, '_blank', 'noopener,noreferrer');
            }}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            title="새 탭에서 열기"
            aria-label="새 탭에서 열기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>

      {/* ── 삭제 확인 모달 ── */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        linkTitle={link.title}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
