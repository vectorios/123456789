// app/page.tsx
'use client';

import Link from 'next/link';
// CHANGEMENT : framer-motion a été complètement retiré
import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

// --- Composant d'Icône (sans animation pour simplifier) ---
const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 shadow-lg">
    {children}
  </div>
);

// --- Fonctions des Drapeaux ---
const FLAG_CELL_SIZE_VW_DESKTOP = 0.7; const FLAG_ROWS_PER_FLAG_USA = 10; const FLAG_COLS_PER_FLAG_USA = 25; const FLAG_ROWS_PER_FLAG_MOROCCO = 10; const FLAG_COLS_PER_FLAG_MOROCCO = 20; const FLAG_ROWS_PER_FLAG_CHINA = 10; const FLAG_COLS_PER_FLAG_CHINA = 25;
const getUSAFlagColor = (r: number, c: number): string => { const R = '#B22234', W = '#FFFFFF', B = '#3C3B6E'; const cW = Math.floor(FLAG_COLS_PER_FLAG_USA * (2 / 5)), cH = Math.floor(FLAG_ROWS_PER_FLAG_USA / 2); if (r < cH && c < cW) { if ((r + c) % 2 === 0) return W; return B; } return r % 2 === 0 ? R : W; };
const getMoroccoFlagColor = (r: number, c: number): string => { const R = '#C1272D', G = '#006233'; const cX = FLAG_COLS_PER_FLAG_MOROCCO / 2 - 0.5, cY = FLAG_ROWS_PER_FLAG_MOROCCO / 2 - 0.5; const rad = Math.min(FLAG_COLS_PER_FLAG_MOROCCO, FLAG_ROWS_PER_FLAG_MOROCCO) * 0.25; if (Math.sqrt(Math.pow(r - cY, 2) + Math.pow(c - cX, 2)) < rad) { if (Math.cos(5 * Math.atan2(r - cY, c - cX)) > 0.6) return G; } return R; };
const getChinaFlagColor = (r: number, c: number): string => { const R = '#EE1C25', Y = '#FFFF00'; const stars = [{ r: 2, c: 3, size: 2 }, { r: 1, c: 6, size: 1 }, { r: 3, c: 7, size: 1 }, { r: 5, c: 6, size: 1 }, { r: 6, c: 4, size: 1 },]; for (const s of stars) { if (Math.sqrt(Math.pow(r - s.r, 2) + Math.pow(c - s.c, 2)) < s.size) return Y; } return R; };

