import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Activity, Sun, Droplets, ShieldCheck, Box } from 'lucide-react';
import GlassScene from './three/GlassScene';
import { getProduct } from '../data';

/**
 * HeroCommercialAdStage
 * 
 * Haute-Luxury Showcase for Verenne:
 * 1. Editorial Specimen: Photorealistic studio presentation with 5-facet horizontal glide transformation
 * 2. 3D Flacon: Real-Time WebGL Transmission Glass bottle with authentic label (rotates 360° with direct pointer drag)
 * 3. Autonomous graceful auto-slide (pauses immediately on hover or touch)
 */
export default function HeroCommercialAdStage({ onExplore }) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [mode, setMode] = useState('stage'); // 'stage' (Editorial) | 'webgl' (3D Flacon)
  const [activeFacet, setActiveFacet] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);
  const lastSectorRef = useRef(0);

  // 4 Featured Hero Formulations
  const heroItems = [
    {
      id: 'eclat-sauvage',
      name: 'N°01 Éclat Sauvage',
      category: 'Active Botanical Serum',
      tint: '#D97706',
      image: '/products/eclat-sauvage.webp',
      srcset: '/products/eclat-sauvage-320.webp 320w, /products/eclat-sauvage-600.webp 600w, /products/eclat-sauvage.webp 1024w',
      modelSubtitle: 'Warm Travertine Light · Dew Drop Application',
      clinicalProof: 'CLINICAL EFFICACY · 100% CLEAN BIO-BOTANICAL',
      keyBenefitStat: '+94%',
      keyBenefitLabel: 'Skin Elasticity In 14 Days'
    },
    {
      id: 'seve-doree',
      name: 'N°04 Sève Dorée',
      category: 'Nocturnal Alchemy Oil',
      tint: '#7B5CC4',
      image: '/products/seve-doree.webp',
      srcset: '/products/seve-doree-320.webp 320w, /products/seve-doree-600.webp 600w, /products/seve-doree.webp 1024w',
      modelSubtitle: 'Moroccan Blue Tansy & Bakuchiol Infusion',
      clinicalProof: 'NOCTURNAL RECOVERY · 0% SYNTHETIC RETINOL',
      keyBenefitStat: '+98%',
      keyBenefitLabel: 'Overnight Barrier Shield'
    },
    {
      id: 'brume-botanique',
      name: 'N°03 Brume Botanique',
      category: 'Alpine Floral Dew Mist',
      tint: '#E5C396',
      image: '/products/brume-botanique.webp',
      srcset: '/products/brume-botanique-320.webp 320w, /products/brume-botanique-600.webp 600w, /products/brume-botanique.webp 1024w',
      modelSubtitle: 'Copper-Still Distilled Orange Blossom & Rose',
      clinicalProof: 'IMMEDIATE QUENCH · 100% SINGLE-STILL HYDROSOL',
      keyBenefitStat: '+64%',
      keyBenefitLabel: 'Instant Deep Cellular Hydration'
    },
    {
      id: 'baume-resineux',
      name: 'N°02 Baume Résineux',
      category: 'Restorative Barrier Salve',
      tint: '#BC7C45',
      image: '/products/baume-resineux.webp',
      srcset: '/products/baume-resineux-320.webp 320w, /products/baume-resineux-600.webp 600w, /products/baume-resineux.webp 1024w',
      modelSubtitle: 'Sacred Somali Frankincense & 5 Plant Ceramides',
      clinicalProof: 'PHYSIOLOGICAL BARRIER · SUB-ZERO SHIELD',
      keyBenefitStat: '+72%',
      keyBenefitLabel: 'Deep Barrier Repair Overnight'
    }
  ];

  const currentProduct = heroItems[selectedProductIndex];
  const fullDataProduct = getProduct(currentProduct.id);

  // Auto-slide between formulations & facets unless touched or hovered by user
  useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(() => {
      setSelectedProductIndex((prev) => (prev + 1) % heroItems.length);
      setActiveFacet((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(interval);
  }, [isInteracting, heroItems.length]);

  // 5 Automatic Cursor Facets
  const facets = [
    {
      id: 'pur',
      title: "L'Éclat Pur",
      subtitle: 'Studio Masterpiece & Specular Refraction',
      badge: 'Master Distillation',
      icon: Sparkles,
      stat: '100%',
      statLabel: 'Bio-Identical Lipids',
      detail: 'Photographed in balanced 5500K daylight with 2800K warm rim light'
    },
    {
      id: 'actives',
      title: "L'Alchimie Vivante",
      subtitle: 'Living Bio-Actives & Botanical Phytochemicals',
      badge: 'Phytochemical Map',
      icon: Activity,
      stat: '99.4%',
      statLabel: 'Active Potency',
      detail: 'Wild Corsican Helichrysum Stoechas & Cold-Pressed Rosehip'
    },
    {
      id: 'biophotonic',
      title: 'Le Bouclier Violet',
      subtitle: '380–420nm Biophotonic Swiss Violet Glass',
      badge: 'Violet Protection',
      icon: Sun,
      stat: '24 Mo',
      statLabel: 'Cellular Life',
      detail: 'Blocks visible light rays while transmitting energizing UVA and infrared'
    },
    {
      id: 'ritual',
      title: 'Le Geste & La Goutte',
      subtitle: 'Kinetic Pipette Dispenser & Sensory Application',
      badge: 'Post-Shower Ritual',
      icon: Droplets,
      stat: '3–4',
      statLabel: 'Drops Per Application',
      detail: 'Pressed gently upward into warm, damp post-shower skin'
    },
    {
      id: 'origine',
      title: 'Terroir & Traçabilité',
      subtitle: 'Single-Estate Immortelle Harvest from Calvi',
      badge: 'Protected Origin',
      icon: ShieldCheck,
      stat: '42°N',
      statLabel: 'Corsican Terroir',
      detail: 'Harvested by hand at first dawn to preserve unstable esters'
    }
  ];

  const currentFacet = facets[activeFacet] || facets[0];

  // 3D Tilt Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 180 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);
  const specularX = useTransform(smoothMouseX, [-0.5, 0.5], ['-30%', '30%']);
  const specularY = useTransform(smoothMouseY, [-0.5, 0.5], ['-30%', '30%']);

  // Cursor Glide Transformer
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    const normalizedX = (e.clientX - rect.left) / rect.width;
    const boundedX = Math.max(0, Math.min(0.999, normalizedX));
    const sector = Math.floor(boundedX * 5);

    if (sector !== lastSectorRef.current) {
      lastSectorRef.current = sector;
      setActiveFacet(sector);
    }
  }, [mouseX, mouseY]);

  const handleTouchMove = useCallback((e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normalizedX = (touch.clientX - rect.left) / rect.width;
    const boundedX = Math.max(0, Math.min(0.999, normalizedX));
    const sector = Math.floor(boundedX * 5);

    if (sector !== lastSectorRef.current) {
      lastSectorRef.current = sector;
      setActiveFacet(sector);
    }
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      {/* Top Mode Selector & Editorial Tag */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: currentProduct.tint }}
          />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--accent)] font-semibold">
            {mode === 'stage' ? `Editorial Specimen · Facet ${activeFacet + 1}/5` : '3D Interactive Flacon'}
          </span>
        </div>

        {/* 2 Clean Switchers: Editorial | 3D Flacon */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setMode('stage')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
              mode === 'stage'
                ? 'bg-[var(--text-primary)] text-[var(--accent-ink)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Editorial
          </button>
          <button
            type="button"
            onClick={() => setMode('webgl')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'webgl'
                ? 'bg-[var(--text-primary)] text-[var(--accent-ink)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Box className="w-3 h-3 text-[var(--accent)]" />
            <span>3D Flacon</span>
          </button>
        </div>
      </div>

      {/* Main Stage Container (Pauses Auto-slide on Hover / Touch) */}
      <motion.div
        ref={containerRef}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => {
          setIsInteracting(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        onMouseMove={mode === 'stage' ? handleMouseMove : undefined}
        onTouchMove={mode === 'stage' ? handleTouchMove : undefined}
        style={{
          rotateX: mode === 'stage' ? rotateX : 0,
          rotateY: mode === 'stage' ? rotateY : 0,
          transformStyle: 'preserve-3d',
          perspective: 1200
        }}
        className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-h-[500px] rounded-[36px] bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden group"
      >
        {/* Dynamic Studio Background Ambient Glow matching product tint */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle at ${50 + (activeFacet - 2) * 12}% 45%, ${currentProduct.tint}22 0%, transparent 70%)`
          }}
        />

        {/* Ambient Dais Shadow & Concentric Liquid Rings */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-16 pointer-events-none flex items-center justify-center">
          <div
            className="w-56 h-12 rounded-full blur-xl opacity-35 transition-all duration-500"
            style={{ backgroundColor: currentProduct.tint }}
          />
          <div className="absolute inset-0 border border-white/10 rounded-full scale-90 opacity-20" />
          <div className="absolute inset-0 border border-white/10 rounded-full scale-100 opacity-25" />
        </div>

        {/* Top Header Information — Clean, Clear, High-Converting Commercial Claims */}
        <div className="relative z-20 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[var(--accent)] font-semibold">
                {currentProduct.clinicalProof}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-light text-[var(--text-primary)]">
              {currentProduct.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
              {mode === 'stage' ? currentFacet.subtitle : 'Real-Time 3D WebGL Flacon · Drag to Rotate'}
            </p>
          </div>

          <div className="text-right">
            <span
              className="font-serif text-3xl font-normal block leading-none transition-colors duration-300"
              style={{ color: currentProduct.tint }}
            >
              {currentProduct.keyBenefitStat}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mt-0.5">
              {currentProduct.keyBenefitLabel}
            </span>
          </div>
        </div>

        {/* Center Stage: EITHER 3D Spring Photograph OR WebGL Engine */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-2 overflow-visible">
          {mode === 'webgl' ? (
            /* ========================================================= */
            /* MODE A: 3D REAL-TIME WEBGL TRANSMISSION GLASS FLACON      */
            /* ========================================================= */
            <div
              data-cursor-3d
              className="relative w-full h-full min-h-[260px] flex items-center justify-center rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <GlassScene product={fullDataProduct} active={true} />

              {/* Studio Telemetry Overlay */}
              <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/90">
                    360° INTERACTIVE FLACON
                  </span>
                </div>
                <span className="font-mono text-[8px] text-white/60 pl-1">
                  Maison Verenne Gold Label · Drag to Rotate
                </span>
              </div>

              <div className="absolute bottom-3 right-3 pointer-events-none">
                <span className="font-mono text-[9px] text-[var(--accent)] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-[var(--accent)]/30">
                  Click & Drag to Orbit 360°
                </span>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* MODE B: PHOTOREALISTIC APOTHECARY PRODUCT SHOWCASE        */
            /* ========================================================= */
            <div data-cursor-card className="relative w-56 sm:w-64 aspect-square flex items-center justify-center">
              <motion.div
                animate={{
                  y: isInteracting ? -6 : [-3, 3, -3],
                  scale: isInteracting ? 1.03 : 1
                }}
                transition={{
                  y: isInteracting ? { duration: 0.2 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 0.3 }
                }}
                className="relative w-48 sm:w-56 h-48 sm:h-56 flex items-center justify-center"
              >
                <img
                  src={currentProduct.image}
                  srcSet={currentProduct.srcset}
                  sizes="(max-width: 640px) 240px, 300px"
                  alt={`Verenne ${currentProduct.name}`}
                  className="w-full h-full object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.35)] pointer-events-none select-none transition-all duration-500"
                  loading="eager"
                />

                {/* Gliding Specular Light Tracker Sweep */}
                <motion.div
                  style={{ x: specularX, y: specularY }}
                  className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden opacity-35 mix-blend-overlay"
                >
                  <div className="w-[140%] h-full bg-gradient-to-r from-transparent via-white to-transparent rotate-45 transform -translate-x-12" />
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Bottom Section: 5 Scrubber Pips + Active Facet Detail */}
        <div className="relative z-20 w-full pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--accent)] flex items-center gap-1.5">
              {React.createElement(currentFacet.icon, { className: 'w-3 h-3' })}
              <span>{currentFacet.badge}</span>
            </span>
            <span className="text-[9px] uppercase font-mono text-[var(--text-muted)] hidden sm:inline">
              {mode === 'stage' ? 'Glide cursor horizontally across card to transform' : '360° Studio Orbit'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {facets.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFacet(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeFacet === idx
                    ? 'bg-[var(--accent)] scale-y-125'
                    : 'bg-white/15 hover:bg-white/30'
                }`}
                aria-label={`Select ${f.title}`}
              />
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] font-light mt-2 line-clamp-1">
            {currentFacet.detail}
          </p>
        </div>
      </motion.div>

      {/* Runway Specimen Selector Bar (4 iconic formulations) */}
      <div className="w-full mt-4 flex items-center justify-between gap-2 px-1">
        <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] tracking-wider">
          Specimen:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[340px] sm:max-w-none">
          {heroItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedProductIndex(idx)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                selectedProductIndex === idx
                  ? 'bg-[var(--text-primary)] text-[var(--accent-ink)] border-[var(--text-primary)] font-semibold shadow-xs scale-105'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.tint }}
              />
              <span>{item.name.replace('N°', 'N°')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
