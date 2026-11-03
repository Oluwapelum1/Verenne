import React from 'react';
import { BOTANICALS } from '../data';

export default function Origins() {
  return (
    <section id="origins" className="px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="origins-title">
      <div className="mx-auto max-w-[1600px]">
        <p className="label">Origins</p>
        <h2 id="origins-title" className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-none tracking-[-0.02em]">
          Four places, <em className="text-[var(--accent)]">one harvest each.</em>
        </h2>
        <p className="mt-4 max-w-xl text-[16px] text-[var(--text-secondary)]">
          We buy from the same growers every year, at a price agreed before the season.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOTANICALS.map((b) => (
            <article key={b.latin} className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 p-6">
              <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl leading-tight">{b.common}</h3>
              <p className="mt-1 text-[14px] italic text-[var(--text-secondary)]">{b.latin}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-4 text-[14px]">
                <div>
                  <dt className="label">Origin</dt>
                  <dd className="mt-1">{b.origin}</dd>
                </div>
                <div>
                  <dt className="label">Harvest</dt>
                  <dd className="mt-1">{b.harvest}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">{b.story}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
