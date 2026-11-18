'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  MousePointerClick,
  Link2,
  Sparkles,
  ArrowLeft,
  Loader2,
  BarChart3,
  ExternalLink,
  Eye,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconHelper } from '@/components/profile/IconHelper';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { useLinksQuery } from '@/hooks/useLinksQuery';

const chartConfig = {
  clicks: {
    label: '클릭수',
    color: '#111111',
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const { authUser, isAuthReady, profile } = useMyLinkStore();

  // 1. 비로그인 시 홈('/')으로 리다이렉트
  useEffect(() => {
    if (isAuthReady && !authUser) {
      toast.error('로그인이 필요한 페이지입니다.');
      router.replace('/');
    }
  }, [isAuthReady, authUser, router]);

  // TanStack Query로 사용자의 최신 링크 데이터 가져오기
  const { data: queryLinks, isLoading: isLinksLoading } = useLinksQuery(authUser?.uid);
  const links = queryLinks ?? [];

  // 2. 상단 통계 수치 계산
  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + (item.clickCount ?? item.clicks ?? 0), 0);
  }, [links]);

  const avgClicks = useMemo(() => {
    if (links.length === 0) return 0;
    return Math.round(totalClicks / links.length);
  }, [links, totalClicks]);

  // 3. 하단 링크별 클릭수 (많은 순 내림차순 정렬)
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      const aCount = a.clickCount ?? a.clicks ?? 0;
      const bCount = b.clickCount ?? b.clicks ?? 0;
      if (bCount !== aCount) return bCount - aCount;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [links]);

  const topLink = sortedLinks[0] || null;

  // shadcn 차트 데이터 가공
  const chartData = useMemo(() => {
    return sortedLinks.slice(0, 10).map((item, index) => {
      const title = item.title || '이름 없음';
      return {
        name: title.length > 7 ? `${title.slice(0, 7)}..` : title,
        fullName: title,
        clicks: item.clickCount ?? item.clicks ?? 0,
        fill:
          index === 0
            ? '#111111'
            : index === 1
            ? '#2d2d30'
            : index === 2
            ? '#505052'
            : '#8c8c8e',
      };
    });
  }, [sortedLinks]);

  // 인증 확인 중 화면
  if (!isAuthReady || (isAuthReady && !authUser)) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#111111]" />
            <p className="text-xs font-medium text-[#707072]">인증 상태 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] antialiased">
      {/* 글로벌 네비게이션 헤더 */}
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* 네비게이션 바 & 페이지 타이틀 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-1.5 rounded-full text-[#707072] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#e5e5e5] transition-colors"
              title="홈으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#111111]">
                링크 클릭 통계
              </h1>
              <p className="text-xs text-[#707072]">
                내 링크트리의 방문자 반응과 클릭 데이터를 분석합니다.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-xs font-semibold px-2.5 py-1 bg-white border-[#e5e5e5] text-[#111111] shadow-none"
          >
            실시간 집계
          </Badge>
        </div>

        {/* ── 1. 상단: 총 클릭수 (모든 링크 합산) 및 핵심 지표 ── */}
        <section aria-label="핵심 통계 지표" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 카드 1: 총 클릭수 (핵심) */}
          <Card className="col-span-2 sm:col-span-2 bg-[#111111] text-white rounded-2xl p-4 sm:p-5 shadow-sm border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MousePointerClick className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/70 font-medium">총 클릭수 (모든 링크 합산)</span>
                <div className="p-1.5 rounded-lg bg-white/10">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                  {totalClicks.toLocaleString()}
                  <span className="text-sm sm:text-base font-normal text-white/70 ml-1.5">회</span>
                </div>
                <p className="text-[11px] text-white/60 mt-1">
                  등록된 모든 링크의 누적 방문자 클릭 수
                </p>
              </div>
            </div>
          </Card>

          {/* 카드 2: 전체 링크 수 */}
          <Card className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707072] mb-2">
              <span className="text-xs font-medium">전체 링크</span>
              <Link2 className="w-4 h-4 text-[#707072]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111111] font-mono">
                {links.length}
                <span className="text-xs font-normal text-[#707072] ml-1">개</span>
              </div>
              <p className="text-[10px] text-[#9e9ea0] mt-0.5">활성 관리 중</p>
            </div>
          </Card>

          {/* 카드 3: 링크당 평균 클릭수 */}
          <Card className="bg-white border border-[#e5e5e5] rounded-2xl p-4 shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707072] mb-2">
              <span className="text-xs font-medium">평균 클릭</span>
              <BarChart3 className="w-4 h-4 text-[#707072]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#111111] font-mono">
                {avgClicks.toLocaleString()}
                <span className="text-xs font-normal text-[#707072] ml-1">회</span>
              </div>
              <p className="text-[10px] text-[#9e9ea0] mt-0.5">링크 1개당 평균</p>
            </div>
          </Card>
        </section>

        {/* ── 2. 하단: shadcn 차트 컴포넌트를 사용한 링크별 클릭수 시각화 ── */}
        <section aria-label="링크별 클릭수 차트">
          <Card className="bg-white border border-[#e5e5e5] rounded-2xl shadow-none p-4 sm:p-5">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold text-[#111111]">
                    링크별 클릭수 분석
                  </CardTitle>
                  <CardDescription className="text-xs text-[#707072] mt-0.5">
                    클릭수가 많은 순서대로 최대 10개 링크를 시각화합니다.
                  </CardDescription>
                </div>
                {topLink && (
                  <Badge
                    variant="secondary"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-[#f5f5f5] text-[#111111] border border-[#e5e5e5]"
                  >
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span>최다 클릭: {topLink.title}</span>
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLinksLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#111111]" />
                  <p className="text-xs text-[#707072]">통계 데이터를 불러오는 중...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-[#707072] mb-3">등록된 링크가 없습니다.</p>
                  <Link href="/">
                    <Button size="sm" className="rounded-full text-xs">
                      첫 링크 등록하러 가기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="w-full pt-2">
                  {/* shadcn ChartContainer 컴포넌트 */}
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[220px] sm:min-h-[260px] w-full"
                  >
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
                    >
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#707072' }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        width={70}
                        tick={{ fontSize: 11, fill: '#111111', fontWeight: 600 }}
                      />
                      <ChartTooltip
                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                        content={
                          <ChartTooltipContent
                            formatter={(value, name, item) => (
                              <div className="flex items-center justify-between gap-4 w-full text-xs">
                                <span className="text-[#707072] font-medium">
                                  {item?.payload?.fullName}
                                </span>
                                <span className="font-bold font-mono text-[#111111]">
                                  {Number(value).toLocaleString()}회 클릭
                                </span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Bar
                        dataKey="clicks"
                        radius={[0, 6, 6, 0]}
                        barSize={20}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── 3. 하단: 링크별 클릭수 목록 (많은 순 정렬 상세 리스트) ── */}
        <section aria-label="링크별 상세 랭킹" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold text-[#111111] flex items-center gap-1.5">
              <span>링크별 클릭수 상세 순위</span>
              <span className="text-xs font-normal text-[#707072]">
                ({sortedLinks.length})
              </span>
            </h2>
            <span className="text-[11px] text-[#707072]">많은 순 정렬</span>
          </div>

          {sortedLinks.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-[#e5e5e5] rounded-2xl shadow-none">
              <p className="text-xs sm:text-sm text-[#707072]">
                표시할 통계 데이터가 없습니다.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {sortedLinks.map((link, idx) => {
                const count = link.clickCount ?? link.clicks ?? 0;
                const percentage =
                  totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                const isTopThree = idx < 3;

                return (
                  <div
                    key={link.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#111111] transition-all flex flex-col gap-2.5 shadow-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* 순위 + 아이콘 + 타이틀 */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* 순위 뱃지 */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-800'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-800'
                              : idx === 2
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-[#f5f5f5] text-[#707072]'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* 플랫폼 아이콘 */}
                        <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center shrink-0">
                          <IconHelper name={link.iconName} className="w-4 h-4 text-[#111111]" />
                        </div>

                        {/* 링크 정보 */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                              {link.title}
                            </h3>
                            {link.isFeatured && (
                              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#707072] truncate max-w-[200px] sm:max-w-xs font-mono mt-0.5">
                            {link.url}
                          </p>
                        </div>
                      </div>

                      {/* 클릭수 및 점유율 */}
                      <div className="flex items-center gap-3 shrink-0 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 font-bold font-mono text-sm sm:text-base text-[#111111]">
                            <Eye className="w-3.5 h-3.5 text-[#707072]" />
                            <span>{count.toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] text-[#9e9ea0]">
                            전체의 {percentage}%
                          </span>
                        </div>

                        {/* 새 탭 열기 버튼 */}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[#707072] hover:text-[#111111] hover:bg-[#f5f5f5] transition-colors"
                          title="링크 열기"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* 비율 프로그레스 바 */}
                    <div className="w-full h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTopThree ? 'bg-[#111111]' : 'bg-[#707072]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
