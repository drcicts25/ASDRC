import React, { createContext, useContext, useState, useEffect } from 'react';
import initialConfig from '../data/siteConfig.json';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommitteePortalOpen, setIsCommitteePortalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.society) {
          setConfig(data);
        }
      })
      .catch(() => {
        // Fallback to bundled siteConfig.json if backend is offline
      });
  }, []);

  const updateConfig = async (updatedConfig) => {
    setIsSaving(true);
    setConfig(updatedConfig);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
      if (res.ok) {
        const result = await res.json();
        setConfig(result.config);
      }
    } catch (e) {
      // Saved in local state
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        isSaving,
        isCommitteePortalOpen,
        setIsCommitteePortalOpen,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return ctx;
}
