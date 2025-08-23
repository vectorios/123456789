// app/welcome/[colorHex]/WelcomeUI.tsx

'use client'; // <-- La directive est maintenant en PREMIÈRE LIGNE !

import Link from 'next/link';
import { motion } from 'framer-motion';

type ColorData = {
  name: string;
  hex_code: string;
};

const getTextColor = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-slate-900' : 'text-white';
};

export default function WelcomeUI({ colorData }: { colorData: ColorData }) {
  const textColorClass = getTextColor(colorData.hex_code);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <motion.div
            className="flex h-64 w-full items-center justify-center p-8"
            style={{ backgroundColor: colorData.hex_code }}
            initial={{ height: 0 }}
            animate={{ height: '16rem' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <motion.p 
              className={`text-4xl font-mono font-bold ${textColorClass}`}
              style={{ mixBlendMode: 'difference' }}
              variants={itemVariants}
            >
              {colorData.hex_code}
            </motion.p>
          </motion.div>

          <div className="p-10">
            <motion.p className="text-xl text-slate-600" variants={itemVariants}>
              Welcome, Guardian. You have been granted:
            </motion.p>
            <motion.h1 className="my-2 text-5xl md:text-7xl font-bold tracking-tight text-slate-900" variants={itemVariants}>
              {colorData.name}
            </motion.h1>
            <motion.p className="text-lg text-slate-500" variants={itemVariants}>
              This color is now part of your unique collection.
            </motion.p>
            
            <motion.div className="mt-10" variants={itemVariants}>
              <Link
                href="/dashboard"
                className="inline-block transform rounded-lg bg-slate-900 px-10 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Enter My Gallery
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}