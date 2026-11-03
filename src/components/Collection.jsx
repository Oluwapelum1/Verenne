import React, { useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data';
import { useCart } from '../context/CartContext';
import { ProductImage } from './ui';

export default function Collection({ category, setCategory, onOpenProduct }) {
  const { addToCart } = useCart();
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const items = useMemo(() => PRODUCTS.filter((p) => cat.ids.includes(p.id)), [cat]);
  const editorial = cat.id === 'all';

  return (
    <section id="collection" className="tone-light px-5 py-20 sm:px-10 sm:py-28" aria-labelledby="collection-title">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-strong)] pb-6 lg:flex-row lg:items-end">
          <div>
            <h2 id="collection-title" className="font-serif text-[clamp(2.6rem,5.5vw,5.4rem)] leading-none tracking-[-0.02em]">
              {cat.title}
            </h2>
            <p className="mt-4 max-w-xl text-[16px] text-[var(--text-secondary)]">{cat.blurb}</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === cat.id}
                onClick={() => setCategory(c.id)}
                className={`py-1 text-[15px] underline-offset-[6px] transition-colors hover:text-[var(--accent)] ${
                  c.id === cat.id ? 'underline decoration-1' : 'text-[var(--text-secondary)]'
                }`}
              >
                {c.id === 'all' ? 'All' : c.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 [grid-auto-flow:dense] lg:grid-cols-4 lg:gap-x-6">
          {items.map((p, i) => {
            // Every fifth product in the full view takes a large tile, alternating sides
            const large = editorial && i % 5 === 0;
            const right = large && i % 10 === 5;
            return (
              <li key={p.id} className={`flex flex-col ${large ? 'col-span-2 lg:row-span-2' : ''} ${right ? 'lg:col-start-3' : ''}`}>
                <button
                  type="button"
                  onClick={() => onOpenProduct(p)}
                  className="group flex flex-1 flex-col text-left"
                  aria-label={`View ${p.fullName}`}
                >
                  <span className={`relative block overflow-hidden bg-[var(--bg-secondary)] ${large ? 'aspect-[4/5] lg:aspect-auto lg:min-h-0 lg:flex-1' : 'aspect-[4/5]'}`}>
                    <ProductImage
                      product={p}
                      sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className={`mt-4 block font-serif leading-tight ${large ? 'text-[clamp(1.8rem,3vw,2.8rem)]' : 'text-[22px]'}`}>{p.name}</span>
                  <span className="mt-1 block text-[14px] text-[var(--text-secondary)]">{p.subtitle}</span>
                </button>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[15px] tabular-nums">${p.price}</span>
                  <button
                    type="button"
                    onClick={(e) => addToCart(p, p.sizes[0], 1, e.currentTarget.getBoundingClientRect())}
                    className="text-[14px] underline decoration-1 underline-offset-[5px] hover:text-[var(--accent)]"
                    aria-label={`Add ${p.name} to bag`}
                  >
                    Add to bag
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
