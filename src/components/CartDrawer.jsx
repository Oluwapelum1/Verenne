import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { EASE, AnimatedPrice, PillButton, resolveAsset } from './ui';
import { lockScroll } from '../lib/scroll';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <AnimatePresence>{isCartOpen && <Drawer onClose={() => setIsCartOpen(false)} />}</AnimatePresence>;
}

function Drawer({ onClose }) {
  const {
    cart, updateQuantity, removeFromCart, clearCart, applyPromo, promoApplied, promoError,
    subtotal, discountAmount, shippingFee, shippingThreshold, total, totalItemsCount, ritualSuggestions, addToCart
  } = useCart();
  const [code, setCode] = useState('');
  const [step, setStep] = useState('cart');

  useEffect(() => {
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const pct = Math.min(100, (subtotal / shippingThreshold) * 100);
  const need = Math.max(0, shippingThreshold - subtotal);

  const checkout = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('done');
      clearCart();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[170]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside
        className="absolute bottom-2 right-2 top-2 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[var(--bg-primary)]"
        initial={{ x: '110%' }}
        animate={{ x: 0 }}
        exit={{ x: '110%' }}
        transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
      >
        <header className="flex items-center justify-between border-b border-[var(--border-subtle)] p-6">
          <h2 className="font-serif text-3xl">
            Bag <sup className="font-mono text-[11px] text-[var(--text-muted)]">{totalItemsCount}</sup>
          </h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-strong)]" aria-label="Close bag">
            <X className="h-4 w-4" />
          </button>
        </header>

        {step === 'done' ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-serif text-4xl">Thank you.</h3>
            <p className="mt-3 max-w-xs text-[14px] text-[var(--text-secondary)]">Your ritual is being packed by hand in Grasse. Tracking will follow by email.</p>
            <PillButton className="mt-8" onClick={onClose}>Back to Verenne</PillButton>
          </div>
        ) : step === 'processing' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border border-[var(--text-primary)] border-t-transparent motion-reduce:animate-none" />
            <p className="label">Securing your order</p>
          </div>
        ) : (
          <>
            {cart.length > 0 && (
              <div className="border-b border-[var(--border-subtle)] px-6 py-4">
                <p className="text-[13px] text-[var(--text-secondary)]">{need > 0 ? `$${need} away from free delivery` : 'Free delivery unlocked'}</p>
                <div className="mt-2 h-px bg-[var(--border-strong)]">
                  <motion.div className="h-px bg-[var(--accent)]" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: EASE }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-serif text-3xl">Your bag is empty.</p>
                  <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Sixteen formulations are waiting.</p>
                  <PillButton className="mt-6" onClick={onClose}>
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </PillButton>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.li key={item.cartItemId} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4">
                        <img src={`${resolveAsset(item.image || `/products/${item.id}`)}-320.webp`} alt={item.name} className="h-24 w-20 shrink-0 rounded-t-full rounded-b-xl object-cover" />
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-serif text-xl leading-tight">{item.name}</p>
                              <p className="label mt-1">{item.size}</p>
                            </div>
                            <p className="font-mono text-[13px] tabular-nums">${item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-[var(--border-subtle)]">
                              <button type="button" onClick={() => updateQuantity(item.cartItemId, -1)} className="grid h-8 w-8 place-items-center" aria-label="Decrease quantity">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center font-mono text-[12px]">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.cartItemId, 1)} className="grid h-8 w-8 place-items-center" aria-label="Increase quantity">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.cartItemId)} className="label underline-offset-4 hover:text-[var(--text-primary)] hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {cart.length > 0 && ritualSuggestions.length > 0 && (
                <div className="mt-10">
                  <p className="label">Complete the ritual</p>
                  <div className="mt-3 space-y-2">
                    {ritualSuggestions.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] p-2">
                        <img src={`${resolveAsset(p.image)}-320.webp`} alt={p.name} className="h-12 w-10 rounded-t-full rounded-b-md object-cover" />
                        <div className="flex-1">
                          <p className="font-serif text-lg leading-none">{p.name}</p>
                          <p className="font-mono text-[11px] text-[var(--text-muted)]">${p.price}</p>
                        </div>
                        <button type="button" onClick={() => addToCart(p)} className="mr-1 rounded-full border border-[var(--border-strong)] px-3 py-1.5 text-[11px] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]">
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="space-y-4 border-t border-[var(--border-subtle)] p-6">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyPromo(code);
                  }}
                >
                  <label htmlFor="promo" className="sr-only">Promo code</label>
                  <input
                    id="promo"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code — try BOTANICAL15"
                    className="flex-1 rounded-full border border-[var(--border-subtle)] bg-transparent px-4 py-2.5 text-[13px] uppercase placeholder:normal-case placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                  <button type="submit" className="rounded-full border border-[var(--border-strong)] px-4 text-[12px]">Apply</button>
                </form>
                {(promoApplied || promoError) && <p className={`text-[12px] ${promoApplied ? 'text-[var(--accent)]' : 'text-red-400'}`}>{promoApplied ? '15% applied' : promoError}</p>}

                <dl className="space-y-1.5 text-[14px] text-[var(--text-secondary)]">
                  <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">${subtotal.toFixed(2)}</dd></div>
                  {discountAmount > 0 && <div className="flex justify-between text-[var(--accent)]"><dt>Discount</dt><dd className="tabular-nums">−${discountAmount.toFixed(2)}</dd></div>}
                  <div className="flex justify-between"><dt>Delivery</dt><dd>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</dd></div>
                  <div className="flex items-baseline justify-between pt-2 text-[var(--text-primary)]">
                    <dt>Total</dt>
                    <dd className="font-serif text-3xl"><AnimatedPrice price={total.toFixed(2)} /></dd>
                  </div>
                </dl>
                <PillButton className="w-full" onClick={checkout}>
                  Checkout <ArrowRight className="h-3.5 w-3.5" />
                </PillButton>
              </footer>
            )}
          </>
        )}
      </motion.aside>
    </div>
  );
}
