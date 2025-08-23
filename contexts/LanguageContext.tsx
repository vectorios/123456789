// contexts/LanguageContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('colorverse-lang');
    if (storedLang) {
      setCurrentLang(storedLang);
    }
  }, []);

  const handleSetCurrentLang = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('colorverse-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang: handleSetCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};