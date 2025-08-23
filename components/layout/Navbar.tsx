// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// La Navbar reçoit 't' (l'objet de traduction) en props
export default function Navbar({ t }: { t: any }) {
  const { setCurrentLang } = useLanguage();
  const { data: session } = useSession();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // 't' est maintenant défini et peut être utilisé ici
  const menuItems = [
    { name: t.sidebarMenuMarket, href: "/marketplace" },
    { name: t.sidebarMenuGallery, href: "/dashboard" },
    { name: t.sidebarMenuVerse, href: "#" },
    { name: t.sidebarMenuFAQ, href: "/#faq" },
  ];

  const handleLangChange = (lang: string) => {
    setCurrentLang(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/images/logo.png" alt="ColorVerse Logo" width={200} height={40} style={{ objectFit: 'contain' }} />
            </Link>
          </div>

          <nav className="hidden md:flex md:space-x-8">
            {menuItems.map(item => (
              <Link key={item.name} href={item.href} className="font-medium text-slate-600 hover:text-purple-600 transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center text-slate-600 hover:text-purple-600">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502Z" /></svg>
              </button>
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button onClick={() => handleLangChange('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t.langEnglish}</button>
                      <button onClick={() => handleLangChange('ar')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t.langArabic}</button>
                      <button onClick={() => handleLangChange('zh')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t.langChinese}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {session?.user ? (
              <div className="relative">
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                  <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name || session.user.email}&background=random`} alt="User" width={32} height={32} className="rounded-full" />
                </button>
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b"><p className="text-sm font-medium text-gray-900 truncate">{session.user.name || session.user.email}</p></div>
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t.sidebarProfile}</Link>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t.sidebarLogout}</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/connexion" className="text-sm font-semibold text-slate-600 hover:text-purple-600">{t.sidebarLogin}</Link>
                <Link href="/inscription" className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">{t.sidebarSignup}</Link>
              </div>
            )}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden bg-white border-t border-slate-200">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {menuItems.map(item => ( <Link key={item.name} href={item.href} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-purple-600">{item.name}</Link>))}
                <div className="border-t border-slate-200 pt-4 mt-4 px-3 flex items-center space-x-4">
                  {!session && ( <> <Link href="/connexion" className="flex-1 text-center px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full">{t.sidebarLogin}</Link> <Link href="/inscription" className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full">{t.sidebarSignup}</Link> </> )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}