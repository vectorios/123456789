// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

// Le composant reçoit les traductions 't' en props
export default function Footer({ t }) {
  return (
    <footer className="bg-slate-200 py-12 px-6 text-slate-800">
      <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-md font-bold mb-4 text-slate-900">{t.footerExplore}</h3>
          <ul className="space-y-2">
            <li><Link href="/marketplace" className="text-slate-600 hover:text-purple-600">{t.footerMarket}</Link></li>
            <li><Link href="/dashboard" className="text-slate-600 hover:text-purple-600">{t.footerGallery}</Link></li>
            <li><Link href="/inscription" className="text-slate-600 hover:text-purple-600">{t.footerSignup}</Link></li>
            <li><Link href="/connexion" className="text-slate-600 hover:text-purple-600">{t.footerLogin}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-md font-bold mb-4 text-slate-900">{t.footerCommunity}</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerVerseFeed}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerFactionsSoon}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerFeaturedCreators}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-md font-bold mb-4 text-slate-900">{t.footerSupportLegal}</h3>
          <ul className="space-y-2">
            <li><Link href="/#faq" className="text-slate-600 hover:text-purple-600">{t.footerFAQ}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerContact}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerTerms}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerPrivacy}</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/logo.png" alt="ColorVerse Logo" width={150} height={30} style={{ objectFit: 'contain' }} className="mb-4"/>
          <p className="text-slate-600 mb-4 text-xs">{t.footerAbout}</p>
          <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} ColorVerse. {t.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}