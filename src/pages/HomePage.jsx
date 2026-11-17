import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  SupernovaHero,
  ScrollReveal,
  ConstellationDivider,
  CountUpStat,
  PlaceholderSlot,
  BracketText,
} from '../components/CosmicPrimitives';
import { useSiteConfig } from '../context/SiteConfigContext';

export function HomePage() {
  const { config } = useSiteConfig();
  const { un26 } = config;

  const subjectBranches = [
    { name: 'Astrophysics', desc: 'Stellar dynamics, radiation & orbital mechanics' },
    { name: 'General Astronomy', desc: 'Solar system, history & celestial coordinates' },
    { name: 'Observation Astronomy', desc: 'Night sky charts, constellations & optics' },
    { name: 'Rocketry', desc: 'Propulsion, trajectories & spaceflight engineering' },
    { name: 'Cosmology', desc: 'Large-scale structure, relativity & cosmic evolution' },
  ];

  return (
    <div>
      {/* HERO BLOCK */}
      <SupernovaHero
        headline="Where Curiosity Meets the Cosmos"
        highlightWords={['Cosmos']}
        subHeadline="The Astronomical Society of Dharmaraja College: Inspiring young minds to look up since 1996."
        size="large"
      >
        <Link to="/society" className="btn-secondary text-sm sm:text-base w-full sm:w-auto">
          <span>Discover the Society</span>
        </Link>
        <Link to="/universal-night" className="btn-primary text-sm sm:text-base w-full sm:w-auto">
          <span>Universal Night 2027</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </SupernovaHero>

      {/* STATS STRIP (2x2 on mobile, 4-col on tablet/desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <ScrollReveal>
          <div className="observatory-grid grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden">
            <CountUpStat
              target={1996}
              prefix="Since "
              label="Founded at Dharmaraja College"
              sublabel="First school-based astronomical society in Kandy district"
            />
            <CountUpStat
              target={30}
              suffix="+"
              label="Years of Astronomy"
              sublabel="Observation camps, quizzes & workshops"
            />
            <CountUpStat
              target={5}
              label="Competition Subject Areas"
              sublabel="Astrophysics to Rocketry & Cosmology"
            />
            <CountUpStat
              target={50}
              label="Committee Members"
              sublabel="Student-led under MIC guidance"
            />
          </div>
        </ScrollReveal>
      </section>

      <ConstellationDivider />

      {/* ABOUT THE SOCIETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          <ScrollReveal className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="section-label">ABOUT THE SOCIETY</div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12]">
              Nearly Three Decades of Student-Led Astronomy in Kandy
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              The Astronomical Society of Dharmaraja College (ASDRC) was founded in 1996 and was the first school-based astronomical society in the Kandy district. It is a student-initiated society, led by students, guided by dedicated Masters-in-Charge, and patronized by the Principal of Dharmaraja College.
            </p>

            <p className="text-[#A7CFF2] text-base sm:text-lg leading-relaxed">
              For nearly three decades, ASDRC has promoted astronomy among school students across Sri Lanka through observation camps, quiz competitions, lectures, workshops and large public events. Our members have won regional, national and international competitions, and have represented Sri Lanka at the International Astronomy Olympiad.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to="/society" className="btn-secondary w-full sm:w-auto">
                <span>Read Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} className="lg:col-span-5">
            <img
              src="./Achieve.jpg"
              alt="ASDRC Achievements"
              className="w-full rounded-2xl object-cover border border-[#A7CFF2]/20"
            />
          </ScrollReveal>
        </div>
      </section>

      <ConstellationDivider />

      {/* ABOUT UNIVERSAL NIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        <div className="surface-card rounded-2xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-28 -top-28 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(242,226,5,0.28) 0%, rgba(242,160,7,0.16) 40%, rgba(5,17,242,0.3) 75%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 relative z-10">
            {/* Left Column: Narrative & Dates */}
            <ScrollReveal className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="section-label">ABOUT UNIVERSAL NIGHT</div>

              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12]">
                Universal Night: <span className="text-supernova-gradient">Flagship</span> Annual Astronomical Night
              </h2>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Universal Night is our flagship annual astronomical night, an evening where schools from across the island come together to compete, learn and gaze at the stars. Combining inter-school competitions across the major branches of astronomy with observation sessions under the night sky, UN has grown into one of the most anticipated astronomy events in the school calendar.
              </p>

              <p className="text-[#A7CFF2] text-base sm:text-lg leading-relaxed border-l-2 border-[#F2E205] pl-4">
                It is a night for the curious: for those who can calculate the orbit of a comet, name the stars overhead, or simply want to know what lies beyond our sky.
              </p>

              {/* UN '26 Dates Grid */}
              <div className="observatory-grid grid grid-cols-1 sm:grid-cols-3 rounded-xl overflow-hidden pt-1">
                <div className="observatory-cell p-4">
                  <div className="text-xs text-[#A7CFF2]">Date</div>
                  <div className="mt-1 font-display font-semibold text-sm text-[#F2A007]">
                    <BracketText text={un26.date} />
                  </div>
                </div>
                <div className="observatory-cell p-4">
                  <div className="text-xs text-[#A7CFF2]">Venue</div>
                  <div className="mt-1 font-display font-semibold text-sm text-[#F2A007]">
                    <BracketText text={un26.venue} />
                  </div>
                </div>
                <div className="observatory-cell p-4">
                  <div className="text-xs text-[#A7CFF2]">Registration Closes</div>
                  <div className="mt-1 font-display font-semibold text-sm text-[#F2A007]">
                    <BracketText text={un26.registrationCloses} />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link to="/universal-night" className="btn-primary w-full sm:w-auto">
                  <span>Explore Universal Night</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register" className="btn-secondary w-full sm:w-auto">
                  <span>Register for UN &apos;27</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right Column: UN '26 Logo Slot + Subject Areas */}
            <ScrollReveal delay={120} className="lg:col-span-5 flex flex-col justify-between gap-6">
              <PlaceholderSlot
                title="[UN '26 Official Logo Slot]"
                subtitle="Replaceable slot for Universal Night '26 insignia"
                imageUrl={config.society?.logos?.un26Logo}
                className="min-h-[150px]"
              />

              <div className="border border-[#A7CFF2]/15 rounded-xl overflow-hidden bg-[#0D0D0D]">
                <div className="px-4 py-3 bg-[#13161F] border-b border-[#A7CFF2]/15 section-label">
                  FIVE SUBJECT AREAS
                </div>
                <div className="divide-y divide-[#A7CFF2]/10">
                  {subjectBranches.map((subj) => (
                    <div
                      key={subj.name}
                      className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="font-display text-sm font-semibold text-white">
                        {subj.name}
                      </div>
                      <div className="text-xs text-[#A7CFF2]/75 mt-0.5">{subj.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <ScrollReveal>
          <div className="surface-card rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="font-display text-xl sm:text-2xl font-bold text-white">
              Questions about UN &apos;27? We&apos;d love to hear from you.
            </p>
            <Link to="/contact" className="btn-secondary w-full md:w-auto shrink-0">
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
