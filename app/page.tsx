// app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';


const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">{children}</div>
);

// Checkmark for comparison tables and feature lists
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);

// X Icon for comparison tables
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

// Main Homepage Component
export default function HomePage() {
  const [hoveredColor, setHoveredColor] = useState('#3C3B6E'); // Start with USA blue

  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const getColorForCell = (index: number): string => {
    const row = Math.floor(index / 16);
    const col = index % 16;

    const USA_RED = '#B22234';
    const USA_WHITE = '#FFFFFF';
    const USA_BLUE = '#3C3B6E';
    const CHINA_RED = '#EE1C25';
    const CHINA_YELLOW = '#FFFF00';

    if (row < 8) {
      if (row < 4 && col < 6) {
        return USA_BLUE;
      }
      if (row % 2 === 0) {
        return USA_RED; // Even rows are red
      } else {
        return USA_WHITE; // Odd rows are white
      }
    } 
    else {
      const starPositions = [
        { r: 9, c: 2 },   // Large star
        { r: 8, c: 5 },   // Small star 1
        { r: 10, c: 6 },  // Small star 2
        { r: 12, c: 5 },  // Small star 3
        { r: 13, c: 3 }   // Small star 4
      ];
      if (starPositions.some(pos => pos.r === row && pos.c === col)) {
        return CHINA_YELLOW;
      }
      return CHINA_RED;
    }
  };

  return (
    <div className="bg-white text-slate-900 antialiased">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 text-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(199,_210,_254,_0.3),_rgba(255,255,255,0))]"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="z-10">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-8xl">
            Own a Color. <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Build an Empire.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
            Welcome to ColorVerse, the world's first platform where all 16.7 million sRGB colors are unique, ownable digital assets.
            This isn't just a project; it's the foundation of a new, universally accessible creator economy.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/inscription"
              className="transform rounded-lg bg-slate-900 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-transform hover:scale-105 hover:bg-slate-800"
            >
              Claim Your First Color - Free
            </Link>
            <Link href="/marketplace" className="text-lg font-semibold text-purple-600 transition-colors hover:text-purple-800">
              Explore the Live Marketplace →
            </Link>
          </div>
          <motion.p 
            className="mt-12 text-slate-500"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }}
          >
            Join <span className="font-semibold text-slate-700">thousands</span> of Guardians already building their collections.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-20 px-8 md:py-32 text-center bg-slate-50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn}>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">A Universe of Meaning in Every Pixel.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            Color is a universal language of culture, identity, and power. In ColorVerse, you don't just own a code; you own a symbol.
          </p>
        </motion.div>
        <motion.div 
            className="mt-16 max-w-4xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn}
        >
            <div className="w-full h-48 md:h-64 rounded-xl shadow-2xl transition-colors duration-300" style={{ backgroundColor: hoveredColor }}></div>
            <p className="mt-6 text-2xl font-mono font-bold tracking-widest">{hoveredColor.toUpperCase()}</p>
            <p className="text-slate-500">This asset is unique in the universe.</p>
        </motion.div>
        <motion.div 
            className="mt-12 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 max-w-4xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.005 } } }}
        >
            {Array.from({ length: 256 }).map((_, i) => {
                const cellColor = getColorForCell(i);
                return (
                    <motion.div 
                        key={i} 
                        className="aspect-square rounded-sm cursor-pointer transition-transform hover:scale-150 hover:z-10"
                        style={{ backgroundColor: cellColor, border: '1px solid rgba(255,255,255,0.2)' }}
                        onMouseEnter={() => setHoveredColor(cellColor)}
                        variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
                    />
                );
            })}
        </motion.div>
      </section>
      
      <section className="py-20 px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">From Pixels to Portfolios: The ColorVerse Thesis</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
              ColorVerse sits at the intersection of three powerful market trends: digital collectibles, the creator economy, and the search for accessible, meaningful assets. This is not just art; it's infrastructure.
            </p>
          </motion.div>
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, delay: 0.1 }} variants={fadeIn}>
              <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></FeatureIcon>
              <h3 className="text-2xl font-bold">Digital Real Estate</h3>
              <p className="mt-2 text-slate-600">Think of colors like domain names or plots of land in a digital city. They are finite, foundational, and their value grows as the ecosystem builds upon them. You're not buying a JPEG; you're securing a piece of the internet's fundamental fabric.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, delay: 0.2 }} variants={fadeIn}>
               <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></FeatureIcon>
              <h3 className="text-2xl font-bold">A Platform, Not a Product</h3>
              <p className="mt-2 text-slate-600">The colors themselves are just the first layer. The true value comes from the economic and creative platform we are building on top: palette creation, merchandise integration, faction rivalries, and a developer API. Your asset becomes more valuable as the platform grows.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, delay: 0.3 }} variants={fadeIn}>
              <FeatureIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></FeatureIcon>
              <h3 className="text-2xl font-bold">Market-Driven Value</h3>
              <p className="mt-2 text-slate-600">Unlike centrally-priced items, the value of every color is discovered on our open, transparent marketplace. A color's price is a direct reflection of its rarity, aesthetic appeal, historical significance, and cultural relevance (its Influence Score).</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">More Than an Asset, It's an Identity.</h2>
                <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">ColorVerse is a platform for everyone who understands the power of aesthetics, community, and ownership.</p>
            </motion.div>
            <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h3 className="text-2xl font-bold">For Collectors</h3>
                    <p className="mt-4 text-slate-600">Hunt for iconic colors, assemble aesthetically perfect palettes, and own a piece of digital history. Your gallery is your museum.</p>
                </div>
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h3 className="text-2xl font-bold">For Creators</h3>
                    <p className="mt-4 text-slate-600">Use your owned colors to mint unique digital art, design themes, and launch physical merchandise. Your colors are your brand.</p>
                </div>
                 <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h3 className="text-2xl font-bold">For Brands</h3>
                    <p className="mt-4 text-slate-600">Secure your brand's official colors (`#1DA1F2` for Twitter, `#FF0000` for Netflix). Owning your color is the ultimate statement of brand identity in the digital age.</p>
                </div>
                 <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h3 className="text-2xl font-bold">For Developers</h3>
                    <p className="mt-4 text-slate-600">Leverage our future API to build applications where color ownership matters. Imagine a game where your character's gear color is determined by your ColorVerse assets.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="py-20 px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
                  <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Built for Scale, Security, and Simplicity.</h2>
                  <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
                      We chose a rock-solid, modern tech stack to ensure a seamless experience that can grow to millions of users without the friction of blockchain.
                  </p>
              </motion.div>
              <div className="mt-20 grid md:grid-cols-3 gap-12 text-center">
                  <div>
                      <h3 className="text-2xl font-bold">Scalable Backend by Supabase</h3>
                      <p className="mt-2 text-slate-600">Our entire ledger of color ownership is managed by a high-performance Postgres database, ensuring millisecond response times and ironclad data integrity.</p>
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold">Blazing-Fast Frontend by Vercel</h3>
                      <p className="mt-2 text-slate-600">The site is built with Next.js and hosted on Vercel's global edge network, delivering an instant, responsive experience anywhere in the world.</p>
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold">Secure Payments by Stripe</h3>
                      <p className="mt-2 text-slate-600">All marketplace transactions are handled by Stripe, the gold standard in online payments, ensuring your financial data is always secure. (Future integration)</p>
                  </div>
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-24 rounded-2xl bg-slate-50 p-12 text-center">
                  <h3 className="text-3xl font-bold">Our Foundational Promise</h3>
                  <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-700">
                      "We are not just builders; we are guardians of this new economy. Our commitment is absolute: the supply of colors will never change. The platform will be governed by fairness and transparency. The community's creativity will be our most valued asset. We are in this for the long-term, to build a universe that outlasts us all."
                  </p>
                  <p className="mt-6 font-semibold text-slate-900">- The Founders of ColorVerse</p>
              </motion.div>
          </div>
      </section>

      <section className="bg-slate-50 py-20 px-8 md:py-32">
          <div className="mx-auto max-w-4xl">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
                  <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Your Questions, Answered.</h2>
              </motion.div>
              <div className="mt-16 space-y-8">
                  <FAQItem title="Is this a cryptocurrency or on a blockchain?">No. Deliberately. ColorVerse is built on scalable, centralized web technologies to ensure a fast, user-friendly experience without gas fees, wallet complexities, or significant environmental impact. Ownership is secured and verified within our robust database architecture, providing all the benefits of ownership without the barriers.</FAQItem>
                  <FAQItem title="What's the difference between owning `#FF0000` and `#FE0000`?">Functionally, they are two distinct, unique assets in the ColorVerse ledger. Aesthetically, they are nearly identical. This creates a fascinating market dynamic. While `#FF0000` (Pure Red) is an iconic, "named" color and likely highly valuable, its neighbor might be an affordable entry point for someone who loves red. This allows for both high-end collecting and mass accessibility.</FAQItem>
                  <FAQItem title="How does the marketplace work and what are the fees?">The marketplace is a peer-to-peer platform. Owners can list their colors for a fixed price or, in the future, via auction. To sustain the platform, we take a small, transparent transaction fee (e.g., 2.5%) from the seller upon a successful sale. There are no fees for listing or browsing.</FAQItem>
                  <FAQItem title="Can I lose my color?">Your ownership is tied to your secure account. As long as you maintain control of your account credentials (using a strong, unique password), your assets are safe. We use industry-standard security practices to protect all user accounts.</FAQItem>
                  <FAQItem title="Is this a financial security?">ColorVerse assets should be considered digital collectibles. Their value is subject to market dynamics and there is no guarantee of financial return. Please collect responsibly. This is a platform for art, community, and creativity first and foremost.</FAQItem>
              </div>
          </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 px-8 text-center text-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-5xl font-extrabold tracking-tight">Your Legacy Starts With a Single Color.</h2>
          <div className="mt-8 flex justify-center items-center gap-8 text-lg">
            <span>✓ Absolute Scarcity</span>
            <span>✓ Ground-Floor Opportunity</span>
            <span>✓ A Thriving Community</span>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-indigo-100">
            History is being written. The foundational assets of this new universe are being claimed right now.
            Registration is free, your first color is a gift, and the opportunity is immense. Don't be a footnote in the story of ColorVerse. Be a founder.
          </p>
          <div className="mt-12">
            <Link
              href="/inscription"
              className="transform rounded-lg bg-white px-12 py-5 text-xl font-bold text-purple-700 shadow-2xl transition-transform hover:scale-105 hover:bg-slate-200"
            >
              Become a Guardian. Shape the Future.
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function FAQItem({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 pb-4">
            <button className="flex w-full items-center justify-between text-left py-2" onClick={() => setIsOpen(!isOpen)}>
                <span className="text-xl font-semibold text-slate-800">{title}</span>
                <span className={`transform text-purple-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, marginTop: isOpen ? '16px' : '0px', opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="text-slate-600 text-lg">{children}</p>
            </motion.div>
        </div>
    );
}