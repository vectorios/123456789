// app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// CHANGEMENT : framer-motion a été retiré
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLang } = useLanguage();
  const t = translations[currentLang] || translations.en;
  
  const [userColors, setUserColors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchColors = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/user/colors');
          if (!response.ok) {
            throw new Error('Failed to fetch colors');
          }
          const data = await response.json();
          setUserColors(data);
        } catch (err: any) {
          setError(t.errorColors);
          console.error("Fetch error:", err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchColors();
    }
  }, [status, t.errorColors]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-xl font-semibold text-slate-700">{t.loadingSession}</div>
      </div>
    );
  }

  // CHANGEMENT : Les variantes d'animation ont été supprimées.

  return (
    <div className="flex flex-col min-h-screen bg-slate-100" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar t={t} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* CHANGEMENT : <motion.div> remplacé par <div> */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 md:mb-0">{t.dashboardTitle}</h1>
          {session?.user && (
            <div className="flex items-center space-x-4 bg-white p-3 rounded-full shadow-sm border border-slate-200">
              <Image src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name || session.user.email}&background=random`} alt="Profile" width={40} height={40} className="rounded-full" />
              <div className={currentLang === 'ar' ? 'text-left' : 'text-right'}>
                <p className="font-semibold text-slate-700">{t.welcomeBack}</p>
                <p className="text-sm text-slate-500 truncate max-w-xs">{session.user.name || session.user.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                {t.myColors}
              </h2>
              
              {isLoading ? (
                <div className="text-center py-12"><p className="text-slate-500">{t.loadingColors}</p></div>
              ) : error ? (
                <div className="text-center py-12 text-red-500 font-semibold">{error}</div>
              ) : userColors.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userColors.map((color) => (
                    <div key={color.id} className="text-center p-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-full h-20 rounded-md mb-2 border" style={{ backgroundColor: color.hex_code }}></div>
                      <p className="font-mono text-sm font-semibold">{color.hex_code}</p>
                      {color.name && <p className="text-xs text-slate-500 truncate">{color.name}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed">
                  <p className="text-slate-500">{t.noColors}</p>
                  <Link href="/marketplace" className="mt-4 inline-block px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                    {t.exploreMarketplace}
                  </Link>
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.457c0-.621-.504-1.125-1.125-1.125H15M9.75 15.75l3-3m0 0l3 3m-3-3v-6m-1.5 6l-3 3" /></svg>
                {t.myPalettes}
              </h2>
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed">
                <p className="text-slate-500">{t.noPalettes}</p>
                 <button className="mt-4 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">{t.createPalette}</button>
              </div>
            </section>
          </div>

          <aside className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-fit">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
              {t.marketActivity}
            </h2>
            <div className="space-y-4">
              <div className="text-center py-8 text-slate-500"><p>{t.noTransactions}</p></div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-slate-700 mb-2">{t.myStats}</h3>
                <ul className="text-sm space-y-2 text-slate-600">
                    <li className="flex justify-between"><span>{t.colorsOwned}:</span> <span className="font-bold">{isLoading ? '...' : userColors.length}</span></li>
                    <li className="flex justify-between"><span>{t.palettesCreated}:</span> <span className="font-bold">0</span></li>
                    <li className="flex justify-between"><span>{t.totalValue}:</span> <span className="font-bold">$0.00</span></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}