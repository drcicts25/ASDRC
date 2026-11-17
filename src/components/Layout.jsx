import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Settings } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { BracketText } from './CosmicPrimitives';

export function Layout({ children }) {
  const { config, setIsCommitteePortalOpen } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'The Society', path: '/society' },
    { name: 'Universal Night', path: '/universal-night' },
    { name: 'Contact', path: '/contact' },
  ];

  const { society } = config;
  const logoSrc = society?.logos?.asdrcLogo || './asdrc-logo.png';

  const cleanVal = (val) => String(val || '').replace(/^\[|\]$/g, '').trim();
  const toHref = (val) => {
    const cleaned = cleanVal(val);
    if (!cleaned) return '#';
    return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      {/* Sticky Minimal Navigation: transparent at top, solid lifted dark surface on scroll */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 no-print ${scrolled || mobileMenuOpen
            ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#A7CFF2]/15 py-2.5'
            : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Identity: Only clickable ASDRC Logo, slightly larger */}
          <Link
            to="/"
            aria-label="ASDRC Home"
            className="inline-flex items-center group focus:outline-none"
          >
            <img
              src={logoSrc}
              alt="ASDRC Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Tablet & Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-9" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-display text-sm font-medium tracking-wide transition-colors relative py-1.5 ${isActive ? 'text-[#F2E205]' : 'text-white/85 hover:text-[#A7CFF2]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#F2E205]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Highlighted Register Button */}
            <NavLink to="/register" className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm">
              <span>Register</span>
            </NavLink>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2.5 md:hidden">
            <NavLink to="/register" className="btn-primary !py-2 !px-3.5 !min-h-[38px] text-xs">
              Register
            </NavLink>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-lg border border-[#A7CFF2]/30 flex items-center justify-center text-[#A7CFF2] hover:text-white hover:border-[#F2E205] transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Small Tablet Full-Width Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D0D0D] border-b border-[#A7CFF2]/20 px-4 pt-3 pb-6 mt-2">
            <div className="divide-y divide-[#A7CFF2]/10 border-t border-b border-[#A7CFF2]/10">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-3.5 px-2 font-display text-base font-medium transition-colors ${isActive ? 'text-[#F2E205]' : 'text-white hover:text-[#A7CFF2]'
                    }`
                  }
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#A7CFF2]/60" />
                </NavLink>
              ))}
            </div>

            <div className="pt-4">
              <NavLink to="/register" className="btn-primary w-full justify-center text-sm">
                <span>Register for UN &apos;27</span>
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Global Footer */}
      <footer className="bg-[#11141C] border-t border-[#A7CFF2]/15 text-white pt-14 sm:pt-16 pb-10 sm:pb-12 no-print relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#A7CFF2]/15">
            {/* Column 1: Society Identity */}
            <div className="md:col-span-2 lg:col-span-5 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={logoSrc}
                  alt="ASDRC Logo"
                  className="w-14 h-14 object-contain shrink-0"
                />
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                    Astronomical Society of Dharmaraja College
                  </h3>
                  <p className="text-[#A7CFF2] text-xs sm:text-sm italic mt-0.5">
                    Looking beyond the horizon since 1996.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-3 space-y-3">
              <div className="section-label">Quick Links</div>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm">
                <li>
                  <Link to="/" className="text-white/85 hover:text-[#F2E205] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/society" className="text-white/85 hover:text-[#F2E205] transition-colors">
                    The Society
                  </Link>
                </li>
                <li>
                  <Link to="/universal-night" className="text-white/85 hover:text-[#F2E205] transition-colors">
                    Universal Night
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/85 hover:text-[#F2E205] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white/85 hover:text-[#F2E205] transition-colors">
                    Registration
                  </Link>
                </li>
                <li>
                  <Link to="/register?step=1" className="text-[#A7CFF2] hover:text-[#F2E205] transition-colors">
                    Rules and Regulations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Socials */}
            <div className="lg:col-span-4 space-y-4">
              <div className="section-label">Contact</div>
              <div className="space-y-2 text-sm text-white/90 leading-relaxed">
                <p className="text-[#A7CFF2]">
                  Astronomical Society of Dharmaraja College, Dharmaraja College, Kandy, Sri Lanka.
                </p>
                <p>
                  <span className="text-[#A7CFF2]">Email: </span>
                  <a
                    href={`mailto:${cleanVal(society.email)}`}
                    className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/30 underline-offset-4"
                  >
                    {cleanVal(society.email)}
                  </a>
                </p>
                <p>
                  <span className="text-[#A7CFF2]">Phone (MIC): </span>
                  <a
                    href={`tel:${cleanVal(society.micPhone).replace(/\s+/g, '')}`}
                    className="text-white hover:text-[#F2E205] transition-colors"
                  >
                    {cleanVal(society.micPhone)}
                  </a>
                </p>
              </div>

              <div className="pt-1">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Facebook', val: society.socials?.facebook },
                    { label: 'Instagram', val: society.socials?.instagram },
                    { label: 'YouTube', val: society.socials?.youtube },
                    { label: "UN '27 WhatsApp", val: society.socials?.whatsapp, accent: true },
                  ].map((soc) => (
                    <a
                      key={soc.label}
                      href={toHref(soc.val)}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-display font-medium border transition-colors ${soc.accent
                          ? 'bg-[#F2E205]/10 border-[#F2E205]/50 text-[#F2E205] hover:bg-[#F2E205] hover:text-[#0D0D0D]'
                          : 'bg-[#0D0D0D] border-[#A7CFF2]/25 text-[#A7CFF2] hover:border-[#A7CFF2] hover:text-white'
                        }`}
                    >
                      <span>{soc.label}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Committee Editor Trigger */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A7CFF2]/80">
            <p className="leading-relaxed">
              &copy; 2026 Astronomical Society of Dharmaraja College. A student-initiated society of Dharmaraja College, Kandy. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => setIsCommitteePortalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-[#0D0D0D] border border-[#A7CFF2]/25 text-[#A7CFF2] hover:border-[#F2E205] hover:text-[#F2E205] transition-colors shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Committee Editor &amp; Handover</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
