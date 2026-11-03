import React from 'react';
import { PRESS } from '../data';

/** Press & customer voices — a slow, endless ribbon of quotes */
export default function Press() {
  const row = [...PRESS, ...PRESS];
  return (
    <section id="press" className="overflow-hidden border-y border-[var(--border-subtle)] py-20" aria-label="Press and reviews">
      <p className="label mb-10 px-5 sm:px-10">Said about us · 4.9 average from 594 reviews</p>
      <div className="marquee-track flex w-max gap-16" style={{ '--marquee-speed': '70s' }}>
        {row.map((q, i) => (
          <figure key={i} className="flex w-[80vw] max-w-[640px] shrink-0 items-start gap-6 sm:w-[46vw]" aria-hidden={i >= PRESS.length}>
            <span className="font-serif text-6xl leading-none text-[var(--accent)]">“</span>
            <div>
              <blockquote className="font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15]">{q.quote}</blockquote>
              <figcaption className="label mt-5">
                {q.author} — {q.role}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

