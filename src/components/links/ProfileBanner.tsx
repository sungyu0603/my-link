'use client';

import React, { useState } from 'react';
import { Share2, Check, MapPin, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconHelper } from '@/components/profile/IconHelper';

interface ProfileBannerProps {
  profile: UserProfile;
  onShowToast: (message: string) => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  profile,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://sunkyu.dev';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} | MyLink`,
          text: profile.bio,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    onShowToast('프로필 링크가 클립보드에 복사되었습니다.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center text-center pt-8 pb-6">
      {/* Avatar Container with Subtle Hairline Border */}
      <div className="relative mb-4 group">
        <Avatar className="size-24 sm:size-28 border-2 border-[#111111] p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <AvatarImage
            src={profile.avatarUrl}
            alt={profile.name}
            className="rounded-full object-cover"
          />
          <AvatarFallback className="bg-[#f5f5f5] text-[#111111] font-bold text-xl">
            {profile.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Available for Hire Indicator Dot */}
        {profile.isAvailableForHire && (
          <span
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#007d48] border-2 border-white"
            title="Available for Hire"
          />
        )}
      </div>

      {/* Name & Handle */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
          {profile.name}
        </h1>
        <span className="text-sm font-medium text-[#707072]">
          @{profile.handle}
        </span>
      </div>

      {/* Title / Role */}
      <p className="text-sm font-semibold text-[#111111] mb-2">
        {profile.title}
      </p>

      {/* Bio Description */}
      <p className="text-xs sm:text-sm text-[#707072] max-w-md mx-auto leading-relaxed mb-4 px-2">
        {profile.bio}
      </p>

      {/* Status Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        {profile.isAvailableForHire && (
          <Badge
            variant="outline"
            className="rounded-full border-[#007d48]/30 bg-[#007d48]/5 text-[#007d48] text-[11px] font-medium px-3 py-1 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#007d48] animate-pulse" />
            Available for Hire
          </Badge>
        )}

        {profile.statusMessage && (
          <Badge
            variant="secondary"
            className="rounded-full bg-[#f5f5f5] text-[#111111] text-[11px] font-medium px-3 py-1 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#111111]" />
            {profile.statusMessage}
          </Badge>
        )}

        <Badge
          variant="outline"
          className="rounded-full border-[#e5e5e5] text-[#707072] text-[11px] font-medium px-2.5 py-1 flex items-center gap-1"
        >
          <MapPin className="w-3 h-3 text-[#707072]" />
          {profile.location}
        </Badge>
      </div>

      {/* Social Links Row */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {profile.socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.label}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-[#e5e5e5] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-[#111111] size-9"
              aria-label={social.label}
            >
              <IconHelper name={social.platform} className="w-4 h-4" />
            </Button>
          </a>
        ))}

        {/* Share Profile Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="rounded-full border-[#e5e5e5] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-[#111111] size-9"
          title="프로필 공유하기"
          aria-label="프로필 공유하기"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#007d48]" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
