'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Pin } from 'lucide-react';
import { GuestbookEntry } from '@/types/profile';
import { ThemeStyles } from './ThemeConfig';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  themeStyles: ThemeStyles;
  onAddEntry: (entry: Omit<GuestbookEntry, 'id' | 'createdAt'>) => void;
  onShowToast: (message: string) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  themeStyles,
  onAddEntry,
  onShowToast,
}) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      onShowToast('이름과 메시지를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    onAddEntry({
      author: author.trim(),
      content: content.trim(),
      avatarSeed: author.trim().slice(0, 2),
    });

    setAuthor('');
    setContent('');
    setIsSubmitting(false);
    onShowToast('방명록이 성공적으로 등록되었습니다! ✨');
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-5 sm:p-6 rounded-2xl border ${themeStyles.cardBg} ${themeStyles.cardBorder} space-y-4`}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className={`text-base font-bold ${themeStyles.textPrimary}`}>
            김선규 님에게 방명록 남기기
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <input
              type="text"
              placeholder="작성자 이름 / 닉네임"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="따뜻한 응원이나 인사의 한마디를 남겨보세요!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white ${themeStyles.accentBg} transition-all duration-200 active:scale-95 shadow-md`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>등록하기</span>
          </button>
        </div>
      </form>

      {/* Guestbook List */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${themeStyles.cardBg} ${themeStyles.cardBorder} hover:border-indigo-500/30`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                {/* Seed Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {entry.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold ${themeStyles.textPrimary}`}>
                      {entry.author}
                    </span>
                    {entry.isPinned && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Pin className="w-2.5 h-2.5" />
                        고정됨
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{entry.createdAt}</span>
                </div>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed pl-10 ${themeStyles.textSecondary}`}>
              {entry.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
