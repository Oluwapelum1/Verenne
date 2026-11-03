import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Minus, Plus, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, categoryOf, getProduct } from '../data';
import { EASE, ProductImage, AnimatedPrice, PillButton, TextureBlob, resolveAsset } from './ui';
import { lockScroll } from '../lib/scroll';

/**
 * Product dossier — a full-height sheet. Left: the photograph with a pointer-driven
 * magnifier and a portrait toggle. Right: everything needed to decide, then buy.
 */
export default function ProductDetailModal({ product, onClose, onSwitch }) {
  return (
    <AnimatePresence>
      {product && <Dossier key={product.id} product={product} onClose={onClose} onSwitch={onSwitch} />}
    </AnimatePresence>
  );
}

function Dossier({ product, onClose, onSwitch }) {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState('product');
  const [zoom, setZoom] = useState(null);
  const closeRef = useRef(null);
  const size = product.sizes[sizeIdx];
  const cat = categoryOf(product.id);
  const pairs = PRODUCTS.filter((p) => p.id !== product.id && p.moment === product.moment).slice(0, 2);
  const others = pairs.length ? pairs : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="fixed inset-0 z-[150]" role="dialog" aria-modal="true" aria-labelledby="dossier-title">
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div
        className="absolute inset-x-0 bottom-0 top-3 overflow-hidden rounded-t-[32px] border-t border-[var(--border-strong)] bg-[var(--bg-primary)] sm:inset-x-3 sm:top-6"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 items-center gap-2 rounded-full bg-[var(--text-primary)] px-4 text-[12px] text-[var(--accent-ink)]"
        >
          <X className="h-3.5 w-3.5" /> Close
        </button>

        <div className="grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden" data-lenis-prevent>
          {/* Visual */}
          <div className="relative min-h-[60vh] bg-[var(--bg-secondary)] lg:h-full">
            <div
              className="absolute inset-0 overflow-hidden"
              onPointerMove={view === 'product' ? onMove : undefined}
              onPointerLeave={() => setZoom(null)}
              data-cursor={view === 'product' ? 'Zoom' : undefined}
            >
              <AnimatePresence mode="wait">
                <motion.div key={view} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                  {view === 'product' ? (
                    <ProductImage
                      product={product}
                      eager
                      sizes="50vw"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img src={resolveAsset(product.portrait)} alt={`${product.fullName} on skin`} className="h-full w-full object-cover" />
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Magnifier */}
              {zoom && view === 'product' && (
                <div
                  className="pointer-events-none absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/40 shadow-2xl"
                  style={{
                    left: `${zoom.x}%`,
                    top: `${zoom.y}%`,
                    backgroundImage: `url(${resolveAsset(product.image)}.webp)`,
                    backgroundSize: '300%',
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`
                  }}
                />
              )}
            </div>

            <div className="absolute bottom-5 left-5 flex gap-2">
              {[
                ['product', 'Bottle'],
                ['portrait', 'On skin']
              ].map(([id, l]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={`rounded-full px-4 py-2 text-[12px] backdrop-blur-md transition-colors ${view === id ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col px-6 pb-10 pt-8 sm:px-12 sm:pt-16 lg:overflow-y-auto" data-lenis-prevent>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] text-[var(--accent)]">N°{product.no}</span>
              <span className="h-px w-8 bg-[var(--border-strong)]" />
              <span className="label">
                {cat?.label} · {product.category}
              </span>
            </div>

            <h2 id="dossier-title" className="mt-4 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.9]">
              {product.name}
            </h2>
            <p className="mt-2 font-serif text-xl italic text-[var(--text-secondary)]">{product.subtitle}</p>

            <div className="mt-4 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </span>
              {product.rating} · {product.reviewsCount} reviews
            </div>

            {/* Telemetry specs row */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[var(--border-subtle)] py-4 text-center">
              <div className="rounded-xl bg-[var(--bg-secondary)]/70 p-2.5">
                <span className="label block text-[9px]">pH Balance</span>
                <span className="font-mono text-sm text-[var(--accent)] block mt-0.5">{product.ph || '5.2'}</span>
              </div>
              <div className="rounded-xl bg-[var(--bg-secondary)]/70 p-2.5">
                <span className="label block text-[9px]">Bio-Active</span>
                <span className="font-mono text-sm text-[var(--text-primary)] block mt-0.5">{product.bioactivePct || '99%'}</span>
              </div>
              <div className="rounded-xl bg-[var(--bg-secondary)]/70 p-2.5">
                <span className="label block text-[9px]">Absorption</span>
                <span className="font-mono text-sm text-[var(--text-primary)] block mt-0.5">{product.absorptionSeconds || 15}s</span>
              </div>
            </div>

            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--text-secondary)]">{product.description}</p>

            {/* Buy box */}
            <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] p-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-2" role="radiogroup" aria-label="Size">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s.size}
                      type="button"
                      role="radio"
                      aria-checked={i === sizeIdx}
                      onClick={() => setSizeIdx(i)}
                      className={`rounded-full border px-4 py-2 font-mono text-[11px] transition-colors ${
                        i === sizeIdx ? 'border-[var(--text-primary)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
                <span className="font-serif text-4xl">
                  <AnimatedPrice price={size.price * qty} />
                </span>
              </div>
              <div className="mt-5 flex gap-2">
                <div className="flex items-center rounded-full border border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-10 place-items-center" aria-label="Decrease quantity">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono text-[13px]" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-10 place-items-center" aria-label="Increase quantity">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <PillButton
                  className="flex-1"
                  onClick={(e) => {
                    addToCart(product, size, qty, e.currentTarget.getBoundingClientRect());
                    onClose();
                  }}
                >
                  Add to bag
                </PillButton>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-pressed={isWishlisted(product.id)}
                  aria-label="Save to wishlist"
                  className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border-subtle)] transition-colors hover:border-[var(--border-strong)]"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
                </button>
              </div>
              <p className="label mt-4">Free delivery over $120 · 30-day returns, even opened</p>
            </div>

            {/* Specs */}
            <dl className="mt-10 grid grid-cols-1 border-t border-[var(--border-subtle)] sm:grid-cols-2">
              <div className="border-b border-[var(--border-subtle)] py-5 sm:pr-6">
                <dt className="label">Texture</dt>
                <dd className="mt-2 flex items-center gap-3 text-[15px]">
                  <TextureBlob color={product.glow} className="h-7 w-7" /> {product.texture}
                </dd>
              </div>
              <div className="border-b border-[var(--border-subtle)] py-5">
                <dt className="label">Scent</dt>
                <dd className="mt-2 text-[15px]">{product.notes.join(' · ')}</dd>
              </div>
              <div className="border-b border-[var(--border-subtle)] py-5 sm:col-span-2">
                <dt className="label">Key botanicals</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {product.keyIngredients.map((k) => (
                    <span key={k} className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[13px]">
                      {k}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="border-b border-[var(--border-subtle)] py-5 sm:col-span-2">
                <dt className="label">What it does</dt>
                <dd className="mt-3 space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <p key={b} className="flex gap-3 text-[15px]">
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">0{i + 1}</span>
                      {b}
                    </p>
                  ))}
                </dd>
              </div>
              <div className="py-5 sm:col-span-2">
                <dt className="label">How to use</dt>
                <dd className="mt-2 text-[15px] text-[var(--text-secondary)]">{product.howToUse}</dd>
              </div>
            </dl>

            {/* Botanical Synergy Protocol */}
            {product.synergy && (
              <div className="mt-8 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)]/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="label flex items-center gap-1.5 text-[var(--accent)]">
                    <Sparkles className="h-3 w-3" /> Recommended Protocol Partner
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">Save 10% Bundle</span>
                </div>
                <p className="mt-2 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {product.synergy.benefit}
                </p>
                {getProduct(product.synergy.pairId) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      const pair = getProduct(product.synergy.pairId);
                      addToCart(product, size, 1, e.currentTarget.getBoundingClientRect());
                      setTimeout(() => addToCart(pair, null, 1, null), 150);
                      onClose();
                    }}
                    className="mt-3 flex items-center justify-between w-full rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] transition-all hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]"
                  >
                    <span>Add {product.name} + {getProduct(product.synergy.pairId).name} Duo</span>
                    <span>${Math.round((size.price + getProduct(product.synergy.pairId).price) * 0.9)}</span>
                  </button>
                )}
              </div>
            )}

            {/* Pairs well with */}
            <div className="mt-6">
              <p className="label">Pairs well with</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {others.map((p) => (
                  <button key={p.id} type="button" onClick={() => onSwitch(p)} className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] p-2 text-left transition-colors hover:border-[var(--border-strong)]">
                    <img src={`${resolveAsset(p.image)}-320.webp`} alt={p.name} className="h-16 w-14 rounded-t-full rounded-b-lg object-cover" loading="lazy" />
                    <span>
                      <span className="block font-serif text-lg leading-tight group-hover:italic">{p.name}</span>
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">${p.price}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
