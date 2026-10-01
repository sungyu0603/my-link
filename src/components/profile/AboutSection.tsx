'use client';

import React, { useState } from 'react';
import { Code2, Sparkles, Terminal, Award } from 'lucide-react';
import { SkillItem } from '@/types/profile';
import { ThemeStyles } from './ThemeConfig';

interface AboutSectionProps {
  skills: SkillItem[];
  themeStyles: ThemeStyles;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ skills, themeStyles }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'frontend', label: '프론트엔드' },
    { id: 'backend', label: '백엔드' },
    { id: 'tools', label: '도구 및 인프라' },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : activeCategory === 'tools'
      ? skills.filter((s) => s.category === 'tools' || s.category === 'devops')
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Bio / Work Philosophy Card */}
      <div className={`p-6 rounded-2xl border ${themeStyles.cardBg} ${themeStyles.cardBorder}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className={`text-base font-bold ${themeStyles.textPrimary}`}>
            개발 철학과 목표
          </h3>
        </div>
        <p className={`text-sm leading-relaxed ${themeStyles.textSecondary} mb-4`}>
          기술 그 자체보다는 사용자에게 전달되는 실질적인 가치를 최우선으로 생각합니다. 
          직관적이고 매끄러운 반응 속도, 탄탄한 웹 접근성, 그리고 팀원들과 즐겁게 소통하며 유지보수하기 쉬운 클린 코드를 지향합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-xs font-semibold text-indigo-400 mb-1">⚡ 고성능 지향</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Lighthouse 95+점 및 Web Vitals 최적화 경험
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-xs font-semibold text-purple-400 mb-1">🎨 UX 중심 설계</h4>
            <p className="text-xs text-slate-400 leading-normal">
              세밀한 마이크로 인터랙션과 직관적인 흐름
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-xs font-semibold text-emerald-400 mb-1">🤝 열린 커뮤니케이션</h4>
            <p className="text-xs text-slate-400 leading-normal">
              상호 피드백과 코드 리뷰를 통한 동반 성장
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack & Skills Card */}
      <div className={`p-6 rounded-2xl border ${themeStyles.cardBg} ${themeStyles.cardBorder}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className={`text-base font-bold ${themeStyles.textPrimary}`}>
              기술 스택 & 숙련도
            </h3>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Progress List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className={themeStyles.textPrimary}>{skill.name}</span>
                <span className="text-indigo-400 font-semibold">{skill.level}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
