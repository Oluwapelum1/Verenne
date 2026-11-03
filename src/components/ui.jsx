import React, { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useCart } from '../context/CartContext';

export const EASE = [0.16, 1, 0.3, 1];

/** Safely prepends Vite's base path for GitHub Pages and subfolder hosting */
export function resolveAsset(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/** Responsive product photo (webp 320/600/full) */
export function ProductImage({ product, className = '', sizes = '(max-width: 768px) 60vw, 30vw', eager = false, alt }) {
  const base = resolveAsset(product.image);
  return (
    <img
      src={`${base}-600.webp`}
      srcSet={`${base}-320.webp 320w, ${base}-600.webp 600w, ${base}.webp 1200w`}
      sizes={sizes}
      alt={alt ?? `${product.fullName} — ${product.subtitle}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`select-none ${className}`}
    />
  );
}

/** Text that slides up line-by-line from a mask when it enters the viewport */
export function RevealText({ children, as: Tag = 'span', className = '', delay = 0, once = true }) {
  const MotionTag = motion[Tag] || motion.span;
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <MotionTag
        className={`block ${className}`}
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once, margin: '-10% 0px' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </MotionTag>
    </span>
  );
}

/** Splits a string into words & characters that rise in sequence without ever breaking words across lines. */
export function SplitChars({ text, className = '', stagger = 0.02, delay = 0 }) {
  const words = text.split(' ');
  let charOffset = 0;

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={text} className="inline-block" aria-hidden="true">
          {words.map((word, wIdx) => {
            const wordChars = Array.from(word);
            return (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {wordChars.map((ch) => {
                  const idx = charOffset++;
                  return (
                    <span key={idx} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '105%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-105%', transition: { duration: 0.35, delay: idx * 0.008, ease: EASE } }}
                        transition={{ duration: 0.75, delay: delay + idx * stagger, ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  );
                })}
                {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Button that is gently pulled toward the pointer */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}

/** Pill button with a liquid fill that wipes up on hover */
export function PillButton({ children, onClick, variant = 'solid', className = '', type = 'button', ...rest }) {
  const solid = variant === 'solid';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
        solid
          ? 'bg-[var(--text-primary)] text-[var(--accent-ink)]'
          : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--accent-ink)]'
      } ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${
          solid ? 'bg-[var(--accent)]' : 'bg-[var(--text-primary)]'
        }`}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

/** Flying thumbnail that arcs into the bag */
export function FlyToCartOverlay() {
  const { flyingItem } = useCart();
  if (!flyingItem) return null;

  const targetX = typeof window !== 'undefined' ? window.innerWidth - 56 : 1200;
  const targetY = 34;
  const img = flyingItem.product?.image;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <motion.div
        initial={{ x: flyingItem.startX, y: flyingItem.startY, scale: 1, opacity: 1 }}
        animate={{
          x: [flyingItem.startX, (flyingItem.startX + targetX) / 2, targetX],
          y: [flyingItem.startY, Math.min(flyingItem.startY, targetY) - 140, targetY],
          scale: [1, 0.7, 0.15],
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute -left-8 -top-10 h-20 w-16 overflow-hidden rounded-t-full rounded-b-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl"
      >
        {img && <img src={`${img}-320.webp`} alt="" className="h-full w-full object-cover" />}
      </motion.div>
    </div>
  );
}

/** Price with a vertical roll when it changes */
export function AnimatedPrice({ price, className = '' }) {
  return (
    <span className={`inline-flex items-baseline overflow-hidden ${className}`}>
      <span className="mr-[0.08em] text-[0.6em] opacity-70">$</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={price}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="inline-block tabular-nums"
        >
          {price}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Morphing liquid swatch — used to “show” a texture rather than describe it */
export function TextureBlob({ color, className = '' }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block ${className}`}
      style={{
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, ${color} 26%, ${color}AA 60%, rgba(0,0,0,0.4) 100%)`,
        boxShadow: `0 0 40px ${color}55, inset -6px -10px 18px rgba(0,0,0,0.35)`
      }}
      animate={{
        borderRadius: [
          '58% 42% 55% 45% / 46% 54% 46% 54%',
          '42% 58% 46% 54% / 56% 44% 58% 42%',
          '52% 48% 38% 62% / 42% 58% 44% 56%',
          '58% 42% 55% 45% / 46% 54% 46% 54%'
        ],
        rotate: [0, 40, -20, 0]
      }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/** Maison Verenne Haute-Apothecary Signature Crest Monogram */
export function VerenneMark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.5" />
      <path d="M50 11 L51.5 15 L50 16.5 L48.5 15 Z" fill="currentColor" />
      <circle cx="50" cy="87" r="1.5" fill="currentColor" />
      <path d="M30 30 H41 L50 72 L44.5 72 Z" fill="currentColor" />
      <path d="M68 30 H70.5 L51 74 L48.5 74 Z" fill="currentColor" />
      <path d="M27 29 H43 V31.5 H36 V31.5 Z" fill="currentColor" />
      <path d="M64 29 H73 V31.5 H69 V31.5 Z" fill="currentColor" />
      <polygon points="50,42 54,47 50,52 46,47" fill="currentColor" />
    </svg>
  );
}

/** Maison Verenne Haute-Apothecary Signature Brand Logo */
export function VerenneLogo({ withSubtitle = true, className = '', markClassName = 'h-6 w-6' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <VerenneMark className={`${markClassName} text-[var(--accent)] shrink-0`} />
      <div className="flex flex-col text-left">
        <span className="font-serif text-[1.35rem] tracking-[0.06em] leading-none text-[var(--text-primary)] font-normal uppercase">
          Verenne
        </span>
        {withSubtitle && (
          <span className="font-mono text-[7.5px] uppercase tracking-[0.28em] text-[var(--accent)] mt-0.5 leading-none opacity-85">
            Paris · Grasse
          </span>
        )}
      </div>
    </div>
  );
}

