import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Droplets, ShieldBan, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getProduct } from '../data';

// Words, with `{img:id}` tokens that become small inline photographs
const TEXT = 'We make {img:eclat-sauvage} sixteen formulations and nothing else. Wild flora, {img:brume-botanique} distilled in copper within hours of picking, bottled in {img:seve-doree} violet glass. Slow by design — because skin is too.';

function Word({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.38, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.22em] inline-block transition-opacity duration-300">
      {children}
    </motion.span>
  );
}

function Chip({ id, range, progress }) {
  const p = getProduct(id);
  const width = useTransform(progress, range, ['0.8em', '1.9em']);
  const opacity = useTransform(progress, range, [0.5, 1]);
  if (!p) return null;
  return (
    <motion.span style={{ width, opacity }} className="mr-[0.22em] inline-block h-[0.78em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline border border-[var(--border-strong)] bg-[var(--bg-secondary)]">
      <img src={`${p.image}-320.webp`} alt={p.name} className="h-full w-[1.9em] max-w-none object-cover" loading="eager" />
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const tokens = TEXT.split(' ');

  // Active Standard Pillar in the Interactive Alchemical Lab
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 'discipline',
      num: '16',
      tag: 'PILLAR I · EQUILIBRIUM',
      title: 'Curated Formulations',
      short: 'Why 16 and never more? Skin requires four non-negotiable metabolic phases.',
      fullExplanation:
        'Conventional skincare manufactures endless SKUs to fuel retail cycles, causing barrier confusion. Verenne engineers exactly 16 formulations: 4 Cleansers, 4 Treatments, 4 Hydrators, 4 Restoratives. A closed, harmonized biological ecosystem where every drop has an architectural purpose.',
      icon: Sparkles,
      interactiveType: 'matrix',
      metrics: [
        { label: 'Cleansing Rituals', value: '4 Formulas' },
        { label: 'Targeted Treatments', value: '4 Formulas' },
        { label: 'Hydration Dews', value: '4 Formulas' },
        { label: 'Nocturnal Salves', value: '4 Formulas' }
      ]
    },
    {
      id: 'kinetics',
      num: '72h',
      tag: 'PILLAR II · KINETICS',
      title: 'Field to Copper Still',
      short: 'Why 72 hours? Hand-picked at dawn in Grasse, cold-distilled before terpenes oxidize.',
      fullExplanation:
        'Standard commercial extracts sit in industrial storage for months before harsh chemical solvent extraction. Verenne wild flora is hand-gathered at first light, transferred under 4°C inert nitrogen, and gently steam-distilled in heritage copper alembics within 72 hours — locking in 98.4% of volatile phytochemicals.',
      icon: Clock,
      interactiveType: 'timeline',
      metrics: [
        { label: 'Harvest Window', value: '06:00 – 09:00' },
        { label: 'Cold Transit Temp', value: '4°C Inert N₂' },
        { label: 'Still Alembic', value: 'Solid Copper' },
        { label: 'Terpene Retention', value: '98.4%' }
      ]
    },
    {
      id: 'affinity',
      num: '99.4%',
      tag: 'PILLAR III · AFFINITY',
      title: 'Biomimetic Lipid Origin',
      short: 'Why 99.4%? Our lipid chains match human sebum molecule for molecule.',
      fullExplanation:
        'Conventional serums rely on cheap synthetic silicones that create a suffocating artificial film. Verenne utilizes cold-pressed virgin olive squalane, wild everlasting flower, and botanical ceramides that your stratum corneum recognizes as self, allowing immediate 14-second intercellular absorption.',
      icon: Droplets,
      interactiveType: 'affinity',
      metrics: [
        { label: 'Intercellular Absorption', value: '14 Seconds' },
        { label: 'Lipid Match', value: 'Skin-Identical' },
        { label: 'Pore Occlusion', value: '0.0 (Non-comedogenic)' },
        { label: 'Active Potency', value: '99.4%' }
      ]
    },
    {
      id: 'purity',
      num: '0%',
      tag: 'PILLAR IV · DISCIPLINE',
      title: 'Zero Synthetic Additives',
      short: 'Why 0%? An uncompromising institutional ban on artificial fillers and endocrine disruptors.',
      fullExplanation:
        'We enforce an absolute ban on silicones, parabens, phthalates, synthetic fragrance, and artificial colorants. Every amber drop derives its fragrance strictly from raw botanical steam distillates and its color from natural phytonutrients like chamazulene and cold-pressed sea buckthorn.',
      icon: ShieldBan,
      interactiveType: 'blacklist',
      metrics: [
        { label: 'Synthetic Fragrance', value: '0% Banned' },
        { label: 'Silicones & Dimethicones', value: '0% Banned' },
        { label: 'Petroleum Fillers', value: '0% Banned' },
        { label: 'Phthalates & Parabens', value: '0% Banned' }
      ]
    }
  ];

  const current = pillars[activePillar];

  return (
    <section id="manifesto" ref={ref} className="relative px-5 py-24 sm:px-10 sm:py-36">
      {/* Editorial Narrative */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="label">(01) — Manifesto</p>
        </div>
        <p className="font-serif text-[clamp(2rem,4.5vw,4.4rem)] leading-[1.08] tracking-[-0.02em] lg:col-span-9">
          {tokens.map((t, i) => {
            const start = i / tokens.length;
            const range = [start, Math.min(1, start + 1.5 / tokens.length)];
            const m = t.match(/^\{img:(.+)\}$/);
            if (m) return <Chip key={i} id={m[1]} range={range} progress={scrollYProgress} />;
            const italic = ['nothing', 'else.', 'Slow'].includes(t);
            return (
              <Word key={i} range={range} progress={scrollYProgress}>
                <span className={italic ? 'italic text-[var(--accent)]' : ''}>{t}</span>
              </Word>
            );
          })}
        </p>
      </div>

      {/* L'Atelier des Standards — Creative Interactive Alchemical Formulation Lab */}
      <div className="mx-auto mt-20 max-w-[1600px]">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">
              Haute-Apothecary Standards
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mt-1">
              The Four Inviolable Statutes
            </h3>
          </div>
          <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
            Select a statute to inspect clinical verification
          </p>
        </div>

        {/* 4 Interactive Statute Tab Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {pillars.map((pillar, idx) => {
            const isSelected = activePillar === idx;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(idx)}
                className={`relative p-5 sm:p-6 rounded-[22px] border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-xl'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/70'
                }`}
              >
                {/* Gold Highlight Pip */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                    {pillar.tag.split('·')[0].trim()}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] scale-125' : 'bg-white/20'
                    }`}
                  />
                </div>

                <p className="font-serif text-4xl sm:text-5xl font-light text-[var(--text-primary)] tracking-tight">
                  {pillar.num}
                </p>

                <h4 className="font-serif text-base sm:text-lg font-normal text-[var(--text-primary)] mt-2">
                  {pillar.title}
                </h4>

                <p className="text-[11px] text-[var(--text-secondary)] font-light mt-1 line-clamp-2 leading-relaxed">
                  {pillar.short}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Alchemical Console (The Purpose & Scientific Proof) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45 }}
            className="rounded-[32px] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow matching statute theme */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20 bg-[var(--accent)]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Deep Scientific Rationale */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(current.icon, { className: 'w-4 h-4 text-[var(--accent)]' })}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">
                    {current.tag}
                  </span>
                </div>

                <h4 className="font-serif text-3xl sm:text-5xl font-light text-[var(--text-primary)] leading-tight">
                  {current.title} — <span className="italic text-[var(--accent)]">{current.num}</span>
                </h4>

                <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[var(--text-secondary)] font-light">
                  {current.fullExplanation}
                </p>

                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                    Verified by Independent Chromatographic Bio-Assay (Grasse, France)
                  </span>
                </div>
              </div>

              {/* Right Column: Live Telemetry Grid */}
              <div className="lg:col-span-5 bg-[var(--bg-secondary)]/80 rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-7">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold block mb-4">
                  Clinical Telemetry Verification
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {current.metrics.map((m) => (
                    <div key={m.label} className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        {m.label}
                      </p>
                      <p className="font-serif text-xl sm:text-2xl font-normal text-[var(--text-primary)] mt-1">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-between text-[11px] font-mono text-[var(--accent)]">
                  <span>Maison Verenne Formulation Seal</span>
                  <span>CERTIFIED</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
