import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { EASE } from './ui';

export default function AuraSwitcher() {
  const { aura, setAura, currentAura, auras, isOpen, setIsOpen } = useAura();

  return (
    <>
      {/* Floating Maison Aura Pill */}
      <aside aria-label="Atmospheric light palette controls" className="fixed bottom-5 left-5 z-[130]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="group flex items-center gap-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)]/85 px-4 py-2.5 backdrop-blur-md shadow-2xl transition-all hover:scale-105 hover:border-[var(--text-primary)]"
          title="Switch atmospheric lighting"
        >
          <span
            className="h-2.5 w-2.5 rounded-full animate-pulse shadow-xs"
            style={{ backgroundColor: currentAura.color }}
          />
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
            Aura: {currentAura.name}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
            (4)
          </span>
        </button>
      </aside>

      {/* Atmospheric Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="aura-modal-title"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative w-full max-w-md rounded-[32px] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 sm:p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                  <h3 id="aura-modal-title" className="font-serif text-2xl font-normal text-[var(--text-primary)]">
                    Atmospheric Light
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Close atmosphere dialog"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                Calibrate the boutique atelier lighting across four circadian spectrums.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2.5">
                {auras.map((a) => {
                  const on = a.id === aura;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setAura(a.id);
                        setTimeout(() => setIsOpen(false), 200);
                      }}
                      className={`group flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                        on
                          ? 'border-[var(--text-primary)] bg-[var(--bg-surface-elevated)] shadow-sm'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-6 w-6 rounded-full border border-white/20 shadow-inner flex items-center justify-center shrink-0"
                          style={{ backgroundColor: a.color }}
                        >
                          {on && <Check className="h-3 w-3 text-white" />}
                        </span>
                        <div>
                          <span className="font-serif text-lg font-normal text-[var(--text-primary)] block">
                            {a.name}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-muted)] block">
                            {a.label}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent)]">
                        {a.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>VERENNE LIGHT SPECTRUM</span>
                <span>46°12′N GRASSE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

