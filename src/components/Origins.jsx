import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { BOTANICALS } from '../data';

/**
 * Origins — a pinned horizontal journey through the four signature botanicals.
 * Vertical scroll drives the track sideways.
 */
export default function Origins() {
  const ref = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const measure = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section id="origins" ref={ref} className="relative" style={{ height: reduced ? 'auto' : `${(BOTANICALS.length + 1) * 80}vh` }} aria-labelledby="origins-title">
      <div className={reduced ? 'py-24' : 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden'}>
        <motion.div ref={track} style={reduced ? {} : { x }} className={`flex ${reduced ? 'flex-col gap-6 px-5' : 'w-max'}`}>
          {/* Intro panel */}
          <div className="flex w-[100vw] shrink-0 flex-col justify-center px-5 sm:px-10 lg:w-[50vw]">
            <p className="label">(06) — Origins</p>
            <h2 id="origins-title" className="mt-4 font-serif text-[clamp(3rem,7vw,7rem)] leading-[0.9]">
              Four places, <br />
              <em className="text-[var(--accent)]">one harvest each.</em>
            </h2>
            <p className="mt-6 max-w-md text-[15px] text-[var(--text-secondary)]">
              We buy from the same growers every year, at a price agreed before the season. Scroll to travel.
            </p>
          </div>

          {BOTANICALS.map((b, i) => (
            <article key={b.latin} className="flex w-[100vw] shrink-0 items-center px-5 sm:px-10 lg:w-[62vw]">
              <div className="grid w-full grid-cols-1 items-center gap-8 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 p-8 sm:grid-cols-2 sm:p-12">
                {/* Essence orb */}
                <div className="relative mx-auto aspect-square w-full max-w-[320px]">
                  <div className="spin-slow absolute inset-0 rounded-full border border-dashed border-[var(--border-strong)]" />
                  <div
                    className="absolute inset-[14%] rounded-full"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, #fff8 0%, ${b.color} 30%, ${b.color}55 65%, transparent 72%)`,
                      boxShadow: `0 0 120px ${b.color}44`
                    }}
                  />
                  <span className="label absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] px-2">{b.coords}</span>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">0{i + 1} / 0{BOTANICALS.length}</span>
                  <h3 className="mt-3 font-serif text-5xl italic leading-none sm:text-6xl">{b.latin}</h3>
                  <p className="mt-2 text-[var(--text-secondary)]">{b.common}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--border-subtle)] pt-6">
                    <div>
                      <dt className="label">Origin</dt>
                      <dd className="mt-1 text-[14px]">{b.origin}</dd>
                    </div>
                    <div>
                      <dt className="label">Harvest</dt>
                      <dd className="mt-1 text-[14px]">{b.harvest}</dd>
                    </div>
                  </dl>
                  <p className="mt-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">{b.story}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {!reduced && (
          <div className="absolute inset-x-5 bottom-10 h-px bg-[var(--border-subtle)] sm:inset-x-10">
            <motion.div style={{ width: bar }} className="h-full bg-[var(--text-primary)]" />
          </div>
        )}
      </div>
    </section>
  );
}
