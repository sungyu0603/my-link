'use client';

import React from 'react';
import { ExternalLink, Star, Calendar } from 'lucide-react';
import { ProjectItem } from '@/types/profile';
import { ThemeStyles } from './ThemeConfig';
import { IconHelper } from './IconHelper';

interface ProjectCardProps {
  project: ProjectItem;
  themeStyles: ThemeStyles;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, themeStyles }) => {
  const getStatusBadge = () => {
    switch (project.status) {
      case 'maintained':
        return {
          label: '운영 중',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'in-progress':
        return {
          label: '개발 중',
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'completed':
      default:
        return {
          label: '완료됨',
          className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${themeStyles.cardBg} ${themeStyles.cardBorder} hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5`}
    >
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className={`text-base sm:text-lg font-bold ${themeStyles.textPrimary}`}>
            {project.title}
          </h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Description */}
        <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${themeStyles.textMuted}`}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.period}</span>
          </div>
          {project.stars && (
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{project.stars}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              title="GitHub 저장소"
            >
              <IconHelper name="github" className="w-4 h-4" />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
              title="데모 사이트 보기"
            >
              <span>데모</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
