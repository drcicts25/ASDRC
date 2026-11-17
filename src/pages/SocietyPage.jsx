import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  SupernovaHero,
  ScrollReveal,
  ConstellationDivider,
  PlaceholderSlot,
  BracketText,
} from '../components/CosmicPrimitives';
import { useSiteConfig } from '../context/SiteConfigContext';

export function SocietyPage() {
  const { config } = useSiteConfig();
  const { un26 } = config;

  const timelineMilestones = [
    {
      year: '1996',
      title: '1996 — Founded',
      description:
        'The Astronomical Society of Dharmaraja College was founded in 1996 under the guidance of school master Mr. Menon Rajakrishna, becoming the first school-based astronomical society in the Kandy district=.',
      photoSlot: '[History Photo Slot 1: 1996 Founding & Early Years]',
    },
    {
      year: '2003',
      title: '2003 — Name Adopted & Events Begin',
      description:
        'The name "Astronomical Society of Dharmaraja College" came into formal use in 2003. Since 2003, ASDRC expanded its educational programs with observation camps, quiz competitions, lectures and observation competitions for students inside and outside the school.',
      photoSlot: '[History Photo Slot 2: 2003 Society Formalization & Early Camps]',
    },
    {
      year: '2006',
      title: '2006 — Beyond Infinity',
      description:
        'ASDRC organized Beyond Infinity 2006, a landmark event as the first multi-purpose astronomical workshop and sky observation camp held in Sri Lanka.',
      photoSlot: '[History Photo Slot 3: Beyond Infinity 2006 Observation Camp]',
    },
    {
      year: 'Signature Nights',
      title: 'Universal Night & Sagittarius',
      description: `Universal Night grew into our flagship annual astronomical night, with seven successful episodes completed as of 2021 and still growing ${un26.completedEpisodesNote || "[Update the count for UN '27]"}. Alongside it, two episodes of the astronomical night Sagittarius have been completed.`,
      photoSlot: '[History Photo Slot 4: Universal Night & Sagittarius Archives]',
    },
    {
      year: 'Olympiad & Quizzes',
      title: 'Rajans Astro Olympiad',
      description:
        'ASDRC established the Rajans Astro Olympiad, among the most awaited inter-school quiz competitions in Sri Lanka. Members have excelled at the National Astronomy Olympiad and represented Sri Lanka at the International Astronomy Olympiad.',
      photoSlot: '[History Photo Slot 5: Rajans Astro Olympiad & Olympiad Winners]',
    },
    {
      year: '2027',
      title: "UN '27 — Looking Ahead",
      description:
        'Guided by the same spirit that inspired our founders, ASDRC continues to make astronomy accessible, exciting and rewarding for the next generation of Sri Lankan students with Universal Night 2027.',
      photoSlot: "[History Photo Slot 6: UN '27 Preparations & Current Society]",
    },
  ];

  return (
    <div>
      {/* HERO BLOCK */}
      <SupernovaHero
        headline="Our Story"
        highlightWords={['Story']}
        subHeadline="Nearly three decades of student-led astronomy in the hills of Kandy."
        size="medium"
      />

      {/* HISTORY OF THE SOCIETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        {/* Top Row: The Beginning (1996) + Dharmaraja College Crest / Heritage Slot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start pb-12 sm:pb-16 border-b border-[#A7CFF2]/15">
          <ScrollReveal className="lg:col-span-7 space-y-5">
            <div className="section-label">HISTORY OF THE SOCIETY</div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
              The Beginning (1996)
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              The Astronomical Society of Dharmaraja College was founded in 1996 under the guidance of school master Mr. Menon Rajakrishna, and became the first school-based astronomical society in the Kandy district. The name &ldquo;Astronomical Society of Dharmaraja College&rdquo; came into formal use in 2003.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100} className="lg:col-span-5">
            <PlaceholderSlot
              title="[Dharmaraja College Crest & Society Banner Slot]"
              subtitle="Replace with official Dharmaraja College crest and society archival image"
              imageUrl={config.society?.logos?.asdrcLogo}
              className="min-h-[200px] sm:min-h-[230px]"
            />
          </ScrollReveal>
        </div>

        {/* Middle Row: Who We Are & Educating Through Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 py-12 sm:py-16 border-b border-[#A7CFF2]/15">
          <ScrollReveal className="space-y-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Who We Are</h3>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              ASDRC is a student-initiated society, patronized by the Principal of Dharmaraja College and functioning under the supervision of two Masters-in-Charge (MICs). The society is headed by a President elected at the Annual General Meeting (AGM) for a one-year term. The office bearers include a Secretary, a Treasurer and their assistants, supported by a committee of 50 members. Almost all Advanced Level students of the school hold membership, and member committees take on both general and technical responsibilities at every event we organize.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100} className="space-y-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Educating Through Events
            </h3>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Since its inception, ASDRC has organized educational programs covering almost every major area of astronomy, for students both inside and outside the school. Since 2003 these have included observation camps, quiz competitions, lectures and observation competitions. A landmark was <strong className="text-[#F2E205] font-semibold">Beyond Infinity 2006</strong>, the first multi-purpose astronomical workshop and sky observation camp held in Sri Lanka.
            </p>
          </ScrollReveal>
        </div>

        {/* Signature Events */}
        <div className="py-12 sm:py-16 border-b border-[#A7CFF2]/15 space-y-6">
          <ScrollReveal>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Signature Events
            </h3>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="observatory-grid grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden">
              <div className="observatory-cell p-6 sm:p-8 space-y-2.5">
                <h4 className="font-display text-xl font-bold text-[#F2E205]">Universal Night</h4>
                <p className="text-sm sm:text-base text-[#A7CFF2] leading-relaxed">
                  Our annual astronomical night, with nine successful episodes completed as of 2026 and still growing.{' '}
                </p>
              </div>

              <div className="observatory-cell p-6 sm:p-8 space-y-2.5">
                <h4 className="font-display text-xl font-bold text-white">Sagittarius</h4>
                <p className="text-sm sm:text-base text-[#A7CFF2] leading-relaxed">
                  Three episodes of this astronomical night have been completed.
                </p>
              </div>

              <div className="observatory-cell p-6 sm:p-8 space-y-2.5">
                <h4 className="font-display text-xl font-bold text-[#F2A007]">
                  Rajans Astro Olympiad
                </h4>
                <p className="text-sm sm:text-base text-[#A7CFF2] leading-relaxed">
                  Among the most awaited inter-school quiz competitions in Sri Lanka under the events UN and Sagittarius.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Row: Achievements & Looking Ahead */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 pt-12 sm:pt-16">
          <ScrollReveal className="surface-card rounded-2xl p-6 sm:p-8 space-y-3">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Achievements</h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Students of ASDRC have won many regional, national and international level competitions and continue to deliver outstanding performances. Members have excelled at the National Astronomy Olympiad and have been selected several times to represent Sri Lanka at the International Astronomy Olympiad.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100} className="surface-card rounded-2xl p-6 sm:p-8 space-y-3">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Looking Ahead</h3>
            <p className="text-sm sm:text-base text-[#A7CFF2] leading-relaxed">
              Guided by the same spirit that inspired our founders, ASDRC continues to make astronomy accessible, exciting and rewarding for the next generation of Sri Lankan students.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ConstellationDivider />

      {/* CHRONOLOGICAL TIMELINE WITH PHOTO PLACEHOLDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        <ScrollReveal className="max-w-3xl mb-10 sm:mb-12">
          <div className="section-label mb-2">TIMELINE</div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
            Key Milestones (1996 – UN &apos;27)
          </h2>
        </ScrollReveal>

        <div className="divide-y divide-[#A7CFF2]/15 border-t border-b border-[#A7CFF2]/15">
          {timelineMilestones.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 50}>
              <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                <div className="md:col-span-3">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#F2A007]">
                    {item.year}
                  </span>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                    <BracketText text={item.description} />
                  </p>
                </div>

                <div className="md:col-span-4">
                  <PlaceholderSlot
                    title={item.photoSlot}
                    className="min-h-[160px] sm:min-h-[180px]"
                    compact
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 sm:p-8 surface-card rounded-2xl">
          <div className="font-display text-lg sm:text-xl font-bold text-white">
            Explore Universal Night &apos;26 or connect with our committee.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/universal-night" className="btn-primary text-sm">
              <span>Explore Universal Night</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-secondary text-sm">
              <span>Meet the Committee</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
