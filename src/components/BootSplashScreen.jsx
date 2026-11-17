import React, { useState, useEffect } from 'react';

/**
 * BootSplashScreen
 * Animates the exact, unmodified /asdrc-logo.png ONLY once when a visitor enters the website,
 * and never on internal page-to-page navigation.
 */
export function BootSplashScreen() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('asdrc_boot_shown') !== 'true';
    } catch {
      return true;
    }
  });
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!visible) return;

    // Lock scroll briefly during initial boot sequence
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2150);

    const finishTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('asdrc_boot_shown', 'true');
      } catch {
        // Ignore storage restrictions
      }
      document.body.style.overflow = originalOverflow;
      setVisible(false);
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0D0D0D] flex flex-col items-center justify-center select-none transition-opacity duration-500 ease-out no-print ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Astronomical Society of Dharmaraja College Website"
    >
      {/* Subtle Ambient Supernova Backdrop Glow behind the logo */}
      <div
        className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full opacity-40 blur-3xl transition-transform duration-1000"
        style={{
          background:
            'radial-gradient(circle, rgba(242,226,5,0.18) 0%, rgba(167,207,242,0.16) 40%, rgba(5,17,242,0.22) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Exact Unmodified Logo Container (1:1 aspect ratio matching 1024x1024 /asdrc-logo.png) */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* Layer 1: Upper Blue Orbital Arc of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-arc-upper"
        />

        {/* Layer 2: Lower Blue Orbital Arc of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-arc-lower"
        />

        {/* Layer 3: Central White ASDRC Wordmark of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-wordmark"
        />

        {/* Layer 4: Top-Left Gold Star of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-star-1"
        />

        {/* Layer 5: Top-Middle Gold Star of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-star-2"
        />

        {/* Layer 6: Bottom-Left Gold Star of /asdrc-logo.png */}
        <img
          src="./asdrc-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain boot-star-3"
        />

        {/* Layer 7: Full Unclipped /asdrc-logo.png locking in seamlessly once pieces assemble */}
        <img
          src="./asdrc-logo.png"
          alt="ASDRC Official Logo"
          className="absolute inset-0 w-full h-full object-contain boot-complete-logo"
        />
      </div>
    </div>
  );
}
