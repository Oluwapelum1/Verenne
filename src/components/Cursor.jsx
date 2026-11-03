import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/**
 * Maison Verenne Ultra-Luxury Refined Magnetic Cursor
 * 
 * Design Philosophy:
 * - Razor-precise luminous champagne dewdrop dot (no content occlusion)
 * - Trailing weightless hairline glass ring with physical inertia
 * - Aerodynamic velocity elongation along trajectory
 * - Subtle, non-blocking context awareness: on interactive targets, the frosted ring smoothly blooms without opaque fills
 * - Concentric liquid dewdrop ripples on click
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState('default'); // 'default' | 'link' | 'interactive' | 'canvas' | 'text'
  const [tag, setTag] = useState('');
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [ripples, setRipples] = useState([]);

  // Raw pointer coordinates (instant, pinpoint)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Trailing ring with soft luxury spring physics
  const rx = useSpring(x, { stiffness: 380, damping: 28, mass: 0.35 });
  const ry = useSpring(y, { stiffness: 380, damping: 28, mass: 0.35 });

  // Velocity tracking for aerodynamic stretch
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });
  const [stretch, setStretch] = useState(1);
  const [angle, setAngle] = useState(0);

  const addRipple = useCallback((clickX, clickY) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-3), { id, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastPos.current.time);
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const speed = Math.hypot(dx, dy) / dt;

      if (speed > 0.2) {
        setAngle(Math.atan2(dy, dx) * (180 / Math.PI));
        setStretch(Math.min(1.35, 1 + speed * 0.1));
      } else {
        setStretch(1);
      }

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);

      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;

      const isCanvas = target.closest('canvas') || target.closest('[data-cursor-3d]');
      const isButton = target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('input');
      const isCard = target.closest('[data-cursor-card]') || target.closest('.group');

      if (isCanvas) {
        setHoverState('canvas');
        setTag('360°');
      } else if (isButton) {
        setHoverState('link');
        setTag('');
      } else if (isCard) {
        setHoverState('interactive');
        setTag('');
      } else {
        setHoverState('default');
        setTag('');
      }
    };

    const leave = () => setHidden(true);
    const md = (e) => {
      setDown(true);
      addRipple(e.clientX, e.clientY);
    };
    const mu = () => setDown(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', md);
    window.addEventListener('pointerup', mu);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', md);
      window.removeEventListener('pointerup', mu);
    };
  }, [x, y, addRipple]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[300] overflow-hidden transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      {/* 1. Click Dewdrop Ripples */}
      <AnimatePresence>
        {ripples.map((rip) => (
          <motion.div
            key={rip.id}
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute rounded-full border border-[var(--accent)]"
            style={{
              left: rip.x,
              top: rip.y,
              width: 28,
              height: 28,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* 2. Trailing Ethereal Hairline Ring */}
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full pointer-events-none"
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          rotate: hoverState === 'default' ? angle : 0
        }}
        animate={{
          width: hoverState === 'link' ? 44 : hoverState === 'canvas' ? 52 : hoverState === 'interactive' ? 38 : 28,
          height: hoverState === 'link' ? 44 : hoverState === 'canvas' ? 52 : hoverState === 'interactive' ? 38 : 28,
          scaleX: hoverState === 'default' ? stretch : 1,
          scaleY: hoverState === 'default' ? 2 - stretch : 1,
          borderColor: hoverState === 'link' ? 'rgba(226, 178, 106, 0.75)' : hoverState === 'canvas' ? 'rgba(226, 178, 106, 0.9)' : 'rgba(226, 178, 106, 0.35)',
          backgroundColor: hoverState === 'link' ? 'rgba(226, 178, 106, 0.08)' : 'transparent',
          scale: down ? 0.82 : 1
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <div className="absolute inset-0 rounded-full border border-current transition-colors" />

        {hoverState === 'canvas' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[var(--accent)]/50"
          />
        )}
      </motion.div>

      {/* 3. Center Pinpoint Dewdrop Dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-[var(--accent)] pointer-events-none shadow-[0_0_8px_var(--accent)]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          width: down ? 3 : hoverState === 'link' ? 7 : 5,
          height: down ? 3 : hoverState === 'link' ? 7 : 5,
          scale: down ? 0.7 : 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* 4. Non-Obtrusive Precision Floating Tag (Offset below, never covering center) */}
      {tag && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            x,
            y,
            transform: 'translate(-50%, 20px)'
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent)] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[var(--accent)]/30 shadow-lg">
            {tag}
          </span>
        </motion.div>
      )}
    </div>
  );
}
