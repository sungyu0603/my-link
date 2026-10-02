'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Check,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Nike Swoosh & Minimal Vector Marks
// ─────────────────────────────────────────────
function NikeSwoosh({ className = 'w-14 h-5 fill-current' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M21.707 5.293c-2.316-.708-6.196 0-9.873 2.92-3.158 2.508-6.685 6.467-8.334 8.787-.5.707-.167 1.167.583.917 1.667-.584 4.5-1.917 6.25-2.75 3.333-1.584 7.583-4.167 10.5-7.584.834-.916 1.417-1.917.874-2.29z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Design Tokens Mapping
// ─────────────────────────────────────────────
// colors: ink (#111111), canvas (#ffffff), soft-cloud (#f5f5f5), hairline (#cacacb), mute (#707072), sale (#d30005)

interface LinkCardItem {
  id: string;
  name: string;
  category: string;
  badge?: string;
  url: string;
  imageUrl: string;
  tag: string;
  priceNote?: string;
  isSale?: boolean;
  swatches: string[];
}

interface ProjectCardItem {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  metric: string;
}

export default function NikeEditorialPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CORE' | 'WRITING' | 'NETWORK'>('ALL');
  const [likes, setLikes] = useState(240);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Accordion state for PDP-style disclosures
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    spec: true,
    skills: false,
    shipping: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://sunkyu.dev';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SEONGYU KIM | SOFTWARE ENGINEER', url });
        return;
      } catch {
        /* fallback */
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('LINK COPIED TO CLIPBOARD');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes((n) => n + 1);
      setIsLiked(true);
      showToast('ADDED TO WISHLIST');
    } else {
      setLikes((n) => n - 1);
      setIsLiked(false);
    }
  };

  // ─────────────────────────────────────────────
  // Data: Curated Links (Product Card Model)
  // ─────────────────────────────────────────────
  const links: LinkCardItem[] = [
    {
      id: 'l1',
      name: 'Official Portfolio & Case Studies',
      category: "Engineer's Flagship Digital Space",
      badge: 'JUST IN',
      url: 'https://sunkyu.dev',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      tag: 'CORE',
      priceNote: 'Live V2.5',
      swatches: ['#111111', '#cacacb', '#f5f5f5'],
    },
    {
      id: 'l2',
      name: 'Technical Blog (Tech Insights)',
      category: 'Systems, Next.js Architecture & Retrospectives',
      badge: 'HIGH DEMAND',
      url: 'https://velog.io/@sunkyu',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
      tag: 'WRITING',
      priceNote: '5 New Articles',
      isSale: true,
      swatches: ['#111111', '#0a7281'],
    },
    {
      id: 'l3',
      name: 'GitHub Open Source Repositories',
      category: 'Component Libraries & Toolkits',
      badge: '1.2K STARS',
      url: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80',
      tag: 'CORE',
      priceNote: 'MIT Licensed',
      swatches: ['#111111', '#4b4b4d'],
    },
    {
      id: 'l4',
      name: 'Developer Newsletter Edition',
      category: 'Weekly Frontend Patterns & Production Notes',
      url: 'https://newsletter.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      tag: 'WRITING',
      priceNote: 'Free Subscription',
      swatches: ['#ffffff', '#cacacb'],
    },
    {
      id: 'l5',
      name: '1:1 Technical Mentoring & Coffee Chat',
      category: 'Code Architecture & Career Advisory',
      badge: 'LIMITED SLOTS',
      url: 'https://calendly.com',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      tag: 'NETWORK',
      priceNote: 'Available Weekly',
      swatches: ['#111111', '#39393b'],
    },
    {
      id: 'l6',
      name: 'Direct Project Inquiry via Email',
      category: 'sunkyu@hanyang.ac.kr',
      url: 'mailto:sunkyu@hanyang.ac.kr',
      imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=80',
      tag: 'NETWORK',
      priceNote: 'Response within 24h',
      swatches: ['#111111'],
    },
  ];

  const filteredLinks = activeFilter === 'ALL' ? links : links.filter((l) => l.tag === activeFilter);

  // ─────────────────────────────────────────────
  // Data: Featured Projects (Campaign Row)
  // ─────────────────────────────────────────────
  const projects: ProjectCardItem[] = [
    {
      id: 'p1',
      title: 'HYPERLINK PLATFORM',
      role: 'Lead Architect',
      period: '2025.10 – PRESENT',
      description: 'Ultra-lightweight creator link-in-bio & audience telemetry platform built on Next.js 16 and PostgreSQL.',
      tech: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://sunkyu.dev',
      githubUrl: 'https://github.com',
      metric: '480 STARS',
    },
    {
      id: 'p2',
      title: 'AI CODE REVIEWER ENGINE',
      role: 'Full-Stack Developer',
      period: '2025.04 – 2025.08',
      description: 'Automated pull-request analysis bot evaluating code safety, performance bottlenecks, and test coverage.',
      tech: ['Node.js', 'OpenAI API', 'GitHub Actions', 'Docker'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://sunkyu.dev',
      githubUrl: 'https://github.com',
      metric: '820 STARS',
    },
    {
      id: 'p3',
      title: 'DEVSPACE WORKSPACE',
      role: 'Frontend Engineer',
      period: '2025.01 – 2025.03',
      description: 'Productivity command-center chrome extension bringing telemetry feeds, tasks, and GitHub alerts into one tab.',
      tech: ['React 19', 'Zustand', 'Chrome API', 'Tailwind'],
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://sunkyu.dev',
      githubUrl: 'https://github.com',
      metric: '310 STARS',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] antialiased selection:bg-[#111111] selection:text-white">

      {/* ══════════════════════════════════════════════
          1. UTILITY BAR ({component.utility-bar})
          Height ~36px, Soft Cloud (#f5f5f5), caption-sm (12px)
      ══════════════════════════════════════════════ */}
      <div className="w-full bg-[#f5f5f5] text-[#111111] text-[12px] font-medium h-9 px-6 sm:px-12 flex items-center justify-between border-b border-[#e5e5e5]">
        <div className="flex items-center gap-4 text-[#707072]">
          <span>KOREA, REPUBLIC OF</span>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline text-[#111111] font-semibold">HANYANG UNIV. COMP SCI</span>
        </div>
        <div className="flex items-center gap-5 text-[#111111] font-medium">
          <a href="mailto:sunkyu@hanyang.ac.kr" className="hover:underline">Contact</a>
          <span>·</span>
          <button onClick={handleShare} className="hover:underline cursor-pointer">
            {copied ? 'Copied' : 'Share'}
          </button>
          <span>·</span>
          <span className="text-[#007d48] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#007d48]" />
            Available for Hire
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          2. PRIMARY NAV ({component.primary-nav})
          Height 60px, Canvas (#ffffff), Hairline soft bottom
      ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] px-6 sm:px-12 h-16 flex items-center justify-between">
        {/* Left: Brand Monogram / Swoosh */}
        <div className="flex items-center gap-3">
          <NikeSwoosh className="w-12 h-4 text-[#111111]" />
          <span className="text-sm font-semibold tracking-tight uppercase pl-1 border-l border-[#cacacb]">
            SEONGYU KIM
          </span>
        </div>

        {/* Center: Main Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          <a href="#campaign" className="hover:text-[#707072] transition-colors py-2 border-b-2 border-[#111111]">
            Campaign
          </a>
          <a href="#featured" className="hover:text-[#707072] transition-colors py-2">
            Links
          </a>
          <a href="#projects" className="hover:text-[#707072] transition-colors py-2">
            Projects
          </a>
          <a href="#spec" className="hover:text-[#707072] transition-colors py-2">
            Specifications
          </a>
        </nav>

        {/* Right: Actions Cluster (Search Pill + Circular Icons) */}
        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <div className="hidden sm:flex items-center bg-[#f5f5f5] text-[#111111] h-10 px-4 rounded-full w-48 focus-within:w-64 focus-within:bg-white focus-within:border-2 focus-within:border-[#111111] transition-all">
            <Search className="w-4 h-4 text-[#707072] mr-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search links..."
              className="bg-transparent text-sm w-full outline-none placeholder:text-[#707072]"
            />
          </div>

          {/* Circular Wishlist Button */}
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isLiked ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5]'
            }`}
            title="Cheer / Wishlist"
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
          </button>

          {/* Circular Share Button */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5] flex items-center justify-center transition-all cursor-pointer"
            title="Share Profile"
            aria-label="Share"
          >
            {copied ? <Check className="w-4 h-4 text-[#007d48]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          3. EDITORIAL CAMPAIGN HERO ({component.campaign-tile})
          Towering uppercase Futura display lockup (96px, 0.9 lh)
          burned directly into full-bleed editorial imagery.
          Pill CTA (white outline-on-image) anchored at bottom-left.
      ══════════════════════════════════════════════ */}
      <section id="campaign" className="relative w-full overflow-hidden bg-black text-white">
        {/* Full-bleed Campaign Background Image */}
        <div className="relative w-full h-[580px] sm:h-[680px] lg:h-[760px]">
          <Image
            src="https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1800&auto=format&fit=crop&q=85"
            alt="Editorial Campaign Photography"
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
          {/* Subtle Contrast Wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

          {/* Locked-in Campaign Typography */}
          <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#cacacb] mb-3">
              ATHLETIC EDITORIAL & SYSTEMS / 2026 EDITION
            </span>

            {/* Towering Futura ND Display Tier (96px / 0.9 Line Height) */}
            <h1 className="font-display-campaign text-6xl sm:text-8xl lg:text-[104px] tracking-tight uppercase leading-[0.9] text-white max-w-4xl drop-shadow-md">
              CODE AS A DISCIPLINE.
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#cacacb] max-w-xl font-normal leading-relaxed">
              Kim Seongyu is a full-stack software engineer building high-performance web products with mathematical precision, clean architecture, and relentless user focus.
            </p>

            {/* On-Image Pill CTA ({component.button-outline-on-image}) */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#featured"
                className="inline-flex items-center justify-center bg-white text-[#111111] h-12 px-8 rounded-full text-base font-medium btn-press hover:bg-[#f5f5f5] transition-all cursor-pointer"
              >
                EXPLORE LINKS
              </a>
              <a
                href="mailto:sunkyu@hanyang.ac.kr"
                className="inline-flex items-center justify-center bg-transparent border border-white text-white h-12 px-8 rounded-full text-base font-medium btn-press hover:bg-white/10 transition-all cursor-pointer"
              >
                GET IN TOUCH
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. SUB-NAV STRIP & CATEGORY FILTER CHIPS
          Breadcrumb + Filter Chips (Pill geometry: 30px)
      ══════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 bg-white border-b border-[#e5e5e5] px-6 sm:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb / Section Counter */}
        <div className="flex items-center gap-2 text-sm text-[#707072]">
          <span className="text-[#111111] font-semibold">Featured Work</span>
          <span>/</span>
          <span>Directory ({filteredLinks.length})</span>
        </div>

        {/* Right: Pill Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs text-[#707072] mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="uppercase font-semibold">FILTER:</span>
          </div>

          {(['ALL', 'CORE', 'WRITING', 'NETWORK'] as const).map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`h-9 px-4 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#111111] border border-[#cacacb] hover:border-[#111111]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. PRODUCT CARDS GRID ({component.product-card})
          3-up desktop, 2-up tablet, 1-up mobile
          0px radius, 0px shadow, flat on canvas.
          Full-bleed 1:1 image sitting on {colors.soft-cloud} (#f5f5f5).
      ══════════════════════════════════════════════ */}
      <main id="featured" className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#111111]">
            CURATED DIRECTORY & PLATFORMS
          </h2>
          <span className="text-sm text-[#707072]">Showing {filteredLinks.length} items</span>
        </div>

        {/* The Grid: 8px Gutters ({spacing.sm}) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-10">
          {filteredLinks.map((item) => (
            <div key={item.id} className="group nike-card flex flex-col justify-between">
              <div>
                {/* 1:1 Photographic Stage on Soft Cloud */}
                <div className="relative w-full aspect-square bg-[#f5f5f5] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Promo Badge ({component.badge-promo}) */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-white text-[#111111] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#cacacb] tracking-wider uppercase">
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Below-image Metadata (8px vertical rhythm) */}
                <div className="pt-3.5 space-y-1">
                  {/* Swatch Dot Row */}
                  <div className="flex items-center gap-1.5 py-1">
                    {item.swatches.map((color, i) => (
                      <span
                        key={i}
                        className={`w-3 h-3 rounded-full border ${
                          i === 0 ? 'ring-1 ring-offset-1 ring-[#111111]' : ''
                        }`}
                        style={{ backgroundColor: color, borderColor: '#cacacb' }}
                      />
                    ))}
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-medium text-[#111111] tracking-tight group-hover:underline leading-snug">
                    {item.name}
                  </h3>

                  {/* Subtitle ({typography.caption-md} {colors.mute}) */}
                  <p className="text-sm text-[#707072] leading-normal">{item.category}</p>

                  {/* Price Row / Status */}
                  <div className="pt-1 flex items-center gap-2 text-sm font-medium">
                    {item.isSale ? (
                      <>
                        <span className="text-[#d30005] font-semibold">{item.priceNote}</span>
                        <span className="line-through text-[#707072] text-xs">Standard</span>
                      </>
                    ) : (
                      <span className="text-[#111111]">{item.priceNote}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: Primary Pill ({component.button-primary}) */}
              <div className="pt-4">
                <a
                  href={item.url}
                  target={item.url.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between bg-[#111111] text-white h-11 px-6 rounded-full text-sm font-medium btn-press hover:bg-[#39393b] transition-all cursor-pointer"
                >
                  <span>LAUNCH DESTINATION</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ══════════════════════════════════════════════
          6. EDITORIAL SPORT / PROJECT RAIL ({spacing.section} = 48px)
          Horizontal showcase inspired by Nike's "Shop by Sport"
      ══════════════════════════════════════════════ */}
      <section id="projects" className="border-t border-[#cacacb] bg-white py-14">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-[#707072] tracking-widest block mb-1">
                ENGINEERING SPOTLIGHT
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight uppercase text-[#111111]">
                FLAGSHIP BUILDS
              </h2>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#111111] hover:underline flex items-center gap-1.5"
            >
              <span>View GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 3-Column Sport Tile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="relative group overflow-hidden bg-[#f5f5f5] nike-card aspect-[4/5] flex flex-col justify-end p-6">
                <Image
                  src={proj.imageUrl}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#cacacb] font-medium tracking-wider">
                    <span>{proj.role}</span>
                    <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full">{proj.metric}</span>
                  </div>

                  <h3 className="font-display-campaign text-3xl sm:text-4xl tracking-tight text-white leading-none">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-[#cacacb] line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech.map((t) => (
                      <span key={t} className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* On-Image Pill CTA ({component.button-outline-on-image}) */}
                  <div className="pt-3">
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-[#111111] h-10 px-6 rounded-full text-xs font-semibold tracking-wide btn-press hover:bg-[#f5f5f5] transition-all cursor-pointer"
                    >
                      <span>VIEW PROJECT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. PDP-STYLE DISCLOSURE ROWS ({component.pdp-disclosure-row})
          Stacked rows with {spacing.xl} (24px) padding,
          1px hairline divider below each.
      ══════════════════════════════════════════════ */}
      <section id="spec" className="border-t border-[#cacacb] bg-[#f5f5f5] py-14">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#707072]">
              SYSTEM SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight text-[#111111] mt-1">
              ENGINEER PROFILE & TECH DATA
            </h2>
          </div>

          <div className="bg-white border border-[#cacacb] divide-y divide-[#cacacb]">
            {/* Row 1: Technical Stack */}
            <div>
              <button
                onClick={() => toggleSection('spec')}
                className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <span className="text-base font-medium text-[#111111] uppercase tracking-wide">
                  Core Technologies & Architecture
                </span>
                {openSections.spec ? <ChevronUp className="w-5 h-5 text-[#111111]" /> : <ChevronDown className="w-5 h-5 text-[#111111]" />}
              </button>
              {openSections.spec && (
                <div className="px-6 pb-6 pt-2 text-sm text-[#707072] space-y-3 leading-relaxed border-t border-[#e5e5e5]">
                  <p>
                    <strong className="text-[#111111]">Frontend:</strong> Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Turbopack.
                  </p>
                  <p>
                    <strong className="text-[#111111]">Backend & Cloud:</strong> Node.js, Express, PostgreSQL, Prisma ORM, Docker, RESTful & GraphQL APIs.
                  </p>
                  <p>
                    <strong className="text-[#111111]">Engineering Philosophy:</strong> Pure functional composition, rigorous type safety, zero unnecessary dependencies, and accessible UI meeting WCAG AAA specifications.
                  </p>
                </div>
              )}
            </div>

            {/* Row 2: Education & Honors */}
            <div>
              <button
                onClick={() => toggleSection('skills')}
                className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <span className="text-base font-medium text-[#111111] uppercase tracking-wide">
                  Education & Verification
                </span>
                {openSections.skills ? <ChevronUp className="w-5 h-5 text-[#111111]" /> : <ChevronDown className="w-5 h-5 text-[#111111]" />}
              </button>
              {openSections.skills && (
                <div className="px-6 pb-6 pt-2 text-sm text-[#707072] space-y-2 border-t border-[#e5e5e5]">
                  <div className="flex justify-between py-1">
                    <span className="text-[#111111] font-medium">Hanyang University</span>
                    <span>Computer Software Engineering</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#111111] font-medium">Status</span>
                    <span className="text-[#007d48] font-semibold">Active Enrollment / In Good Standing</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#111111] font-medium">Location</span>
                    <span>Seoul, Republic of Korea</span>
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Collaboration & Engagement Terms */}
            <div>
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <span className="text-base font-medium text-[#111111] uppercase tracking-wide">
                  Collaboration & Inquiry Policy
                </span>
                {openSections.shipping ? <ChevronUp className="w-5 h-5 text-[#111111]" /> : <ChevronDown className="w-5 h-5 text-[#111111]" />}
              </button>
              {openSections.shipping && (
                <div className="px-6 pb-6 pt-2 text-sm text-[#707072] space-y-2 border-t border-[#e5e5e5]">
                  <p>
                    All project inquiries, open-source discussions, and freelance contracts are reviewed directly by Kim Seongyu within 24 hours.
                  </p>
                  <p>
                    Preferred channel: <a href="mailto:sunkyu@hanyang.ac.kr" className="underline text-[#111111] font-medium">sunkyu@hanyang.ac.kr</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. FOOTER ({component.footer})
          1px hairline divider, 4-column layout,
          fine-print row with {typography.utility-xs} (9px)
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-[#cacacb] bg-white pt-14 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          {/* 4 Column Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
            <div>
              <h4 className="text-xs font-bold uppercase text-[#111111] tracking-wider mb-4">
                RESOURCES
              </h4>
              <ul className="space-y-3 text-sm text-[#707072]">
                <li><a href="https://sunkyu.dev" className="hover:text-[#111111]">Portfolio Site</a></li>
                <li><a href="https://velog.io/@sunkyu" className="hover:text-[#111111]">Tech Blog</a></li>
                <li><a href="https://github.com" className="hover:text-[#111111]">GitHub Profile</a></li>
                <li><a href="#campaign" className="hover:text-[#111111]">Campaign Reel</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-[#111111] tracking-wider mb-4">
                GET HELP & CONNECT
              </h4>
              <ul className="space-y-3 text-sm text-[#707072]">
                <li><a href="mailto:sunkyu@hanyang.ac.kr" className="hover:text-[#111111]">Direct Inquiry</a></li>
                <li><a href="https://calendly.com" className="hover:text-[#111111]">Schedule 1:1</a></li>
                <li><a href="https://buymeacoffee.com" className="hover:text-[#111111]">Support via Coffee</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-[#111111] tracking-wider mb-4">
                ENGINEERING
              </h4>
              <ul className="space-y-3 text-sm text-[#707072]">
                <li><a href="#spec" className="hover:text-[#111111]">Next.js 16 System</a></li>
                <li><a href="#spec" className="hover:text-[#111111]">TypeScript Architecture</a></li>
                <li><a href="#spec" className="hover:text-[#111111]">WCAG Accessibility</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-[#111111] tracking-wider mb-4">
                LOCATION & STATUS
              </h4>
              <div className="space-y-3 text-sm text-[#707072]">
                <p className="text-[#111111] font-semibold">Seoul, Republic of Korea</p>
                <p>Hanyang University</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f5] text-xs font-medium text-[#111111]">
                    <span className="w-2 h-2 rounded-full bg-[#007d48]" />
                    Online & Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Fine-Print Row ({typography.utility-xs} = 9px) */}
          <div className="border-t border-[#e5e5e5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-[#707072] uppercase tracking-wider font-medium">
            <div className="flex items-center gap-3">
              <span className="text-[#111111] font-bold">© 2026 KIM SEONGYU, INC. ALL RIGHTS RESERVED</span>
              <span>·</span>
              <a href="#" className="hover:underline">PRIVACY POLICY</a>
              <span>·</span>
              <a href="#" className="hover:underline">TERMS OF SERVICE</a>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#111111]" />
              <span className="text-[#111111] font-bold">SOUTH KOREA / EN</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Minimal Toast Feedback ── */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white text-xs font-medium px-6 py-3 rounded-full shadow-lg tracking-wider uppercase flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#007d48]" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
