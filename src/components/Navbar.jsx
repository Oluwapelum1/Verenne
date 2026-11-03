import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data';
import { EASE, ProductImage, VerenneLogo } from './ui';
import AnnouncementBar from './AnnouncementBar';
import { scrollToId, lockScroll } from '../lib/scroll';

const LINKS = [
  { label: 'Collection', id: 'collection' },
  { label: 'Ritual', id: 'ritual' },
  { label: 'Origins', id: 'origins' },
  { label: 'FAQ', id: 'faq' }
];

export default function Navbar({ onOpenProduct }) {
  const { totalItemsCount, setIsCartOpen, bagBounce } = useCart();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 300 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id, e) => {
    e?.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), 450);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[120]"
      >
        <AnnouncementBar />
        <div className="px-3 pt-2.5 sm:px-6 sm:pt-3">
          <nav
            className={`mx-auto flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              scrolled || open ? 'glass' : 'border border-transparent'
            }`}
            aria-label="Main"
          >
          <a href="#top" onClick={(e) => go('top', e)} className="group flex shrink-0 items-center" aria-label="Verenne home">
            <VerenneLogo markClassName="h-7 w-7" />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => go(l.id, e)} className="group relative text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              type="button"
              onClick={() => setIsCartOpen(true)}
              animate={bagBounce ? { scale: [1, 1.18, 0.94, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-9 items-center gap-2 rounded-full border border-[var(--border-strong)] px-3.5 text-[12px] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]"
              aria-label={`Open bag, ${totalItemsCount} items`}
            >
              Bag
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--text-primary)] px-1 font-mono text-[10px] text-[var(--accent-ink)]">
                {totalItemsCount}
              </span>
            </motion.button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-9 items-center gap-2 rounded-full bg-[var(--text-primary)] px-3.5 text-[12px] text-[var(--accent-ink)]"
            >
              <span className="relative block h-2 w-3.5">
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
        </div>
      </motion.header>

      {/* Full-screen index */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[110] overflow-y-auto bg-[var(--bg-primary)]"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            data-lenis-prevent
          >
            <div className="mx-auto grid min-h-full max-w-[1600px] grid-cols-1 gap-10 px-5 pb-10 pt-28 sm:px-10 lg:grid-cols-12">
              {/* Sections */}
              <div className="lg:col-span-4">
                <p className="label mb-6">Navigate</p>
                <ul className="space-y-1">
                  {LINKS.map((l, i) => (
                    <li key={l.id} className="overflow-hidden">
                      <motion.a
                        href={`#${l.id}`}
                        onClick={(e) => go(l.id, e)}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: EASE }}
                        className="group flex items-baseline gap-3 font-serif text-5xl leading-[1.05] transition-colors hover:text-[var(--accent)] sm:text-6xl"
                      >
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">0{i + 1}</span>
                        <span className="transition-transform duration-500 group-hover:translate-x-2 group-hover:italic">{l.label}</span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product index with image reveal */}
              <div className="lg:col-span-5">
                <p className="label mb-6">Index — 16 formulations</p>
                <ul className="border-t border-[var(--border-subtle)]">
                  {PRODUCTS.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.7, ease: EASE }}
                      className="border-b border-[var(--border-subtle)]"
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setHover(p)}
                        onFocus={() => setHover(p)}
                        onClick={() => {
                          setOpen(false);
                          onOpenProduct(p);
                        }}
                        className="group flex w-full items-center justify-between gap-4 py-4 text-left"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-[11px] text-[var(--text-muted)]">{p.no}</span>
                          <span className="font-serif text-2xl transition-all duration-500 group-hover:translate-x-1 group-hover:italic sm:text-3xl">{p.name}</span>
                        </span>
                        <span className="flex items-center gap-4">
                          <span className="label hidden sm:inline">{p.category}</span>
                          <span className="font-mono text-[12px] tabular-nums">${p.price}</span>
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="relative hidden lg:col-span-3 lg:block">
                <div className="sticky top-28 aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={(hover || PRODUCTS[0]).id}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <ProductImage product={hover || PRODUCTS[0]} className="h-full w-full object-cover" sizes="25vw" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
