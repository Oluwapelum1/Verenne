import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { lockScroll } from '../lib/scroll';
import { VerenneMark } from './ui';

/**
 * Preloader — a counter climbs while liquid gold rises inside the wordmark,
 * then the black curtain lifts away like a lid.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    lockScroll(true);
    const duration = reduced ? 300 : 1700;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setDone(true);
          lockScroll(false);
        }, reduced ? 0 : 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lockScroll(false);
    };
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={() => lockScroll(false)}>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-[var(--bg-primary)] p-5 sm:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden="true"
        >
          <div className="flex justify-between">
            <span className="label">Verenne®</span>
            <span className="label">Formulated slowly</span>
          </div>

          <div className="relative mx-auto flex flex-col items-center select-none">
            <div className="relative mb-6 h-14 w-14 sm:h-20 sm:w-20">
              <VerenneMark className="h-full w-full text-white/20" />
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(${100 - count}% 0 0 0)` }}>
                <VerenneMark className="h-full w-full text-[var(--accent)]" />
              </div>
            </div>
            {/* outline */}
            <span className="text-outline block font-serif text-[clamp(4rem,17vw,16rem)] italic leading-none tracking-[-0.04em]">
              Verenne
            </span>
            {/* gold fill rising with the counter */}
            <span
              className="absolute bottom-0 block font-serif text-[clamp(4rem,17vw,16rem)] italic leading-none tracking-[-0.04em] text-[var(--accent)]"
              style={{ clipPath: `inset(${100 - count}% 0 0 0)` }}
            >
              Verenne
            </span>
          </div>

          <div className="flex items-end justify-between">
            <span className="label max-w-[12rem]">Sixteen botanicals, distilled in small batches</span>
            <span className="font-mono text-[clamp(2.5rem,6vw,5rem)] leading-none tabular-nums text-[var(--text-primary)]">
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
