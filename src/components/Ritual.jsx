import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { RITUAL, getProduct } from '../data';
import { useCart } from '../context/CartContext';
import { EASE, PillButton } from './ui';

/**
 * Ritual — a dial that turns from dawn to dusk.
 * Four steps orbit the face of the dial; the centre shows the chosen step.
 * One button adds the entire routine to the bag.
 */
export default function Ritual() {
  const [mode, setMode] = useState('dawn');
  const [step, setStep] = useState(0);
  const { addToCart } = useCart();
  const steps = RITUAL[mode];
  const current = getProduct(steps[step].id);
  const total = steps.reduce((sum, s) => sum + getProduct(s.id).price, 0);
  const night = mode === 'dusk';

  const switchMode = (m) => {
    setMode(m);
    setStep(0);
  };

  const addAll = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    steps.forEach((s, i) => setTimeout(() => addToCart(getProduct(s.id), null, 1, i === 0 ? rect : null), i * 120));
  };

  return (
    <section id="ritual" className="relative overflow-hidden px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="ritual-title">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{
          background: night
            ? 'radial-gradient(60% 60% at 70% 50%, rgba(123,92,196,0.16), transparent 70%)'
            : 'radial-gradient(60% 60% at 70% 50%, rgba(226,178,106,0.14), transparent 70%)'
        }}
        transition={{ duration: 1.4 }}
      />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-16 lg:grid-cols-12">
        {/* Copy + steps */}
        <div className="lg:col-span-5">
          <p className="label">(05) — The ritual</p>
          <h2 id="ritual-title" className="mt-4 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95]">
            Four steps. <br />
            <em className="text-[var(--accent)]">{night ? 'Twice at night.' : 'Every morning.'}</em>
          </h2>

          <div role="tablist" aria-label="Time of day" className="mt-8 inline-flex rounded-full border border-[var(--border-subtle)] p-1">
            {[
              ['dawn', 'Dawn', Sun],
              ['dusk', 'Dusk', Moon]
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => switchMode(id)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-[13px] transition-colors ${mode === id ? 'text-[var(--accent-ink)]' : 'text-[var(--text-secondary)]'}`}
              >
                {mode === id && <motion.span layoutId="ritual-pill" className="absolute inset-0 rounded-full bg-[var(--text-primary)]" />}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <ol className="mt-10 border-t border-[var(--border-subtle)]">
            {steps.map((s, i) => {
              const p = getProduct(s.id);
              const on = i === step;
              return (
                <li key={`${mode}-${s.id}`} className="border-b border-[var(--border-subtle)]">
                  <button type="button" onClick={() => setStep(i)} onMouseEnter={() => setStep(i)} className="flex w-full items-center gap-5 py-4 text-left">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{s.time}</span>
                    <span className={`font-serif text-3xl transition-all duration-500 ${on ? 'translate-x-1 italic text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{s.verb}</span>
                    <span className="ml-auto text-right text-[13px] text-[var(--text-secondary)]">
                      {p.name}
                      <span className="block font-mono text-[11px] text-[var(--text-muted)]">${p.price}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PillButton onClick={addAll}>Add the {mode} ritual — ${total}</PillButton>
            <span className="label">Ships together · free delivery</span>
          </div>
        </div>

        {/* Dial */}
        <div className="relative mx-auto aspect-square w-full max-w-[600px] lg:col-span-7">
          <motion.div className="absolute inset-0" animate={{ rotate: night ? 180 : 0 }} transition={{ duration: 1.6, ease: [0.83, 0, 0.17, 1] }}>
            {/* rings & ticks */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(237,231,220,0.12)" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(237,231,220,0.08)" strokeDasharray="2 6" />
              {Array.from({ length: 60 }).map((_, i) => (
                <line key={i} x1="200" y1="6" x2="200" y2={i % 5 === 0 ? 18 : 12} stroke="rgba(237,231,220,0.25)" transform={`rotate(${i * 6} 200 200)`} />
              ))}
              <circle cx="200" cy="4" r="5" fill="#E2B26A" />
              <circle cx="200" cy="396" r="5" fill="#7B5CC4" />
            </svg>
          </motion.div>

          {/* Steps around the dial (not rotated, so labels stay legible) */}
          {steps.map((s, i) => {
            const angle = (-90 + 45 + i * 90) * (Math.PI / 180);
            const r = 41;
            const p = getProduct(s.id);
            const on = i === step;
            return (
              <motion.button
                key={`${mode}-${i}`}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`${s.verb}: ${p.fullName}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${50 + Math.cos(angle) * r}%`, top: `${50 + Math.sin(angle) * r}%` }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: on ? 1.15 : 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: EASE }}
              >
                <span className={`block h-14 w-14 overflow-hidden rounded-full border-2 transition-colors sm:h-16 sm:w-16 ${on ? 'border-[var(--text-primary)]' : 'border-[var(--border-subtle)]'}`}>
                  <img src={`${p.image}-320.webp`} alt="" className="h-full w-full object-cover" loading="lazy" />
                </span>
                <span className="label mt-2 block text-center">{String(i + 1).padStart(2, '0')}</span>
              </motion.button>
            );
          })}

          {/* Centre */}
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[40%] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${current.id}`}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="h-full w-full overflow-hidden rounded-t-full rounded-b-3xl border border-[var(--border-strong)]"
              >
                <img src={`${current.image}-600.webp`} alt={current.fullName} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

