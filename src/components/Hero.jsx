import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, MapPin, ShieldCheck } from 'lucide-react';
import { getProduct } from '../data';
import { EASE, PillButton, ProductImage } from './ui';
import { scrollToId } from '../lib/scroll';

const POINTS = [
  { icon: MapPin, title: 'Made in Grasse', text: 'Small batches' },
  { icon: Droplets, title: 'Cold-pressed', text: 'Plant oils' },
  { icon: ShieldCheck, title: 'Dark glass', text: 'Shields from light' }
];

export default function Hero({ onOpenProduct }) {
  const featured = getProduct('eclat-sauvage');

  return (
    <section id="top" className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-10 sm:pb-24 sm:pt-40" aria-labelledby="hero-title">
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="space-y-7 lg:col-span-7"
        >
          <h1 id="hero-title" className="font-serif text-[clamp(2.8rem,6.8vw,6.4rem)] font-light leading-[0.98] tracking-[-0.03em]">
            Botanical skincare, <span className="italic font-normal text-[var(--accent)]">made slowly.</span>
          </h1>

          <p className="max-w-xl text-base font-light leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Sixteen plant-based formulas to cleanse, treat, hydrate and restore your skin. Distilled in small batches in Grasse and bottled in dark glass.
          </p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <PillButton onClick={() => scrollToId('collection', { offset: -40 })} className="w-full sm:w-auto">
              Shop the collection
            </PillButton>
            <PillButton variant="ghost" onClick={() => scrollToId('ritual', { offset: -40 })} className="w-full sm:w-auto">
              See the routine
            </PillButton>
          </div>

          <ul className="grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-8">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="mb-2 h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span className="block text-[13px] font-medium">{title}</span>
                <span className="mt-0.5 block text-[12px] text-[var(--text-secondary)]">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          className="lg:col-span-5"
        >
          <button
            type="button"
            onClick={() => onOpenProduct(featured)}
            className="group block w-full overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-left"
            aria-label={`View ${featured.fullName}`}
          >
            <span className="block aspect-[5/4] overflow-hidden">
              <ProductImage
                product={featured}
                eager
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </span>
            <span className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <span>
                <span className="block font-serif text-2xl leading-tight sm:text-3xl">{featured.name}</span>
                <span className="mt-1 block text-[14px] text-[var(--text-secondary)]">{featured.subtitle}</span>
              </span>
              <span className="shrink-0 text-[14px] tabular-nums">From ${featured.price}</span>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
