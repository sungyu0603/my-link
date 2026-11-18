'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Globe,
  BookOpen,
  Sparkles,
  Coffee,
  Mail,
  MessageSquare,
  Link as LinkIcon,
  Check,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import { ProfileLink } from '@/types/profile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { IconHelper } from '@/components/profile/IconHelper';

/* ─────────────────────────────────────────────
 *  Zod Schema — 모든 필드 required (input === output)
 *  RHF defaultValues 로 초기값을 주입합니다.
 * ───────────────────────────────────────────── */
const MAX_TITLE = 50;
const MAX_URL = 500;
const MAX_SUBTITLE = 100;
const MAX_BADGE = 10;

export const linkFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '링크 이름을 입력해주세요.')
    .min(2, '링크 이름은 최소 2자 이상이어야 합니다.')
    .max(MAX_TITLE, `링크 이름은 최대 ${MAX_TITLE}자 이하로 입력해주세요.`),

  url: z
    .string()
    .trim()
    .min(1, '링크 주소(URL)를 입력해주세요.')
    .max(MAX_URL, `URL은 최대 ${MAX_URL}자 이하이어야 합니다.`)
    .refine((v) => !/\s/.test(v), {
      message: 'URL에 공백(스페이스)이 포함될 수 없습니다.',
    })
    .refine(
      (v) => {
        if (v.startsWith('mailto:')) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.replace('mailto:', ''));
        }
        let n = v;
        if (!/^https?:\/\//i.test(n)) n = `https://${n}`;
        try {
          const p = new URL(n);
          if (!['http:', 'https:'].includes(p.protocol)) return false;
          const h = p.hostname;
          return h === 'localhost' || h === '127.0.0.1' ||
            (h.includes('.') && !h.startsWith('.') && !h.endsWith('.'));
        } catch {
          return false;
        }
      },
      { message: '올바른 웹 주소(예: velog.io/@user, https://example.com)를 입력해주세요.' },
    ),

  subtitle: z
    .string()
    .max(MAX_SUBTITLE, `설명은 최대 ${MAX_SUBTITLE}자 이하이어야 합니다.`),

  category: z.enum(['general', 'content', 'project', 'contact']),

  iconName: z.string(),

  badge: z
    .string()
    .max(MAX_BADGE, `배지는 최대 ${MAX_BADGE}자 이하이어야 합니다.`),

  isFeatured: z.boolean(),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

/* ── Constants ── */
interface AddLinkDialogProps {
  onAddLink: (link: Omit<ProfileLink, 'id' | 'clicks'>) => Promise<void> | void;
  onShowToast: (msg: string) => void;
  trigger?: React.ReactNode;
}

const ICON_OPTIONS = [
  { id: 'globe', label: '웹사이트', icon: Globe },
  { id: 'bookopen', label: '블로그', icon: BookOpen },
  { id: 'sparkles', label: '스파클', icon: Sparkles },
  { id: 'github', label: 'GitHub', icon: LinkIcon },
  { id: 'coffee', label: '후원', icon: Coffee },
  { id: 'mail', label: '이메일', icon: Mail },
  { id: 'messagesquare', label: '메시지', icon: MessageSquare },
  { id: 'link', label: '기본 링크', icon: LinkIcon },
] as const;

const CATEGORY_OPTIONS: { id: ProfileLink['category']; label: string }[] = [
  { id: 'general', label: '포트폴리오' },
  { id: 'content', label: '콘텐츠 & 글' },
  { id: 'project', label: '오픈소스/프로젝트' },
  { id: 'contact', label: '네트워킹 & 연락처' },
];

const BADGE_PRESETS = ['대표', 'HOT', 'NEW', '추천', 'BEST'] as const;

const FORM_DEFAULTS: LinkFormValues = {
  title: '',
  url: '',
  subtitle: '',
  category: 'general',
  iconName: 'globe',
  badge: '',
  isFeatured: false,
};

/* ═══════════════════════════════════════════════
 *  AddLinkDialog — React Hook Form + Zod
 * ═══════════════════════════════════════════════ */