// --- Composant Principal de la Page d'Accueil ---
export default function HomePage() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang] || translations.en;

  // CHANGEMENT : Les variantes d'animation ont été supprimées.

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar t={t} />

      <main className="flex-grow">
        <section className="relative flex items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden p-6 text-center bg-white">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(199,_210,_254,_0.5),_rgba(255,255,255,0))]"></div>
          {/* CHANGEMENT : <motion.div> est devenu un <div> normal */}
          <div className="z-10 max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-7xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700">{t.heroTitle}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-md text-slate-600 md:text-lg">{t.heroDescription}</p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/inscription" className="transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105">{t.heroClaimCTA}</Link>
              <Link href="/marketplace" className="font-semibold text-purple-600 transition-colors hover:text-purple-800">{t.heroExploreCTA}</Link>
            </div>
            <p className="mt-10 text-sm text-slate-500">{t.heroJoinText}</p>
          </div>
        </section>

        <section className="py-16 px-6 md:py-20 bg-slate-100">
           <div className="container mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                   <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-6">{t.section1Title}</h2>
                   <p className="text-md text-slate-600 mb-4">{t.section1Paragraph1}</p>
                   <p className="text-md text-slate-600">{t.section1Paragraph2}</p>
                </div>
                {/* CHANGEMENT : Ajout d'une transition CSS simple pour l'image */}
                <div className="overflow-hidden rounded-xl">
                    <Image src="https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Vibrant Colors" width={600} height={400} className="rounded-xl shadow-2xl object-cover w-full h-80 transition-transform duration-500 ease-in-out hover:scale-110" />
                </div>
              </div>
           </div>
        </section>

        <section className="py-16 px-6 md:py-20 bg-white">
           <div className="container mx-auto p-8 bg-slate-50 rounded-2xl shadow-xl border border-slate-200">
              <div className="text-center max-w-3xl mx-auto">
                 <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-700 mb-6">{t.flagsTitle}</h2>
                 <p className="mb-4 text-md text-slate-600">{t.flagsText1}</p>
                 <p className="text-md font-semibold text-slate-800">{t.flagsText3}</p>
              </div>
              <div className="mt-12 flex justify-center items-center gap-4 md:gap-8 flex-wrap">
                {[ { name: 'USA', cols: FLAG_COLS_PER_FLAG_USA, rows: FLAG_ROWS_PER_FLAG_USA, func: getUSAFlagColor }, { name: 'MAROC', cols: FLAG_COLS_PER_FLAG_MOROCCO, rows: FLAG_ROWS_PER_FLAG_MOROCCO, func: getMoroccoFlagColor }, { name: 'CHINE', cols: FLAG_COLS_PER_FLAG_CHINA, rows: FLAG_ROWS_PER_FLAG_CHINA, func: getChinaFlagColor } ].map(flag => (
                    // CHANGEMENT : Ajout d'une transition au survol
                    <div key={flag.name} className="p-3 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                        <p className="text-sm font-semibold mb-2 text-slate-700 text-center">{flag.name}</p>
                        <div className="grid" style={{ gridTemplateColumns: `repeat(${flag.cols}, ${FLAG_CELL_SIZE_VW_DESKTOP}vw)` }}>
                            {Array.from({ length: flag.rows * flag.cols }).map((_, i) => (<div key={`${flag.name}-${i}`} className="aspect-square" style={{ backgroundColor: flag.func(Math.floor(i / flag.cols), i % flag.cols) }} />))}
                        </div>
                    </div>
                ))}
              </div>
           </div>
        </section>

        <section className="py-16 px-6 md:py-20 bg-slate-100">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{t.section2Title}</h2>
              <p className="mx-auto mt-4 text-md text-slate-600">{t.section2Paragraph1}</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* CHANGEMENT : Les cartes ont déjà des transitions CSS, c'est parfait. */}
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg></FeatureIcon>
                <h3 className="text-xl font-bold text-slate-800">{t.feature1Title}</h3><p className="mt-2 text-sm text-slate-600">{t.feature1Text}</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                 <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg></FeatureIcon>
                <h3 className="text-xl font-bold text-slate-800">{t.feature2Title}</h3><p className="mt-2 text-sm text-slate-600">{t.feature2Text}</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg></FeatureIcon>
                <h3 className="text-xl font-bold text-slate-800">{t.feature3Title}</h3><p className="mt-2 text-sm text-slate-600">{t.feature3Text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:py-20 bg-white">
          <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">{t.section3Title}</h2>
                  <p className="mx-auto mt-4 text-md text-slate-600">{t.section3Paragraph2}</p>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {[ { title: t.collectorsTitle, text: "Embark on a hunt for iconic colors. Assemble unparalleled palettes that reflect your unique vision and become the owner of a tangible fragment of digital history.", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg> }, { title: t.creatorsTitle, text: "Unleash your imagination: use your colors to mint original digital art, design visual themes, and launch exclusive lines of physical products.", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg> }, { title: t.brandsTitle, text: "Secure your brand's definitive visual identity by owning its official colors. Possessing your unique color in ColorVerse is the ultimate statement of brand identity in the digital age.", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }, { title: t.developersTitle, text: "Leverage our open API to build groundbreaking applications where color ownership becomes a core game mechanic, a central feature, or a transformative utility.", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg> } ].map(item =>(
                      <div key={item.title} className="rounded-xl bg-slate-50 p-6 shadow-lg border hover:-translate-y-2 transition-transform duration-300">
                          <div className="flex items-center space-x-4 mb-3"><div className="bg-orange-100 text-orange-600 p-2 rounded-lg">{item.icon}</div><h3 className="text-lg font-bold text-slate-800">{item.title}</h3></div>
                          <p className="text-sm text-slate-600">{item.text}</p>
                      </div>
                  ))}
              </div>
          </div>
        </section>

        <section className="bg-white py-16 px-6 md:py-20" id="faq">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">{t.faqTitle}</h2>
                    <p className="mx-auto mt-4 text-md text-slate-600">{t.faqParagraph1}</p>
                </div>
                <div className="mt-12 space-y-4">
                    <FAQItem title="Is this a cryptocurrency or blockchain-based?">{"No. This is a deliberate choice. ColorVerse is built on scalable web technologies to guarantee an exceptional user experience without the frictions of blockchain, such as gas fees or complex wallets."}</FAQItem>
                    <FAQItem title="Difference between #FF0000 and #FE0000?">{"Functionally, they are two distinct digital assets. Aesthetically, they are almost identical. This creates a fascinating market dynamic, allowing for both exclusive luxury collection and broad mass accessibility."}</FAQItem>
                    <FAQItem title="How does the marketplace work?">{"It's a peer-to-peer platform. To ensure sustainability, we collect a modest transaction fee of 7% from the seller upon a successful sale. There are no fees for listing or browsing."}</FAQItem>
                    <FAQItem title="Is my asset likely to be lost?">{"Ownership is securely linked to your account. As long as you maintain control over your credentials (using a strong password), your digital assets are safe. We've implemented state-of-the-art security practices."}</FAQItem>
                    <FAQItem title="Are ColorVerse colors a financial security?">{"No. ColorVerse assets must be considered unique digital collectibles, not speculative investments. Their value is subject to market dynamics and there is no guarantee of financial return. Participate for the passion, not for speculation."}</FAQItem>
                </div>
            </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6 text-center text-white">
          <div className="container mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight">{t.finalCtaTitle}</h2>
            <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6 text-lg font-medium">
              <span>{t.finalCtaTagline1}</span><span>{t.finalCtaTagline2}</span><span>{t.finalCtaTagline3}</span>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-md text-blue-100">{t.finalCtaParagraph}</p>
            <div className="mt-10">
              <Link href="/inscription" className="transform rounded-full bg-white px-10 py-4 text-lg font-bold text-blue-700 shadow-2xl transition-transform hover:scale-105 hover:bg-slate-200">{t.finalCtaButton}</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}

// CHANGEMENT : FAQItem simplifié. L'animation fluide est retirée pour garantir le build.
function FAQItem({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border rounded-lg overflow-hidden bg-slate-50/50 border-slate-200">
            <button className="flex w-full items-center justify-between text-left p-4" onClick={() => setIsOpen(!isOpen)}>
                <span className="text-md font-semibold text-slate-800">{title}</span>
                {/* CHANGEMENT : Ajout d'une transition CSS à l'icône */}
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            {/* CHANGEMENT : Le contenu s'affiche ou se masque instantanément */}
            {isOpen && (
                <div className="overflow-hidden">
                    <p className="text-slate-600 text-md p-4 pt-0">{children}</p>
                </div>
            )}
        </div>
    );
}