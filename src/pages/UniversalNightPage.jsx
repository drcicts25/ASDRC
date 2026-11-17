import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  SupernovaHero,
  ScrollReveal,
  ConstellationDivider,
  PlaceholderSlot,
  BracketText,
} from '../components/CosmicPrimitives';
import { useSiteConfig } from '../context/SiteConfigContext';

export function UniversalNightPage() {
  const { config } = useSiteConfig();
  const { un26, champions, gallery } = config;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const totalSlides = gallery?.length || 0;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % totalSlides);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    else if (diff < -40) prevSlide();
    touchStartX.current = null;
    setIsPaused(false);
  };

  const subjectCards = [
    {
      title: 'Astrophysics',
      desc: 'Stellar physics, radiative processes, orbital mechanics and high-energy phenomena.',
    },
    {
      title: 'General Astronomy',
      desc: 'Planetary science, astronomical history, positional astronomy and celestial coordinates.',
    },
    {
      title: 'Observation Astronomy',
      desc: 'Night-sky star charts, Messier & NGC objects, constellations and telescope optics.',
    },
    {
      title: 'Rocketry',
      desc: 'Aerospace propulsion, multi-stage aerodynamics, orbital insertion and flight dynamics.',
    },
    {
      title: 'Cosmology',
      desc: 'Origin and evolution of the universe, relativistic models, dark matter and cosmic expansion.',
    },
  ];

  return (
    <div>
      {/* HERO BLOCK */}
      <SupernovaHero
        headline="Universal Night"
        highlightWords={['Universal']}
        subHeadline="One night. Many schools. Infinite sky."
        size="large"
      >
        <Link to="/register" className="btn-primary text-sm sm:text-base w-full sm:w-auto">
          <span>Register for UN &apos;27</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </SupernovaHero>

      {/* ABOUT UN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start">
          <ScrollReveal className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="section-label">ABOUT UN</div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12]">
              An Evening of Knowledge, Competition &amp; Stargazing
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Universal Night is the annual astronomical night organized by the Astronomical Society of Dharmaraja College. It brings together school astronomy societies from across Sri Lanka for an evening of knowledge, competition and stargazing.
            </p>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Teams compete across five subject areas:{' '}
              <strong className="text-[#F2E205] font-semibold">
                Astrophysics, General Astronomy, Observation Astronomy, Rocketry and Cosmology
              </strong>
              , testing their depth of knowledge, speed and teamwork. Beyond the competition, UN is a gathering of like-minded young enthusiasts who share a passion for the universe, and it gives every participant a chance to learn, network and be inspired.
            </p>

            <p className="text-[#A7CFF2] text-base sm:text-lg leading-relaxed">
              Since our first episode, UN has grown in scale and reputation, and each year we aim to raise the bar for school-level astronomy events in Sri Lanka.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120} className="lg:col-span-5">
            <PlaceholderSlot
              title="[UN '27 Official Emblem & Trophy Visual Slot]"
              subtitle="Replace with official Universal Night '27 logo or championship trophy visual"
              imageUrl={config.society?.logos?.un26Logo}
              className="min-h-[240px] sm:min-h-[300px]"
            />
          </ScrollReveal>
        </div>

        {/* Five Subject Areas Grid */}
        <ScrollReveal delay={160} className="mt-12 sm:mt-16">
          <div className="section-label mb-4">FIVE COMPETITION SUBJECT AREAS</div>

          <div className="observatory-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 rounded-xl overflow-hidden">
            {subjectCards.map((subj) => (
              <div
                key={subj.title}
                className="observatory-cell p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F2E205] leading-snug">
                    {subj.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#A7CFF2]/85 leading-relaxed">
                    {subj.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <ConstellationDivider />

      {/* PREVIOUS CHAMPIONS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <ScrollReveal className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="section-label mb-2">HALL OF HONOR</div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Previous Champions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A7CFF2]/80 italic">
            (Client to supply the full list of past champions and logos.)
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {champions.map((row, idx) => (
            <ScrollReveal key={row.id} delay={idx * 50}>
              <div className="surface-card rounded-2xl p-6 flex flex-col items-center text-center h-full justify-between gap-5">
                <div className="w-full flex items-center justify-between text-xs">
                  <span className="font-display font-bold text-lg text-[#F2A007]">
                    <BracketText text={row.year} />
                  </span>
                  {row.episode && (
                    <span className="text-[11px] text-[#A7CFF2]/80 text-right">
                      {row.episode}
                    </span>
                  )}
                </div>

                {/* Prominent School Crest / Logo Display */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20 flex items-center justify-center p-3 shrink-0">
                  {row.logoUrl ? (
                    <img
                      src={row.logoUrl}
                      alt={row.school}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs">
                      <BracketText text={row.logoPlaceholder || '[school logo]'} />
                    </span>
                  )}
                </div>

                <div className="w-full pt-3 border-t border-[#A7CFF2]/10">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug">
                    <BracketText text={row.school} />
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ConstellationDivider />

      {/* GLANCE (HORIZONTALLY STACKED SLIDESHOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        <ScrollReveal className="mb-8 sm:mb-12 text-center">
          <div className="section-label mb-2">GLANCE</div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
            A Glance at Previous Nights
          </h2>
        </ScrollReveal>

        {totalSlides > 0 && (
          <div
            className="relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Horizontally Stacked Coverflow Stage */}
            <div className="relative h-[250px] sm:h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
              {gallery.map((item, idx) => {
                // Circular signed offset from activeSlide
                let offset = idx - activeSlide;
                if (offset > totalSlides / 2) offset -= totalSlides;
                if (offset < -totalSlides / 2) offset += totalSlides;

                const absOffset = Math.abs(offset);
                if (absOffset > 2) return null;

                const isCenter = offset === 0;
                const translateXPercent =
                  offset === 0
                    ? 0
                    : offset === 1
                    ? 46
                    : offset === -1
                    ? -46
                    : offset > 1
                    ? 82
                    : -82;
                const scale =
                  absOffset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.66;
                const zIndex = absOffset === 0 ? 30 : absOffset === 1 ? 20 : 10;
                const opacity =
                  absOffset === 0 ? 1 : absOffset === 1 ? 0.65 : 0.28;

                return (
                  <div
                    key={item.id}
                    onClick={() => !isCenter && setActiveSlide(idx)}
                    style={{
                      transform: `translateX(${translateXPercent}%) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                    className={`absolute w-[74%] sm:w-[58%] md:w-[50%] max-w-[600px] aspect-[16/10] rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
                      isCenter
                        ? 'shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-[#A7CFF2]/35 cursor-default'
                        : 'shadow-[0_12px_32px_rgba(0,0,0,0.8)] border border-[#A7CFF2]/15 cursor-pointer hover:opacity-85'
                    }`}
                  >
                    {item.imageUrl && item.imageUrl.trim() !== '' ? (
                      <img
                        src={item.imageUrl}
                        alt={item.caption || ''}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="placeholder-slot w-full h-full flex items-center justify-center">
                        <span className="placeholder-tag text-xs sm:text-sm">
                          [{item.slotLabel}]
                        </span>
                      </div>
                    )}
                    {!isCenter && (
                      <div className="pointer-events-none absolute inset-0 bg-[#0D0D0D]/35" />
                    )}
                  </div>
                );
              })}

              {/* Left / Right Controls */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-1 sm:left-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0D0D0D]/80 border border-[#A7CFF2]/35 text-white hover:border-[#F2E205] hover:text-[#F2E205] flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-1 sm:right-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0D0D0D]/80 border border-[#A7CFF2]/35 text-white hover:border-[#F2E205] hover:text-[#F2E205] flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Minimal Dot Indicators */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {gallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide
                      ? 'w-7 bg-[#F2E205]'
                      : 'w-2 bg-[#A7CFF2]/30 hover:bg-[#A7CFF2]/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <ConstellationDivider />

      {/* UN '26 — MOST DOMINANT CALL TO ACTION ON THE SITE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24">
        <ScrollReveal>
          <div className="relative rounded-2xl p-6 sm:p-12 lg:p-16 bg-[#111520] border border-[#F2E205]/45 overflow-hidden">
            <div
              className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(242,226,5,0.3) 0%, rgba(242,160,7,0.18) 35%, rgba(5,17,242,0.28) 70%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="section-label !text-[#F2E205]">UN &apos;27</div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08]">
                UN &apos;27: <span className="text-supernova-gradient">The Next Chapter</span>
              </h2>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-3xl">
                The next episode of Universal Night is coming, and it is bigger than ever. UN &apos;27 invites school astronomy societies across Sri Lanka to bring their sharpest minds and boldest ideas to a night of competition, discovery and wonder. Teams will test themselves across Astrophysics, General Astronomy, Observation Astronomy, Rocketry and Cosmology, and experience the thrill of an astronomical night hosted by Sri Lanka&apos;s pioneering school astronomy society.
              </p>

              {/* Date, Venue, Registration closes */}
              <div className="observatory-grid grid grid-cols-1 sm:grid-cols-3 rounded-xl overflow-hidden">
                <div className="observatory-cell p-4 sm:p-5">
                  <div className="text-xs text-[#A7CFF2]">Date</div>
                  <div className="mt-1.5 font-display font-bold text-base sm:text-lg text-[#F2A007]">
                    <BracketText text={un26.date} />
                  </div>
                </div>

                <div className="observatory-cell p-4 sm:p-5">
                  <div className="text-xs text-[#A7CFF2]">Venue</div>
                  <div className="mt-1.5 font-display font-bold text-base sm:text-lg text-[#F2A007]">
                    <BracketText text={un26.venue} />
                  </div>
                </div>

                <div className="observatory-cell p-4 sm:p-5">
                  <div className="text-xs text-[#A7CFF2]">Registration closes</div>
                  <div className="mt-1.5 font-display font-bold text-base sm:text-lg text-[#F2A007]">
                    <BracketText text={un26.registrationCloses} />
                  </div>
                </div>
              </div>

              {/* Large primary button (most dominant call to action on the site) */}
              <div className="pt-3">
                <Link
                  to="/register"
                  className="btn-primary w-full sm:w-auto !text-sm sm:!text-base md:!text-lg !py-4 !px-6 sm:!px-10 tracking-wide"
                >
                  <span>COMPETITION RULES AND REGISTRATION</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
