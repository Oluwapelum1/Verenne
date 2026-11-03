import React from 'react';

const STANDARDS = [
  { num: '16', title: 'A focused range', text: 'Four formulas each to cleanse, treat, hydrate and restore. Nothing beyond that.' },
  { num: '72h', title: 'Field to still', text: 'Plants are picked by hand at dawn and distilled in copper within 72 hours.' },
  { num: '4', title: 'Known origins', text: 'Corsica, Morocco, the Horn of Africa and Grasse, from the same growers every year.' },
  { num: '0', title: 'Synthetic fragrance', text: 'No silicones, parabens, phthalates or artificial colour in any formula.' }
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="px-5 py-20 sm:px-10 sm:py-32" aria-labelledby="manifesto-title">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="manifesto-title" className="font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[1.02] tracking-[-0.02em]">
            We make sixteen formulations and <em>nothing else.</em>
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Wild plants, distilled soon after picking and bottled in dark glass. Slow by design, because skin is too.
          </p>
        </div>

        <ul className="border-t border-[var(--border-strong)] lg:col-span-6 lg:col-start-7">
          {STANDARDS.map((s) => (
            <li key={s.title} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-[var(--border-strong)] py-6 sm:grid-cols-[8rem_1fr]">
              <p className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none text-[var(--accent)]">{s.num}</p>
              <div>
                <h3 className="text-[17px] font-medium">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-secondary)]">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