export const AddLinkDialog: React.FC<AddLinkDialogProps> = ({
  onAddLink,
  onShowToast,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    mode: 'onTouched',         // blur 후부터 실시간 검증
    reValidateMode: 'onChange', // 이후 타이핑마다 재검증
    defaultValues: FORM_DEFAULTS,
  });

  /* watch for live preview & counters */
  const w = watch();

  /* ── open / close ── */
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset(FORM_DEFAULTS);
      setShowAdvanced(false);
    }
  };

  /* ── submit (Zod 검증 통과 후) ── */
  const onValid = async (data: LinkFormValues) => {
    let finalUrl = data.url.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:'))
      finalUrl = `https://${finalUrl}`;

    try {
      await onAddLink({
        title: data.title.trim(),
        subtitle: data.subtitle.trim() || undefined,
        url: finalUrl,
        iconName: data.iconName,
        badge: data.badge.trim() || undefined,
        isFeatured: data.isFeatured,
        category: data.category,
      });

      onShowToast(`"${data.title.trim()}" 링크가 저장되었습니다.`);
      setOpen(false);
      reset(FORM_DEFAULTS);
      setShowAdvanced(false);
    } catch {
      // 상위 에러 처리
    }
  };

  /* 저장 버튼은 form 외부에 있으므로 programmatic submit */
  const handleSaveClick = () => {
    handleSubmit(onValid, (errs) => {
      if (errs.title) setFocus('title');
      else if (errs.url) setFocus('url');
    })();
  };

  /* ── badge preset toggle ── */
  const toggleBadge = (preset: string) => {
    const next = w.badge === preset ? '' : preset;
    setValue('badge', next, { shouldValidate: true });
    if (next === '대표') setValue('isFeatured', true);
  };

  /* ── helper: field ring color ── */
  const ring = (
    name: keyof LinkFormValues,
    validWhen?: () => boolean,
  ) => {
    if (errors[name])
      return 'border-[#d30005] focus-visible:border-[#d30005] focus-visible:ring-[#d30005]/20 bg-[#fff8f8]';
    if (touchedFields[name] && validWhen?.())
      return 'border-[#007d48]/40 focus-visible:border-[#007d48] focus-visible:ring-[#007d48]/20';
    return 'border-[#e5e5e5] focus-visible:border-primary focus-visible:ring-primary/20';
  };

  return (
    <>
      {/* ── Trigger ── */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer inline-flex">
          {trigger}
        </div>
      ) : (
        <Button
          type="button"
          variant="default"
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-1.5 h-8 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.96] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>링크 추가</span>
        </Button>
      )}

      {/* ── Dialog ── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md p-0 flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="p-5 pb-3 border-b border-[#e5e5e5] flex-shrink-0">
            <DialogHeader>
              <DialogTitle>새 링크 추가</DialogTitle>
              <DialogDescription className="text-xs text-[#707072]">
                링크 이름과 주소를 입력 후 저장 버튼을 누르면 프로필에 추가됩니다.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Body */}
          <form
            id="add-link-form"
            onSubmit={handleSubmit(onValid)}
            className="flex-1 overflow-y-auto p-5 flex flex-col gap-4"
          >
            {/* ───── 1. 링크 이름 ───── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="f-title" className="font-bold text-[#111111]">
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
                  id="f-title"
                  {...register('title')}
                  placeholder="예: 나의 개발 블로그, 포트폴리오"
                  autoFocus
                  className={`h-10 pl-4 pr-9 text-xs sm:text-sm rounded-full transition-colors ${ring(
                    'title',
                    () => w.title.trim().length >= 2,
                  )}`}
                />
                {touchedFields.title && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {errors.title ? (
                      <AlertCircle className="w-4 h-4 text-[#d30005]" />
                    ) : w.title.trim().length >= 2 ? (
                      <CheckCircle2 className="w-4 h-4 text-[#007d48]" />
                    ) : null}
                  </span>
                )}
              </div>

              {errors.title?.message && (
                <p className="flex items-center gap-1.5 text-[11px] text-[#d30005] font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* ───── 2. URL ───── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="f-url" className="font-bold text-[#111111]">
                  링크 주소 (URL) <span className="text-[#d30005]">*</span>
                </label>
                <span className="text-[11px] text-[#707072]">https:// 또는 도메인</span>
              </div>

              <div className="relative">
                <Input
                  id="f-url"
                  {...register('url')}
                  placeholder="예: velog.io/@username 또는 https://github.com"
                  className={`h-10 pl-4 pr-9 text-xs sm:text-sm rounded-full transition-colors ${ring(
                    'url',
                    () => w.url.trim().length > 0,
                  )}`}
                />
                {touchedFields.url && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {errors.url ? (
                      <AlertCircle className="w-4 h-4 text-[#d30005]" />
                    ) : w.url.trim().length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-[#007d48]" />
                    ) : null}
                  </span>
                )}
              </div>

              {errors.url?.message && (
                <p className="flex items-center gap-1.5 text-[11px] text-[#d30005] font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.url.message}
                </p>
              )}
            </div>

            {/* ───── 3. 상세 옵션 토글 ───── */}
            <button
              type="button"
              onClick={() => setShowAdvanced((p) => !p)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#707072] hover:text-[#111111] text-xs font-medium transition-colors cursor-pointer"
            >
              <span>상세 옵션 (카테고리, 아이콘, 설명, 배지)</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* ───── 4. 접이식 상세 옵션 ───── */}
            {showAdvanced && (
              <div className="flex flex-col gap-3.5 pt-1 animate-in fade-in duration-200">
                {/* 설명 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="f-sub" className="font-semibold text-[#111111]">
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
                    id="f-sub"
                    {...register('subtitle')}
                    placeholder="예: 최신 기술 아티클과 프로젝트 회고록"
                    className={`h-9 px-3.5 text-xs sm:text-sm rounded-full ${
                      errors.subtitle ? 'border-[#d30005]' : 'border-[#e5e5e5]'
                    }`}
                  />
                  {errors.subtitle?.message && (
                    <span className="text-[11px] text-[#d30005]">{errors.subtitle.message}</span>
                  )}
                </div>

                {/* 카테고리 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#111111]">카테고리</label>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    {CATEGORY_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setValue('category', c.id, { shouldValidate: true })}
                        className={`px-2.5 py-1.5 text-xs rounded-full font-medium border cursor-pointer transition-all text-center ${
                          w.category === c.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-[#f5f5f5] text-[#707072] border-[#e5e5e5] hover:text-foreground hover:border-primary'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 아이콘 */}
                <div className="flex flex-col gap-1.5">
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
                              : 'bg-white text-[#707072] border-[#e5e5e5] hover:border-primary hover:text-foreground'
                          }`}
                        >
                          <IC className="w-3.5 h-3.5" />
                          <span>{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 배지 / 대표 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#111111]">
                      배지 라벨 <span className="text-[#707072] font-normal">(선택)</span>
                    </label>
                    {w.badge && (
                      <span className="text-[11px] text-[#707072]">
                        {w.badge.length}/{MAX_BADGE}
                      </span>
                    )}
                  </div>

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
                  {errors.badge?.message && (
                    <span className="text-[11px] text-[#d30005]">{errors.badge.message}</span>
                  )}

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

                {/* 실시간 미리보기 */}
                <div className="flex flex-col gap-1.5 pt-1 border-t border-[#e5e5e5]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#707072]">
                    미리보기
                  </span>
                  <div
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      w.isFeatured ? 'border-primary bg-white shadow-xs' : 'border-[#e5e5e5] bg-[#fafafa]'
                    }`}
                  >
                    {w.badge && (
                      <div className="absolute -top-2 right-4 z-10">
                        <Badge
                          variant={w.isFeatured ? 'default' : w.badge === 'HOT' ? 'destructive' : 'secondary'}
                          className="text-[9px] font-semibold px-2 rounded-full"
                        >
                          {w.isFeatured && <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />}
                          {w.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          w.isFeatured ? 'bg-primary text-primary-foreground' : 'bg-[#f5f5f5] text-[#111111]'
                        }`}
                      >
                        <IconHelper name={w.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#111111] truncate">
                          {w.title.trim() || '링크 이름이 여기에 표시됩니다'}
                        </h4>
                        <p className="text-[11px] text-[#707072] truncate">
                          {w.subtitle.trim() || w.url.trim() || 'URL 및 부제목 설명'}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#9e9ea0] mt-0.5">
                          <TrendingUp className="w-2.5 h-2.5 text-[#707072]" />
                          <span>0회 방문</span>
                          <span>·</span>
                          <span>{CATEGORY_OPTIONS.find((c) => c.id === w.category)?.label}</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-[#707072]" />
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Pinned Bottom — 저장 버튼 */}
          <div className="p-4 bg-[#fafafa] border-t border-[#e5e5e5] flex items-center gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 px-5 rounded-full border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] text-xs font-semibold text-[#707072] hover:text-[#111111] cursor-pointer active:scale-[0.96] transition-all"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={isSubmitting}
              onClick={handleSaveClick}
              className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.96] transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>저장</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
