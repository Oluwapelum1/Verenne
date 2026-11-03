import React, { useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider, useCart } from './context/CartContext';
import { AuraProvider } from './context/AuraContext';
import { setLenis } from './lib/scroll';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Categories from './components/Categories';
import Collection from './components/Collection';
import OnSkin from './components/OnSkin';
import Ritual from './components/Ritual';
import Origins from './components/Origins';
import Press from './components/Press';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import AuraSwitcher from './components/AuraSwitcher';
import { FlyToCartOverlay, EASE } from './components/ui';

function Storefront() {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState('all');
  const { toastMessage } = useCart();

  // Smooth scroll (skipped for reduced-motion users)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    setLenis(lenis);
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const openProduct = useCallback((p) => setProduct(p), []);
  const closeProduct = useCallback(() => setProduct(null), []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden="true" />

      <Navbar onOpenProduct={openProduct} />

      <main>
        <Hero onOpenProduct={openProduct} />
        <Manifesto />
        <Categories setCategory={setCategory} />
        <Collection category={category} setCategory={setCategory} onOpenProduct={openProduct} />
        <OnSkin onOpenProduct={openProduct} />
        <Ritual />
        <Origins />
        <Press />
        <FAQ />
      </main>

      <Footer />

      <CartDrawer />
      <ProductDetailModal product={product} onClose={closeProduct} onSwitch={openProduct} />
      <FlyToCartOverlay />

      {/* Toast */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[250] -translate-x-1/2" role="status" aria-live="polite">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key={toastMessage}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-3 whitespace-nowrap rounded-full bg-[var(--text-primary)] py-2.5 pl-3 pr-5 text-[13px] text-[var(--accent-ink)] shadow-2xl"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuraProvider>
      <CartProvider>
        <Storefront />
        <AuraSwitcher />
      </CartProvider>
    </AuraProvider>
  );
}
