import React, { useEffect, useRef, useState } from 'react';

/**
 * Highlights any [square bracket] placeholders visibly as requested in Section A.6
 */
export function BracketText({ text, className = '' }) {
  if (!text) return null;
  const parts = String(text).split(/(\[[^\]]+\])/g);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span key={index} className="placeholder-tag">
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}

/**
 * Scroll Reveal Wrapper: Sections fade and rise softly into view
 */
export function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Constellation & Orbital Divider that draws itself on scroll
 */
export function ConstellationDivider() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-14 select-none"
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1000 44"
          className="w-full h-8 sm:h-10 overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="orbitalGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#A7CFF2" stopOpacity="0.06" />
              <stop offset="25%" stopColor="#0511F2" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#A7CFF2" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#0511F2" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#A7CFF2" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <path
            d="M 0 22 Q 500 2 1000 22"
            stroke="url(#orbitalGrad)"
            strokeWidth="1"
            strokeDasharray="1000"
            strokeDashoffset={drawn ? '0' : '1000'}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <circle
            cx="260"
            cy="15"
            r="2"
            fill="#A7CFF2"
            opacity={drawn ? 0.6 : 0}
            className="transition-opacity duration-700 delay-300"
          />
          <circle
            cx="500"
            cy="12"
            r="3"
            fill="#F2E205"
            opacity={drawn ? 0.95 : 0}
            className="transition-opacity duration-700 delay-500"
          />
          <circle
            cx="740"
            cy="15"
            r="2"
            fill="#A7CFF2"
            opacity={drawn ? 0.6 : 0}
            className="transition-opacity duration-700 delay-300"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Count-up animation for society statistics
 */
export function CountUpStat({
  target,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  duration = 1400,
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const numTarget = Number(target);
    if (isNaN(numTarget)) return;
    let startTime = null;
    const startVal = numTarget > 1900 ? 1950 : 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(startVal + eased * (numTarget - startVal)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(numTarget);
      }
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="observatory-cell p-5 sm:p-7 flex flex-col justify-center">
      <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums tracking-tight">
        <span className="text-[#A7CFF2] font-normal text-lg sm:text-2xl">{prefix}</span>
        {value}
        <span className="text-[#F2E205]">{suffix}</span>
      </div>
      <div className="mt-2 text-xs sm:text-sm font-medium text-white leading-snug">{label}</div>
      {sublabel && (
        <div className="mt-1 text-[11px] sm:text-xs text-[#A7CFF2]/75 leading-snug">
          {sublabel}
        </div>
      )}
    </div>
  );
}

/**
 * Marked, easily replaceable image/logo placeholder slot (No stock imagery per Section A.6)
 */
export function PlaceholderSlot({
  title = '[Image Placeholder]',
  subtitle = '',
  imageUrl = '',
  alt = '',
  className = '',
  rounded = 'rounded-xl',
  compact = false,
}) {
  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <div
        className={`relative overflow-hidden bg-[#13161F] border border-[#A7CFF2]/20 ${rounded} ${className}`}
      >
        <img
          src={imageUrl}
          alt={alt || title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`placeholder-slot flex flex-col items-center justify-center p-5 text-center select-none ${rounded} ${className}`}
      role="img"
      aria-label={alt || title}
    >
      <span className="placeholder-tag text-xs sm:text-sm">{title}</span>
      {!compact && subtitle && (
        <p className="mt-2 text-xs text-[#A7CFF2]/80 max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Supernova Hero Block
 * Mobile-first and tablet-optimized with one dramatic cosmic focal point.
 */
export function SupernovaHero({
  sectionLabel,
  headline,
  highlightWords = [],
  subHeadline,
  backgroundMediaUrl = '',
  children,
  size = 'large',
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const { innerWidth, innerHeight } = window;
    const x = ((e.clientX - innerWidth / 2) / innerWidth) * 14;
    const y = ((e.clientY - innerHeight / 2) / innerHeight) * 14;
    setOffset({ x, y });
  };

  const renderHeadline = () => {
    if (!highlightWords.length) return headline;
    const pattern = new RegExp(`(${highlightWords.join('|')})`, 'gi');
    const parts = String(headline).split(pattern);
    return parts.map((part, i) => {
      if (highlightWords.some((w) => w.toLowerCase() === part.toLowerCase())) {
        return (
          <span key={i} className="text-supernova-gradient">
            {part}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden bg-[#0D0D0D] border-b border-[#A7CFF2]/15 ${
        size === 'large'
          ? 'min-h-[80vh] sm:min-h-[84vh] pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 flex items-center'
          : 'pt-28 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24'
      }`}
    >
      {/* Optional Replaceable Hero Background Image/Video Slot */}
      {backgroundMediaUrl && (
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src={backgroundMediaUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]" />
        </div>
      )}

      {/* One Dramatic Cosmic Moment: The Supernova Horizon & Orbital Ring */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center z-0"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: 'transform 0.5s ease-out',
        }}
        aria-hidden="true"
      >
        <div
          className="w-[85vw] max-w-[520px] sm:max-w-[640px] lg:max-w-[760px] aspect-square rounded-full animate-pulse-core"
          style={{
            background:
              'radial-gradient(circle, rgba(242,226,5,0.18) 0%, rgba(242,160,7,0.13) 22%, rgba(5,17,242,0.20) 52%, rgba(13,13,13,0) 72%)',
            filter: 'blur(36px)',
          }}
        />

        <div
          className="absolute w-36 h-36 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full opacity-70 animate-pulse-core"
          style={{
            background:
              'radial-gradient(circle, rgba(242,226,5,0.34) 0%, rgba(242,160,7,0.20) 40%, rgba(5,17,242,0.14) 70%, transparent 100%)',
            filter: 'blur(20px)',
          }}
        />

        <div className="absolute w-[68vw] max-w-[360px] sm:max-w-[460px] lg:max-w-[520px] aspect-square rounded-full border border-[#A7CFF2]/15 animate-shockwave" />

        <div className="absolute w-[76vw] max-w-[400px] sm:max-w-[500px] lg:max-w-[580px] aspect-square rounded-full border border-dashed border-[#A7CFF2]/20 animate-orbit-slow">
          <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#F2E205] shadow-[0_0_12px_#F2E205]" />
          <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 rounded-full bg-[#A7CFF2]" />
        </div>

        <div className="absolute w-[92vw] max-w-[480px] sm:max-w-[640px] lg:max-w-[820px] h-[160px] sm:h-[230px] lg:h-[300px] rounded-[100%] border border-[#0511F2]/40 rotate-[-14deg]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl">
          {sectionLabel && <div className="section-label mb-4 sm:mb-5">{sectionLabel}</div>}

          <h1
            className={`font-display font-bold text-white tracking-tight ${
              size === 'large'
                ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]'
                : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]'
            }`}
          >
            {renderHeadline()}
          </h1>

          {subHeadline && (
            <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-[#A7CFF2] max-w-2xl leading-relaxed font-normal">
              <BracketText text={subHeadline} />
            </p>
          )}

          {children && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
