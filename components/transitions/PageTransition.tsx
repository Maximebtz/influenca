'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isPresent, setIsPresent] = useState(true);

  useEffect(() => {
    setIsPresent(false);
    const timer = setTimeout(() => {
      setIsPresent(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence mode='wait'>
        {isPresent && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 