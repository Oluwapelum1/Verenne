// Tiny bridge so any component can drive the single Lenis instance created in App.
let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const getLenis = () => lenis;

export function scrollToId(id, opts = {}) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, ...opts });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

export function lockScroll(lock) {
  if (typeof document === 'undefined') return;
  if (lock) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }
}

