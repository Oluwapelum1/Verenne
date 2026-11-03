import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, Droplets } from 'lucide-react';

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  const messages = [
    {
      icon: Truck,
      text: 'Complimentary Carbon-Neutral Worldwide Shipping on Orders Over $150'
    },
    {
      icon: Sparkles,
      text: 'Batch 04 Now Bottled in Grasse · Pure Single-Still Distillations'
    },
    {
      icon: Droplets,
      text: 'Complimentary 3-Piece Discovery Ritual with Every Flacon Order'
    },
    {
      icon: ShieldCheck,
      text: '100% Botanical Origin Guarantee · 30-Day On-Skin Satisfaction Policy'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  const current = messages[index];
  const Icon = current.icon;

  return (
    <div className="relative z-[130] w-full bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] py-2 px-4 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
        <span className="hidden md:inline text-[var(--accent)] font-semibold">
          Maison Verenne · Grasse
        </span>

        <div className="flex-1 flex justify-center items-center overflow-hidden h-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex items-center gap-2 text-[var(--text-primary)]"
            >
              <Icon className="w-3 h-3 text-[var(--accent)] shrink-0" />
              <span className="text-[10.5px] sm:text-[11.5px] tracking-widest">{current.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
          <span>EUR · USD · GBP</span>
          <span>Paris Time</span>
        </div>
      </div>
    </div>
  );
}

