import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, asset } from '../data';
import { EASE, PillButton } from './ui';
import { scrollToId } from '../lib/scroll';

const FROM_PRICE = Math.min(...PRODUCTS.map((p) => p.price));

export default function Hero() {
  return (
    <section id="top" className="tone-light grid min-h-[100svh] grid-cols-1 pt-[104px] lg:grid-cols-12" aria-labelledby="hero-title">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex flex-col justify-between gap-12 px-5 py-10 sm:px-10 sm:py-14 lg:col-span-7"
      >
        <h1 id="hero-title" className="font-serif text-[clamp(3.4rem,8.6vw,9rem)] leading-[0.94] tracking-[-0.03em]">
          Botanical skincare, <em className="block">made slowly.</em>
        </h1>

        <div className="grid gap-8 border-t border-[var(--border-strong)] pt-6 sm:grid-cols-2">
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Sixteen plant-based formulas to cleanse, treat, hydrate and restore your skin. Distilled in small batches in Grasse.
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:justify-end">
            <PillButton onClick={() => scrollToId('collection', { offset: -40 })}>Shop from ${FROM_PRICE}</PillButton>
            <button
              type="button"
              onClick={() => scrollToId('ritual', { offset: -40 })}
              className="text-[15px] underline decoration-1 underline-offset-[6px] hover:text-[var(--accent)]"
            >
              See the routine
            </button>
          </div>
        </div>
      </motion.div>

      <div className="relative min-h-[70vh] overflow-hidden lg:col-span-5 lg:min-h-0">
        <img
          src={asset('/products/model_oil_glow.jpg')}
          alt="A woman pressing a golden facial oil into her cheek"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full origin-[62%_72%] scale-[1.28] object-cover"
        />
      </div>
    </section>
  );
}
