import React from 'react';

const STANDARDS = [
  { num: '16', title: 'A focused range', text: 'Four formulas each to cleanse, treat, hydrate and restore. Nothing beyond that.' },
  { num: '72h', title: 'Field to still', text: 'Plants are picked by hand at dawn and distilled in copper within 72 hours.' },
  { num: '4', title: 'Known origins', text: 'Corsica, Morocco, the Horn of Africa and Grasse, from the same growers every year.' },
  { num: '0', title: 'Synthetic fragrance', text: 'No silicones, parabens, phthalates or artificial colour in any formula.' }
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="manifesto-title">
      <div className="mx-auto max-w-[1600px]">
        <p className="label">Why Verenne</p>
        <h2 id="manifesto-title" className="mt-4 max-w-4xl font-serif text-[clamp(2rem,4vw,3.6rem)] leading-[1.08] tracking-[-0.02em]">
          We make sixteen formulations and <em className="text-[var(--accent)]">nothing else.</em>
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[var(--text-secondary)]">
          Wild plants, distilled soon after picking and bottled in dark glass. Slow by design, because skin is too.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
          {STANDARDS.map((s) => (
            <li key={s.title} className="bg-[var(--bg-primary)] p-6 sm:p-8">
              <p className="font-serif text-5xl font-light">{s.num}</p>
              <h3 className="mt-4 text-[15px] font-medium">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
