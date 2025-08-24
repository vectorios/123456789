// components/layout/Footer.tsx

import Link from 'next/link';
import Image from 'next/image';

// CORRECTION : Le type de la prop 't' est maintenant spécifié
export default function Footer({ t }: { t: any }) {
  return (
    <footer className="bg-slate-200 py-12 px-6 text-slate-800">
      <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/logo.png" alt="ColorVerse Logo" width={200} height={40} className="mb-4" />
          <p className="text-slate-600">{t.footerSlogan}</p>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.footerExplore}</h3>
          <ul className="space-y-2">
            <li><Link href="/marketplace" className="text-slate-600 hover:text-purple-600">{t.footerMarketplace}</Link></li>
            <li><Link href="/dashboard" className="text-slate-600 hover:text-purple-600">{t.footerGallery}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.footerAbout}</h3>
          <ul className="space-y-2">
            <li><Link href="/#faq" className="text-slate-600 hover:text-purple-600">{t.footerFAQ}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerCommunity}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.footerLegal}</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerTerms}</Link></li>
            <li><Link href="#" className="text-slate-600 hover:text-purple-600">{t.footerPrivacy}</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-10 text-xs text-slate-500 border-t border-slate-300 pt-6">
        <p>&copy; {new Date().getFullYear()} ColorVerse. {t.footerRights}</p>
      </div>
    </footer>
  );
}