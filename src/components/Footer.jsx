import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck, Leaf, Sparkles, Globe, Clock, MapPin } from 'lucide-react';
import { scrollToId } from '../lib/scroll';
import { VerenneLogo, VerenneMark } from './ui';

export default function Footer() {
  const ref = useRef(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('EN');

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
  };

  const currentGrasseTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris'
  }).format(new Date());

  const sitemap = [
    {
      title: 'Haute Formulations',
      links: [
        { label: 'Cleanse · 4 Formulas', id: 'collection' },
        { label: 'Treat · 4 Formulas', id: 'collection' },
        { label: 'Hydrate · 4 Formulas', id: 'collection' },
        { label: 'Restore · 4 Formulas', id: 'collection' },
        { label: 'Formulation Matrix', id: 'collection' }
      ]
    },
    {
      title: 'The Maison',
      links: [
        { label: 'Living Manifesto', id: 'manifesto' },
        { label: '72h Field-to-Still', id: 'manifesto' },
        { label: 'Swiss Violet Glass', id: 'origins' },
        { label: 'Botanical Compendium', id: 'categories' },
        { label: 'Press & Acclaim', id: 'press' }
      ]
    },
    {
      title: 'Client Concierge',
      links: [
        { label: 'Private Consultations', id: 'faq' },
        { label: 'Complimentary Shipping', id: 'faq' },
        { label: '30-Day Ritual Guarantee', id: 'faq' },
        { label: 'Batch Authentication', id: 'faq' },
        { label: 'Carbon-Neutral Tracking', id: 'faq' }
      ]
    }
  ];

  return (
    <footer ref={ref} className="relative bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] text-[var(--text-primary)] overflow-hidden">
      {/* 1. Newsletter Dispatch Tier (High-Converting Luxury Subscription) */}
      <div className="border-b border-[var(--border-subtle)] px-5 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="label text-[var(--accent)] font-semibold tracking-[0.2em]">The Seasonal Gazette</p>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
              One dispatch per solstice. Harvest notes, private batches, <em className="text-[var(--accent)] italic">nothing else.</em>
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] font-light max-w-md leading-relaxed">
              Subscribers receive early access to seasonal copper-still harvests and limited single-estate distillations before public release.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg lg:ml-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  disabled={sent}
                  className="w-full h-13 px-5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-secondary)]/60 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-13 px-8 rounded-full bg-[var(--text-primary)] text-[var(--accent-ink)] font-mono text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-black transition-all cursor-pointer shrink-0"
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
            <p className="mt-3 text-[11px] font-mono text-[var(--text-muted)] lg:text-right">
              {sent ? 'Welcome to the Maison circle. Your confirmation is in flight.' : 'Strict zero-spam policy. Unsubscribe at any time with a single tap.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Architecture & Multi-Column Sitemap */}
      <div className="px-5 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column & Grasse Heritage */}
          <div className="lg:col-span-4 space-y-6">
            <VerenneLogo markClassName="h-8 w-8" />
            <p className="text-[13px] text-[var(--text-secondary)] font-light leading-relaxed max-w-sm">
              Maison Verenne is an independent haute-botanique apothecary founded on the discipline of slow copper distillation, single-origin cold-pressed lipids, and biophotonic Swiss violet glass.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span>12 Rue de l’Oratoire, 06130 Grasse, France</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span>Atelier Hours: Mon–Sat 09:00–18:00 (CET {currentGrasseTime})</span>
              </div>
            </div>
          </div>

          {/* 3 Nav Columns */}
          {sitemap.map((col) => (
            <div key={col.title} className="lg:col-span-2 space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => scrollToId(link.id)}
                      className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Ethics & Certified Standards Box */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">
              Integrity Standards
            </p>
            <div className="space-y-3 text-[12px] font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISO 16128 Certified</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40">
                <Leaf className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>100% Recyclable Glass</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40">
                <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>Carbon Neutral Freight</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Refined Signature Watermark (Subtle, Sculpted, NOT Giant 25vw) */}
      <div className="border-t border-[var(--border-subtle)]/60 py-8 px-5 sm:px-10 select-none">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <VerenneMark className="h-6 w-6 text-[var(--accent)]" />
            <span className="font-serif text-lg tracking-[0.1em] uppercase text-[var(--text-primary)]">
              Maison Verenne
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">·</span>
            <span className="font-serif text-sm italic text-[var(--accent)]">
              Formulata Tarde · Natura Vivens
            </span>
          </div>

          {/* Currency & Language Controls */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1">
              <Globe className="w-3 h-3 text-[var(--text-muted)]" />
              <button
                type="button"
                onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')}
                className="hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                {language}
              </button>
              <span className="text-[var(--text-muted)]">/</span>
              <button
                type="button"
                onClick={() => setCurrency(currency === 'USD' ? 'EUR' : currency === 'EUR' ? 'GBP' : 'USD')}
                className="hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                {currency} ($)
              </button>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              © 2026 Verenne Inc. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
