import React, { useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data';
import { useCart } from '../context/CartContext';
import { ProductImage } from './ui';

export default function Collection({ category, setCategory, onOpenProduct }) {
  const { addToCart } = useCart();
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const items = useMemo(() => PRODUCTS.filter((p) => cat.ids.includes(p.id)), [cat]);

  return (
    <section id="collection" className="px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="collection-title">
      <div className="mx-auto max-w-[1600px]">
        <p className="label">The collection</p>
        <h2 id="collection-title" className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-none tracking-[-0.02em]">
          {cat.title}
        </h2>
        <p className="mt-4 max-w-xl text-[16px] text-[var(--text-secondary)]">{cat.blurb}</p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === cat.id}
              onClick={() => setCategory(c.id)}
              className={`h-10 rounded-full border px-4 text-[13px] transition-colors ${
                c.id === cat.id
                  ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--accent-ink)]'
                  : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {c.id === 'all' ? 'All' : c.label} ({c.ids.length})
            </button>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {items.map((p) => (
            <li key={p.id} className="flex flex-col">
              <button type="button" onClick={() => onOpenProduct(p)} className="group block text-left" aria-label={`View ${p.fullName}`}>
                <span className="block aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                  <ProductImage
                    product={p}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-4 block font-serif text-2xl leading-tight">{p.name}</span>
                <span className="mt-1 block text-[14px] text-[var(--text-secondary)]">{p.subtitle}</span>
              </button>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                <span className="text-[14px] tabular-nums">From ${p.price}</span>
                <button
                  type="button"
                  onClick={(e) => addToCart(p, p.sizes[0], 1, e.currentTarget.getBoundingClientRect())}
                  className="h-9 rounded-full border border-[var(--border-strong)] px-3.5 text-[12px] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]"
                  aria-label={`Add ${p.name} to bag`}
                >
                  Add to bag
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
