import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Sparkles, LayoutGrid, Disc3, Check } from 'lucide-react';
import { PRODUCTS, CATEGORIES, getProduct } from '../data';
import { useCart } from '../context/CartContext';
import { EASE, ProductImage, SplitChars, AnimatedPrice, PillButton, TextureBlob, resolveAsset } from './ui';

/**
 * The Collection — dual-experience catalogue:
 * 1. "The Specimen Shelf" (3D spatial carousel with perspective depth & reflection)
 * 2. "Formulation Matrix" (dense, creative apothecary comparison grid with live telemetry & synergy duos)
 */
export default function Collection({ category, setCategory, onOpenProduct }) {
  const reduced = useReducedMotion();
  const { addToCart } = useCart();
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const items = useMemo(() => PRODUCTS.filter((p) => cat.ids.includes(p.id)), [cat]);
  const [active, setActive] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [viewMode, setViewMode] = useState('shelf'); // 'shelf' | 'matrix'
  const [mobile, setMobile] = useState(false);
  const [duoAdded, setDuoAdded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStart = useRef(null);

  const product = items[Math.min(active, items.length - 1)] || PRODUCTS[0];
  const synergyPair = product.synergy ? getProduct(product.synergy.pairId) : null;

  useEffect(() => setActive(0), [category]);
  useEffect(() => setSizeIdx(0), [product?.id]);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // Autonomous auto-advance for The Specimen Shelf unless hovered, touched, or dragged
  useEffect(() => {
    if (viewMode !== 'shelf' || isPaused || reduced || items.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [viewMode, isPaused, reduced, items.length]);

  const go = (d) => setActive((a) => (a + d + items.length) % items.length);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (dragStart.current == null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const addDuo = (e) => {
    if (!product || !synergyPair) return;
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(product, null, 1, rect);
    setTimeout(() => {
      addToCart(synergyPair, null, 1, null);
    }, 180);
    setDuoAdded(true);
    setTimeout(() => setDuoAdded(false), 2400);
  };

  if (!product) return null;
  const size = product.sizes[sizeIdx] || product.sizes[0];
  const spacing = mobile ? 150 : 270;

  return (
    <section id="collection" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="collection-title">
      {/* Tinted aura following the active formula */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{ background: `radial-gradient(50% 45% at 50% 55%, ${product.glow}22 0%, transparent 70%)` }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        {/* Header with Categories and View Switcher */}
        <div className="flex flex-col gap-8 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label">(03) — The Collection</p>
            <h2 id="collection-title" className="mt-4 font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.9]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cat.id}
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {cat.title.split(' ').slice(0, -1).join(' ')} <em className="text-[var(--accent)]">{cat.title.split(' ').slice(-1)}</em>
                </motion.span>
              </AnimatePresence>
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">{cat.blurb}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category tabs */}
            <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-1.5 rounded-full border border-[var(--border-subtle)] p-1.5">
              {CATEGORIES.map((c) => {
                const on = c.id === category;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setCategory(c.id)}
                    className={`relative rounded-full px-4 py-2 text-[13px] transition-colors ${on ? 'text-[var(--accent-ink)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {on && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-[var(--text-primary)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative">
                      {c.label}
                      <sup className="ml-1 font-mono text-[9px] opacity-60">{c.ids.length}</sup>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1">
              <button
                type="button"
                onClick={() => setViewMode('shelf')}
                aria-pressed={viewMode === 'shelf'}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'shelf' ? 'bg-[var(--text-primary)] text-[var(--accent-ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                title="3D Specimen Shelf"
              >
                <Disc3 className="h-3.5 w-3.5" />
                <span>Shelf</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                aria-pressed={viewMode === 'matrix'}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'matrix' ? 'bg-[var(--text-primary)] text-[var(--accent-ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                title="Formulation Matrix Table"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: 3D SPECIMEN SHELF */}
        {viewMode === 'shelf' ? (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Details panel */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:pt-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-[var(--accent)]">N°{product.no}</span>
                <span className="h-px w-8 bg-[var(--border-strong)]" />
                <span className="label">{product.category} · {product.moment}</span>
              </div>

              <h3 className="mt-4 font-serif text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04] tracking-tight">
                <SplitChars text={product.name} stagger={0.015} />
              </h3>
              <p className="mt-2 font-serif text-xl italic text-[var(--text-secondary)]">{product.latin}</p>

              <AnimatePresence mode="wait">
                <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">{product.description}</p>

                  {/* Telemetry chips: pH, Bioactive potency, finish */}
                  <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-[var(--accent)]">
                      pH: {product.ph || '5.2'}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-[var(--text-secondary)]">
                      Bio-Active: {product.bioactivePct || '99%'}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-[var(--text-secondary)]">
                      Absorption: {product.absorptionSeconds || 15}s
                    </span>
                  </div>

                  {/* Texture + notes */}
                  <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
                    <div className="flex items-center gap-3 bg-[var(--bg-primary)] p-4">
                      <TextureBlob color={product.glow} className="h-9 w-9 shrink-0" />
                      <div>
                        <p className="label">Texture</p>
                        <p className="mt-1 text-[13px] leading-snug">{product.texture}</p>
                      </div>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-4">
                      <p className="label">Scent notes</p>
                      <p className="mt-1 text-[13px] leading-snug">{product.notes.join(' · ')}</p>
                    </div>
                  </div>

                  {/* Synergy Duo Box */}
                  {synergyPair && product.synergy && (
                    <div className="mt-6 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)]/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="label flex items-center gap-1.5 text-[var(--accent)]">
                          <Sparkles className="h-3 w-3" /> Botanical Synergy Protocol
                        </span>
                        <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Save 10% Duo</span>
                      </div>
                      <p className="mt-1.5 font-serif text-lg text-[var(--text-primary)]">
                        {product.name} + {synergyPair.name}
                      </p>
                      <p className="mt-1 text-[12px] text-[var(--text-secondary)] leading-relaxed">
                        {product.synergy.benefit}
                      </p>
                      <button
                        type="button"
                        onClick={addDuo}
                        className="mt-3 flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] transition-all hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]"
                      >
                        {duoAdded ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Duo Added to Bag
                          </>
                        ) : (
                          <>
                            <span>Add Synergy Duo</span>
                            <span className="text-[var(--text-muted)]">·</span>
                            <span>${Math.round((product.price + synergyPair.price) * 0.9)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Sizes */}
                  <div className="mt-6 flex items-center gap-2" role="radiogroup" aria-label="Size">
                    {product.sizes.map((s, i) => (
                      <button
                        key={s.size}
                        type="button"
                        role="radio"
                        aria-checked={i === sizeIdx}
                        onClick={() => setSizeIdx(i)}
                        className={`rounded-full border px-4 py-2 font-mono text-[11px] transition-colors ${i === sizeIdx ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                          }`}
                      >
                        {s.size}
                      </button>
                    ))}
                    <span className="ml-auto font-serif text-4xl">
                      <AnimatedPrice price={size.price} />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap gap-2">
                <PillButton onClick={(e) => addToCart(product, size, 1, e.currentTarget.getBoundingClientRect())} className="flex-1">
                  Add to bag — ${size.price}
                </PillButton>
                <PillButton variant="ghost" onClick={() => onOpenProduct(product)}>
                  Details <ArrowUpRight className="h-3.5 w-3.5" />
                </PillButton>
              </div>
              <button type="button" onClick={() => onOpenProduct(product)} className="label mt-5 inline-flex items-center gap-2 transition-colors hover:text-[var(--text-primary)] cursor-pointer">
                <span>View on skin application</span>
                <span className="text-[var(--accent)]">→</span>
              </button>
            </div>

            {/* 3D shelf */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div
                tabIndex={0}
                role="listbox"
                aria-label={`${cat.label} formulas — use arrow keys`}
                aria-activedescendant={`shelf-${product.id}`}
                onKeyDown={onKey}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                onPointerDown={(e) => {
                  setIsPaused(true);
                  onPointerDown(e);
                }}
                onPointerUp={(e) => {
                  setIsPaused(false);
                  onPointerUp(e);
                }}
                onPointerCancel={() => {
                  setIsPaused(false);
                  dragStart.current = null;
                }}
                className="relative h-[440px] touch-pan-y select-none outline-none sm:h-[600px]"
                style={{ perspective: '1600px' }}
                data-cursor="Drag"
              >
                {/* Giant outline number behind */}
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={product.no}
                    aria-hidden="true"
                    className="text-outline pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] font-serif text-[clamp(14rem,30vw,30rem)] leading-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {product.no}
                  </motion.span>
                </AnimatePresence>

                {/* Floor line */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-[12%] h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                  {items.map((p, i) => {
                    const d = i - active;
                    const ad = Math.abs(d);
                    const isActive = d === 0;
                    return (
                      <motion.button
                        key={p.id}
                        id={`shelf-${p.id}`}
                        role="option"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => (isActive ? onOpenProduct(p) : setActive(i))}
                        data-cursor={isActive ? 'Open' : 'Select'}
                        className="absolute left-1/2 top-[8%] -ml-[105px] w-[210px] sm:-ml-[150px] sm:w-[300px]"
                        initial={false}
                        animate={{
                          x: d * spacing,
                          z: -ad * (mobile ? 180 : 260),
                          rotateY: reduced ? 0 : -Math.sign(d) * Math.min(ad, 2) * 28,
                          opacity: ad > 2 ? 0 : 1 - ad * 0.28,
                          filter: isActive ? 'brightness(1)' : 'brightness(0.55)'
                        }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
                        style={{ zIndex: 10 - ad, transformStyle: 'preserve-3d' }}
                        tabIndex={-1}
                      >
                        <div
                          className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[28px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
                          style={{ WebkitBoxReflect: 'below 14px linear-gradient(transparent 72%, rgba(255,255,255,0.12))' }}
                        >
                          <ProductImage product={p} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105" sizes="300px" />
                          {/* specular sweep */}
                          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.18)_50%,transparent_65%)] opacity-60" />
                        </div>
                        <div className={`mt-4 flex items-baseline justify-between transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">N°{p.no}</span>
                          <span className="font-mono text-[11px] tabular-nums">${p.price}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Controls & Autonomous Status Indicator */}
                {items.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-[var(--text-secondary)]">
                        {String(active + 1).padStart(2, '0')} <span className="text-[var(--text-muted)]">/ {String(items.length).padStart(2, '0')}</span>
                      </span>
                      <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-[var(--text-muted)]' : 'bg-emerald-400 animate-pulse'}`} />
                        <span>{isPaused ? 'Paused' : 'Auto-Orbit'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous formula"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-strong)] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)] cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next formula"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-strong)] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)] cursor-pointer"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumb rail — quick jump */}
              <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
                {items.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show ${p.fullName}`}
                    className={`group flex shrink-0 items-center gap-3 rounded-full border py-1 pl-1 pr-4 transition-colors ${i === active ? 'border-[var(--text-primary)]' : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                      }`}
                  >
                    <img src={`${resolveAsset(p.image)}-320.webp`} alt={p.name} className="h-8 w-8 rounded-full object-cover" loading="lazy" />
                    <span className={`text-[13px] ${i === active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: FORMULATION MATRIX — Highly creative & productive comparative lab */
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-3">
              <span className="font-mono uppercase tracking-widest text-[var(--accent)]">
                Laboratoire Grasse · Formulation Matrix ({items.length} specimens)
              </span>
              <span className="hidden sm:inline font-mono">Click card to inspect active biotics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onOpenProduct(prod)}
                  className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-6 transition-all duration-500 hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/90"
                >
                  {/* Subtle glowing corner tint */}
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: prod.glow }}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--accent)]">N°{prod.no}</span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                      {prod.category} · {prod.moment}
                    </span>
                  </div>

                  {/* Image + Title */}
                  <div className="mt-4 flex gap-4 items-center">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-t-full rounded-b-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                      <ProductImage product={prod} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" sizes="100px" />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl font-normal group-hover:italic transition-all">
                        {prod.name}
                      </h4>
                      <p className="font-serif text-xs italic text-[var(--text-muted)] mt-0.5">
                        {prod.latin}
                      </p>
                      <span className="font-mono text-base font-normal text-[var(--text-primary)] block mt-2">
                        ${prod.price}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry specs grid */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-4 text-center">
                    <div className="rounded-lg bg-[var(--bg-surface)]/60 p-2">
                      <span className="label block text-[8px] opacity-75">pH Level</span>
                      <span className="font-mono text-xs text-[var(--accent)] block mt-0.5">{prod.ph?.split(' ')[0] || '5.2'}</span>
                    </div>
                    <div className="rounded-lg bg-[var(--bg-surface)]/60 p-2">
                      <span className="label block text-[8px] opacity-75">Bio-Active</span>
                      <span className="font-mono text-xs text-[var(--text-primary)] block mt-0.5">{prod.bioactivePct || '99%'}</span>
                    </div>
                    <div className="rounded-lg bg-[var(--bg-surface)]/60 p-2">
                      <span className="label block text-[8px] opacity-75">Absorption</span>
                      <span className="font-mono text-xs text-[var(--text-primary)] block mt-0.5">{prod.absorptionSeconds || 15}s</span>
                    </div>
                  </div>

                  {/* Concerns pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {prod.concerns?.map((c) => (
                      <span key={c} className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 px-2 py-0.5 font-sans text-[10px] text-[var(--text-secondary)]">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProduct(prod);
                      }}
                      className="label flex items-center gap-1.5 hover:text-[var(--text-primary)]"
                    >
                      View Dossier →
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, prod.sizes[0], 1, e.currentTarget.getBoundingClientRect());
                      }}
                      className="rounded-full bg-[var(--text-primary)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)] transition-transform hover:scale-105"
                    >
                      + Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
