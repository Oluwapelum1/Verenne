import React from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../data';

/** FAQ — native exclusive <details> accordion (one open at a time via `name`) */
export default function FAQ() {
  return (
    <section id="faq" className="px-5 py-24 sm:px-10 sm:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label">Questions</p>
          <h2 id="faq-title" className="mt-4 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95]">
            Asked, <em className="text-[var(--accent)]">answered.</em>
          </h2>
        </div>
        <div className="border-t border-[var(--border-subtle)] lg:col-span-8">
          {FAQS.map((f, i) => (
            <details key={f.q} name="faq" className="group border-b border-[var(--border-subtle)]" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-2xl sm:text-3xl">{f.q}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] transition-transform duration-500 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
