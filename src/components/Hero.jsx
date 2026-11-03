import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, ShieldCheck, Leaf, ArrowDown } from 'lucide-react';
import HeroCommercialAdStage from './HeroCommercialAdStage';
import { EASE, PillButton } from './ui';
import { scrollToId } from '../lib/scroll';

/**
 * Hero Section — Clean, spacious, high-fashion 3D commercial campaign stage.
 * Engineered for luxury DTC storefronts and commercial marketplace standards.
 */
export default function Hero({ onOpenProduct }) {
  return (
    <section
      id="top"
      className="relative min-h-[92svh] flex items-center justify-center overflow-hidden px-5 sm:px-10 pt-32 sm:pt-40 pb-16 sm:pb-24"
      aria-label="Verenne haute botanical laboratory"
    >
      {/* Subtle ambient lighting aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-15 bg-[var(--accent)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Spacious Editorial Headline & Action */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="lg:col-span-7 space-y-7 text-center lg:text-left"
        >
          {/* Artisan badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--accent)] text-[11px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn 2026 · Small-Batch Living Distillations</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(2.8rem,6.8vw,6.4rem)] font-light leading-[0.98] tracking-[-0.03em] text-[var(--text-primary)]">
            Skin in{' '}
            <span className="italic font-normal text-[var(--accent)]">
              communion
            </span>{' '}
            with living earth.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            Wild-foraged bioactive flora, cold-extracted seed lipids, and single-origin hydrosols. Formulated with alchemical restraint in Swiss violet glass to restore your skin's native barrier intelligence.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <PillButton
              onClick={() => scrollToId('collection', { offset: -40 })}
              className="w-full sm:w-auto"
            >
              Explore Formulations
            </PillButton>
            <PillButton
              variant="ghost"
              onClick={() => scrollToId('ritual', { offset: -40 })}
              className="w-full sm:w-auto"
            >
              Discover The Ritual
            </PillButton>
          </div>

          {/* 3 Trust pillars */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] tracking-wider">
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <Leaf className="w-4 h-4 text-[var(--accent)] mb-1" />
              <span className="font-medium text-[var(--text-primary)]">100% Biodynamic</span>
              <span className="text-[10px]">Wild-Foraged Actives</span>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <Droplets className="w-4 h-4 text-[var(--accent)] mb-1" />
              <span className="font-medium text-[var(--text-primary)]">Cold-Pressed</span>
              <span className="text-[10px]">Virgin Seed Lipids</span>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)] mb-1" />
              <span className="font-medium text-[var(--text-primary)]">Swiss Violet Glass</span>
              <span className="text-[10px]">Biophotonic Potency</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Haute-Luxury 3D Ad Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className="lg:col-span-5 relative flex justify-center w-full"
        >
          <HeroCommercialAdStage
            onExplore={() => scrollToId('collection', { offset: -40 })}
          />
        </motion.div>
      </div>

      {/* Down scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => scrollToId('manifesto')}
          aria-label="Scroll down"
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
