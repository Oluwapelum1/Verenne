import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Check, ArrowRight, ArrowLeft, Droplets, ShieldCheck, Clock, Plus } from 'lucide-react';
import { PRODUCTS, getProduct } from '../data';
import { useCart } from '../context/CartContext';
import { EASE, PillButton, AnimatedPrice } from './ui';

/**
 * Haute Editorial Lookbook & Shoppable Campaign Exhibition
 * 
 * Re-imagined from Behance/Dribbble award-winning beauty case studies & top Shopify themes:
 * - Replaces cramped accordion slabs with an expansive, magazine-grade double-page spread
 * - Interactive Shoppable Hotspot Pins on high-definition packshots
 * - Clean, scannable formulation dossier with clinical actives and synergy pairings
 * - Smooth autonomous transition between campaigns with user hover/touch override
 */
export default function OnSkin({ onOpenProduct }) {
  const { addToCart } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hotspotOpen, setHotspotOpen] = useState(true);
  const [added, setAdded] = useState(false);

  // 4 Flagship Campaign Stories
  const stories = [
    {
      id: 'eclat-sauvage',
      product: PRODUCTS[0],
      chapter: 'CHAPTER 01 · DAWN HARVEST',
      headline: 'Eighteen wild seeds, folded into a single golden drop.',
      quote: 'Sinks into the skin like morning sunlight on warm Corsican stone.',
      ambientColor: '#D97706',
      heroStat: '+94%',
      heroStatLabel: 'Dermal Elasticity',
      synergyId: 'brume-botanique',
      synergyBenefit: '+48% deeper lipid penetration when pressed into damp skin',
      clinicalPillars: [
        { label: 'Harvest Extraction', val: 'Cold-Pressed < 28°C' },
        { label: 'Absorption Speed', val: '14s Intercellular' },
        { label: 'Skin Affinity', val: '99.4% Biomimetic' }
      ]
    },
    {
      id: 'seve-doree',
      product: PRODUCTS[3],
      chapter: 'CHAPTER 02 · NOCTURNAL ALCHEMY',
      headline: 'Moroccan blue tansy & bakuchiol in violet glass.',
      quote: 'Works quietly through cellular sleep, and is gone before you wake.',
      ambientColor: '#7B5CC4',
      heroStat: '+98%',
      heroStatLabel: 'Overnight Barrier Shield',
      synergyId: 'baume-resineux',
      synergyBenefit: 'Seals active chamazulene against nocturnal moisture evaporation',
      clinicalPillars: [
        { label: 'Retinol Alternative', val: '100% Gentle Bakuchiol' },
        { label: 'Photonic Shield', val: 'Miron Violet Glass' },
        { label: 'Skin Calming', val: 'Pure Chamazulene' }
      ]
    },
    {
      id: 'brume-botanique',
      product: PRODUCTS[2],
      chapter: 'CHAPTER 03 · THE COPPER STILL',
      headline: 'Single-distillation orange blossom & heritage roses.',
      quote: 'Copper-still distilled within hours of picking. A cloud of morning garden, on demand.',
      ambientColor: '#E5C396',
      heroStat: '+64%',
      heroStatLabel: 'Instant Deep Cellular Hydration',
      synergyId: 'eclat-sauvage',
      synergyBenefit: 'Pre-saturates epidermal channels to triple subsequent serum absorption',
      clinicalPillars: [
        { label: 'Alembic Distillate', val: 'Solid Copper Still' },
        { label: 'Hydrosol Purity', val: '100% Single-Origin' },
        { label: 'pH Calibration', val: '5.0 Post-Cleanse' }
      ]
    },
    {
      id: 'baume-resineux',
      product: PRODUCTS[1],
      chapter: 'CHAPTER 04 · BARRIER COCOON',
      headline: 'Somali frankincense and five physiological ceramides.',
      quote: 'A velvet soufflé built for dry air, cold winds, and the final ritual of night.',
      ambientColor: '#BC7C45',
      heroStat: '+72%',
      heroStatLabel: 'Deep Barrier Repair',
      synergyId: 'seve-doree',
      synergyBenefit: 'Locks in overnight botanical actives beneath a breathable ceramide glove',
      clinicalPillars: [
        { label: 'Ceramide Complex', val: '5 Plant Fractions' },
        { label: 'Texture Matrix', val: 'Whipped Satin Balm' },
        { label: 'Acid Mantle Match', val: 'pH 5.5 Optimal' }
      ]
    }
  ];

  const current = stories[activeIdx];
  const prod = current.product;
  const synergyProd = getProduct(current.synergyId);
  const size = prod.sizes[sizeIdx] || prod.sizes[0];

  // Auto-advance campaign carousel unless hovered or touched
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stories.length);
      setSizeIdx(0);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, stories.length]);

  const handleAddCurrent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(prod, size, 1, rect);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section
      id="on-skin"
      className="py-24 sm:py-32 overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]"
      aria-labelledby="lookbook-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        {/* Section Header: Clean Editorial Scannability */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="label text-[var(--accent)] font-semibold tracking-[0.2em]">(04) — The Editorial Lookbook</p>
            </div>
            <h2 id="lookbook-title" className="font-serif text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.95] text-[var(--text-primary)]">
              Formulations in <em className="text-[var(--accent)] italic">focus.</em>
            </h2>
          </div>

          {/* Campaign Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {stories.map((story, i) => (
              <button
                key={story.id}
                type="button"
                onClick={() => {
                  setActiveIdx(i);
                  setSizeIdx(0);
                }}
                className={`px-4 py-2 rounded-full text-[12px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  activeIdx === i
                    ? 'bg-[var(--text-primary)] text-[var(--accent-ink)] border-[var(--text-primary)] font-semibold shadow-md'
                    : 'bg-[var(--bg-secondary)]/60 text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>N°{story.product.no} · {story.product.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Master Lookbook Double-Page Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT: Grand Cinematic Visual Window with Shoppable Hotspot */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative aspect-[4/5] sm:aspect-[16/11] rounded-[36px] overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl p-8 flex items-center justify-center group"
              >
                {/* Ambient Travertine & Studio Light Gradient */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-1000"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${current.ambientColor}22 0%, transparent 75%)`
                  }}
                />

                {/* Subtle Grid Lines for French Haute-Parfumerie Aesthetic */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />

                {/* Studio Dais Floor Shadow */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-14 bg-black/40 blur-2xl rounded-full pointer-events-none" />

                {/* Photorealistic Product Packshot */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-60 sm:w-80 h-72 sm:h-96 flex items-center justify-center select-none"
                >
                  <img
                    src={`${prod.image}-600.webp`}
                    alt={prod.name}
                    className="w-full h-full object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.45)] pointer-events-none"
                    loading="lazy"
                  />
                </motion.div>

                {/* THE SHOPPABLE HOTSPOT PIN (Inspired by Rhode & Prestige Theme) */}
                <div className="absolute top-[35%] right-[22%] sm:right-[28%] z-30">
                  <button
                    type="button"
                    onClick={() => setHotspotOpen((v) => !v)}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)] text-black shadow-xl hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Toggle shoppable details"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    <span className="absolute inset-0 rounded-full border-2 border-[var(--accent)] animate-ping opacity-75 pointer-events-none" />
                  </button>

                  {/* Floating Shoppable Glass Tag */}
                  <AnimatePresence>
                    {hotspotOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.92 }}
                        className="absolute right-0 top-10 w-64 p-3.5 rounded-2xl border border-[var(--border-strong)] bg-black/80 backdrop-blur-xl shadow-2xl text-left pointer-events-auto"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${prod.image}-320.webp`}
                            alt=""
                            className="w-11 h-11 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[9px] uppercase text-[var(--accent)] block">
                              N°{prod.no} · {prod.category}
                            </span>
                            <p className="font-serif text-sm text-white truncate">
                              {prod.name}
                            </p>
                            <span className="font-mono text-[12px] text-white/90">
                              ${size.price}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddCurrent}
                          className="mt-3 w-full py-1.5 px-3 rounded-full bg-[var(--accent)] text-black font-mono text-[10px] uppercase tracking-wider font-semibold hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {added ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-800" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Quick Add · ${size.price}</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chapter Watermark */}
                <div className="absolute bottom-6 left-8 z-20 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-white/60 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{current.chapter}</span>
                </div>

                {/* Proven Efficacy Stat Badge */}
                <div className="absolute top-6 left-8 z-20 pointer-events-none">
                  <span className="font-serif text-3xl sm:text-4xl text-[var(--accent)] font-normal block leading-none">
                    {current.heroStat}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block mt-1">
                    {current.heroStatLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Master Editorial Dossier Column */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-widest font-semibold">
                      {prod.category} · {prod.moment}
                    </span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {prod.latin}
                    </span>
                  </div>

                  <h3 className="font-serif text-4xl sm:text-5xl font-light text-[var(--text-primary)] leading-[1.05]">
                    {current.headline}
                  </h3>

                  <p className="mt-3 font-serif text-lg italic text-[var(--accent)] font-light leading-relaxed">
                    “{current.quote}”
                  </p>
                </div>

                {/* 3 Clinical Formulation Pillars */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)]">
                  {current.clinicalPillars.map((pil) => (
                    <div key={pil.label} className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        {pil.label}
                      </p>
                      <p className="font-serif text-sm sm:text-base font-normal text-[var(--text-primary)] mt-0.5">
                        {pil.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Botanical Synergy Pairing (Basket-Size Booster) */}
                {synergyProd && (
                  <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div className="text-[12px] leading-relaxed">
                      <span className="font-mono uppercase text-[10px] tracking-wider text-[var(--accent)] font-semibold block">
                        Synergy Ritual Pairing
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {current.synergyBenefit} with <strong className="text-[var(--text-primary)]">{synergyProd.name}</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* Size Selector & Add to Bag CTA */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" role="radiogroup" aria-label="Formula Size">
                      {prod.sizes.map((s, idx) => (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => setSizeIdx(idx)}
                          className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] transition-all cursor-pointer border ${
                            sizeIdx === idx
                              ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--accent-ink)] font-semibold shadow-xs'
                              : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                    <span className="font-serif text-3xl font-light text-[var(--text-primary)]">
                      <AnimatedPrice price={size.price} />
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <PillButton onClick={handleAddCurrent} className="flex-1">
                      {added ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400 mr-2" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <span>Add to Bag — ${size.price}</span>
                      )}
                    </PillButton>

                    <PillButton variant="ghost" onClick={() => onOpenProduct(prod)}>
                      Formula Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </PillButton>
                  </div>
                </div>

                {/* Trust Footer */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>30-Day On-Skin Satisfaction</span>
                  </span>
                  <span>Carbon-Neutral Freight</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Editorial Progress Bar */}
        <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] tabular-nums text-[var(--text-secondary)]">
              0{activeIdx + 1} <span className="text-[var(--text-muted)]">/ 0{stories.length}</span>
            </span>
            <span className="text-[var(--text-muted)] font-mono text-[10px]">·</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {isPaused ? 'Interactive Mode' : 'Autonomous Editorial Cycle'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveIdx((prev) => (prev - 1 + stories.length) % stories.length);
                setSizeIdx(0);
              }}
              aria-label="Previous story"
              className="w-10 h-10 rounded-full border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveIdx((prev) => (prev + 1) % stories.length);
                setSizeIdx(0);
              }}
              aria-label="Next story"
              className="w-10 h-10 rounded-full border border-[var(--border-strong)] flex items-center justify-center hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
