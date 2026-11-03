import React from 'react';
import { BOTANICALS } from '../data';

export default function Origins() {
  return (
    <section id="origins" className="tone-light px-5 py-20 sm:px-10 sm:py-32" aria-labelledby="origins-title">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="origins-title" className="font-serif text-[clamp(2.6rem,5.5vw,5.4rem)] leading-none tracking-[-0.02em]">
          Four places, <em>one harvest each.</em>
        </h2>
        <p className="mt-5 max-w-xl text-[17px] text-[var(--text-secondary)]">
          We buy from the same growers every year, at a price agreed before the season.
        </p>

        <ul className="mt-12 border-t border-[var(--border-strong)]">
          {BOTANICALS.map((b) => (
            <li key={b.latin} className="grid grid-cols-1 gap-3 border-b border-[var(--border-strong)] py-7 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <h3 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-tight">{b.common}</h3>
                <p className="mt-1 text-[15px] italic text-[var(--text-secondary)]">{b.latin}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-[15px] lg:col-span-4">
                <div>
                  <dt className="label">Origin</dt>
                  <dd className="mt-1">{b.origin}</dd>
                </div>
                <div>
                  <dt className="label">Harvest</dt>
                  <dd className="mt-1">{b.harvest}</dd>
                </div>
              </dl>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] lg:col-span-4">{b.story}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
