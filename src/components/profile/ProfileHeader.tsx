'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  MapPin,
  Share2,
  Sparkles,
  Heart,
  Edit3,
  QrCode,
  Briefcase,
} from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { ThemeStyles } from './ThemeConfig';
import { IconHelper } from './IconHelper';

interface ProfileHeaderProps {
  profile: UserProfile;
  themeStyles: ThemeStyles;
  onOpenShare: () => void;
  onOpenEdit: () => void;
  onOpenQr: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  themeStyles,
  onOpenShare,
  onOpenEdit,
  onOpenQr,
}) => {
  const [likes, setLikes] = useState(128);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartFloats, setShowHeartFloats] = useState<number[]>([]);

  const handleLike = () => {
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
    const newId = Date.now();
    setShowHeartFloats((prev) => [...prev, newId]);
    setTimeout(() => {
      setShowHeartFloats((prev) => prev.filter((id) => id !== newId));
    }, 1000);
  };

  return (
    <header className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-300">
      {/* Top Banner Gradient */}
      <div className={`h-36 sm:h-44 w-full bg-gradient-to-r ${profile.bannerGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-black/20 blur-xl" />

        {/* Top Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={onOpenQr}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition-all active:scale-95 shadow-lg border border-white/10"
            title="QR 코드 보기"
            aria-label="QR 코드 보기"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenShare}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition-all active:scale-95 shadow-lg border border-white/10"
            title="프로필 공유하기"
            aria-label="프로필 공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition-all active:scale-95 shadow-lg text-xs font-medium border border-white/10"
            title="프로필 수정"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">편집</span>
          </button>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className={`relative px-6 pb-8 pt-0 ${themeStyles.cardBg} backdrop-blur-xl`}>
        {/* Avatar Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
          <div className="relative group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white/20">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="128px"
                  priority
                />
              </div>
            </div>

            {/* Online / Available status ring badge */}
            {profile.isAvailableForHire && (
              <span
                className="absolute bottom-1 right-1 flex items-center justify-center p-1.5 bg-emerald-500 border-2 border-slate-900 rounded-full text-white shadow-md"
                title="외주 및 채용 협업 가능"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              </span>
            )}
          </div>

          {/* Quick Cheer / Like Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border active:scale-95 ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/20'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
              />
              <span>응원하기 {likes}</span>

              {/* Floating Hearts */}
              {showHeartFloats.map((id) => (
                <span
                  key={id}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-rose-500 animate-bounce text-sm pointer-events-none"
                >
                  ❤️ +1
                </span>
              ))}
            </button>
          </div>
        </div>

        {/* User Identity Info */}
        <div className="text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeStyles.textPrimary}`}>
                {profile.name}
              </h1>
              <span title="인증된 프로필">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              </span>
            </div>
            <span className="text-sm font-medium text-slate-400">
              @{profile.handle}
            </span>
            {profile.isAvailableForHire && (
              <span className="inline-flex items-center gap-1 mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Briefcase className="w-3 h-3" />
                협업 가능
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base font-medium text-indigo-400">
            {profile.title}
          </p>

          <p className={`text-sm sm:text-base leading-relaxed ${themeStyles.textSecondary} max-w-2xl`}>
            {profile.bio}
          </p>

          {/* Details & Location Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.location}</span>
            </div>
            {profile.statusMessage && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.statusMessage}</span>
              </div>
            )}
          </div>

          {/* Social Links Row */}
          <div className="pt-4 flex items-center justify-center sm:justify-start flex-wrap gap-2.5">
            {profile.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 hover:border-white/20 transition-all duration-200 active:scale-95 shadow-sm hover:scale-105"
                title={social.label}
                aria-label={social.label}
              >
                <IconHelper name={social.platform} className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Statistics Bar */}
          <div className="pt-5 mt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div className="py-2 px-3 rounded-2xl bg-white/[0.03]">
              <span className={`block text-lg font-bold ${themeStyles.textPrimary}`}>
                {profile.links.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">등록된 링크</span>
            </div>
            <div className="py-2 px-3 rounded-2xl bg-white/[0.03]">
              <span className={`block text-lg font-bold ${themeStyles.textPrimary}`}>
                {profile.projects.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">프로젝트</span>
            </div>
            <div className="py-2 px-3 rounded-2xl bg-white/[0.03]">
              <span className={`block text-lg font-bold ${themeStyles.textPrimary}`}>
                {profile.links.reduce((acc, curr) => acc + curr.clicks, 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">누적 클릭 수</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
