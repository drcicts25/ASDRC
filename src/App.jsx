import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SocietyPage } from './pages/SocietyPage';
import { UniversalNightPage } from './pages/UniversalNightPage';
import { ContactPage } from './pages/ContactPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { CommitteePortalModal } from './components/CommitteePortalModal';
import { BootSplashScreen } from './components/BootSplashScreen';

function SeoTitleUpdater() {
  const { pathname } = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'ASDRC | Astronomical Society of Dharmaraja College — Where Curiosity Meets the Cosmos',
      '/society': 'Our Story | The Astronomical Society of Dharmaraja College (ASDRC)',
      '/universal-night': "Universal Night '27 | Astronomical Society of Dharmaraja College",
      '/contact': 'Get in Touch & Meet the Committee | ASDRC Kandy',
      '/register': "UN '27 Competition Rules & Registration | ASDRC",
    };
    document.title =
      titles[pathname] ||
      'ASDRC | Astronomical Society of Dharmaraja College — Universal Night 2027';
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <SiteConfigProvider>
      <BootSplashScreen />
      <HashRouter>
        <SeoTitleUpdater />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/society" element={<SocietyPage />} />
            <Route path="/universal-night" element={<UniversalNightPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </Layout>
        <CommitteePortalModal />
      </HashRouter>
    </SiteConfigProvider>
  );
}
