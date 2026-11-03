import React from 'react';
import { PRESS } from '../data';

export default function Press() {
  return (
    <section id="press" className="border-y border-[var(--border-subtle)] px-5 py-20 sm:px-10 sm:py-28" aria-label="Customer reviews">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {PRESS.map((q) => (
          <figure key={q.author}>
            <blockquote className="font-serif text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1]">“{q.quote}”</blockquote>
            <figcaption className="mt-5 text-[15px] text-[var(--text-secondary)]">
              {q.author}, {q.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
