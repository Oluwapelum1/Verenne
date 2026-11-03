import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { CATEGORIES, getProduct } from '../data';
import { EASE } from './ui';
import { scrollToId } from '../lib/scroll';

const SKIN_CONCERNS = [
  { id: 'all', label: 'All Concerns' },
  { id: 'barrier', label: 'Barrier Replenishment', categoryId: 'restore' },
  { id: 'glow', label: 'Dullness & Radiance', categoryId: 'treat' },
  { id: 'hydrate', label: 'Trans-epidermal Dehydration', categoryId: 'hydrate' },
  { id: 'calm', label: 'Redness & Night Recovery', categoryId: 'treat' },
  { id: 'clarify', label: 'Pore Congestion', categoryId: 'cleanse' }
];

/**
 * Shop by need — interactive categorization by routine step and cutaneous concerns.
 * Hovering fans the formulas out of the row; clicking re-stocks the collection shelf and glides to it.
 */
export default function Categories({ setCategory }) {
  const [hover, setHover] = useState(null);
  const [activeConcern, setActiveConcern] = useState('all');
  const rows = CATEGORIES.filter((c) => c.id !== 'all');

  const choose = (id) => {
    setCategory(id);
    scrollToId('collection', { offset: -40 });
  };

  const handleConcernClick = (concern) => {
    setActiveConcern(concern.id);
    if (concern.categoryId) {
      choose(concern.categoryId);
    } else {
      choose('all');
    }
  };

  return (
    <section id="categories" className="px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="categories-title">
      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">(02) — Diagnostic & Categories</p>
            <h2 id="categories-title" className="mt-4 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95]">
              What does your skin <em className="text-[var(--accent)]">ask for?</em>
            </h2>
          </div>
          <button type="button" onClick={() => choose('all')} className="label inline-flex items-center gap-2 self-start transition-colors hover:text-[var(--text-primary)] sm:self-auto">
            View all 16 formulations <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Productive Skin Concern Quick-Bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-6">
          <span className="label mr-2 flex items-center gap-1.5 text-[var(--accent)]">
            <Sparkles className="h-3 w-3" /> Concern focus:
          </span>
          {SKIN_CONCERNS.map((c) => {
            const on = activeConcern === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleConcernClick(c)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-sans transition-all ${
                  on
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--accent-ink)] font-medium shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Typographic Category Rows */}
        <ul className="border-t border-[var(--border-subtle)]" onMouseLeave={() => setHover(null)}>
          {rows.map((c, i) => {
            const products = c.ids.map(getProduct);
            const lead = products[0];
            const on = hover === c.id;
            const dim = hover && !on;
            return (
              <li key={c.id} className="relative border-b border-[var(--border-subtle)]">
                <button
                  type="button"
                  onMouseEnter={() => setHover(c.id)}
                  onFocus={() => setHover(c.id)}
                  onClick={() => choose(c.id)}
                  className="group relative grid w-full grid-cols-12 items-center gap-4 overflow-hidden py-7 text-left sm:py-9"
                  data-cursor="Shop"
                >
                  {/* Tint wash */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom"
                    style={{ background: `linear-gradient(90deg, ${lead.glow}14, transparent 70%)` }}
                    initial={false}
                    animate={{ scaleY: on ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />

                  <span className="relative col-span-2 font-mono text-[11px] text-[var(--text-muted)] sm:col-span-1">0{i + 1}</span>

                  <span
                    className={`relative col-span-10 font-serif text-[clamp(2.8rem,8vw,7.5rem)] leading-none transition-all duration-700 sm:col-span-5 ${
                      dim ? 'opacity-25' : 'opacity-100'
                    } ${on ? 'translate-x-3 italic text-[var(--accent)]' : ''}`}
                  >
                    {c.label}
                  </span>

                  <span className={`relative col-span-12 text-[15px] text-[var(--text-secondary)] transition-opacity duration-500 sm:col-span-3 ${dim ? 'opacity-30' : ''}`}>
                    {c.blurb}
                    <span className="label mt-2 block">
                      {products.length} formula{products.length > 1 ? 's' : ''} · from ${Math.min(...products.map((p) => p.price))}
                    </span>
                  </span>

                  {/* Fanned product thumbnails */}
                  <span className="relative col-span-12 flex h-24 items-center justify-start sm:col-span-3 sm:justify-end">
                    {products.map((p, k) => (
                      <motion.span
                        key={p.id}
                        className="relative -ml-6 block h-24 w-[72px] overflow-hidden rounded-t-full rounded-b-xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] first:ml-0 sm:h-28 sm:w-20"
                        initial={false}
                        animate={{
                          rotate: on ? (k - (products.length - 1) / 2) * 10 : 0,
                          x: on ? k * 18 : 0,
                          y: on ? -6 : 0,
                          scale: on ? 1.06 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                        style={{ zIndex: products.length - k }}
                      >
                        <img src={`${p.image}-320.webp`} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </motion.span>
                    ))}
                    <span className="ml-6 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[var(--text-primary)] group-hover:text-[var(--accent-ink)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
