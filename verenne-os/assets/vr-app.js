/*
 * Verenne theme — storefront behaviour for the vr-* sections.
 * The same markup, Tailwind classes, timings and easing curves as the Verenne web app.
 * Products, categories and ritual steps are printed into the page as JSON by the sections
 * (snippets/vr-product-json.liquid); the bag is the store's real cart via the Cart AJAX API.
 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const readJson = (sel) =>
    $$(sel)
      .map((el) => {
        try {
          return JSON.parse(el.textContent);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const QUINT = 'cubic-bezier(0.83, 0, 0.17, 1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CUR = window.VR_CURRENCY || '$';
  // Shopper-facing text comes from the theme's locale files (snippets/vr-strings.liquid)
  const STRINGS = window.VR_STRINGS || {};
  const t = (key, vars = {}) => Object.keys(vars).reduce((str, k) => str.split(`[${k}]`).join(vars[k]), STRINGS[key] || key);
  const ROUTES = window.VR_ROUTES || { cart: '/cart', cartAdd: '/cart/add', cartChange: '/cart/change', cartUpdate: '/cart/update', root: '/' };

  // Optional product details live in the `verenne.details` metafield; defaults keep every view intact without it
  const DEFAULT_GLASS = { shape: 'dropper', color: '#7A3F12', liquid: '#E08A2E' };
  const normalise = (raw) => {
    const d = raw.details || {};
    return {
      ...raw,
      ...d,
      subtitle: d.subtitle || raw.subtitle || '',
      description: d.description || raw.description || '',
      notes: d.notes || [],
      keyIngredients: d.keyIngredients || [],
      benefits: d.benefits || [],
      glow: d.glow || '#E0935F',
      glass: d.glass || DEFAULT_GLASS,
      rating: raw.rating,
      reviewsCount: raw.reviewsCount,
      sizes: raw.sizes && raw.sizes.length ? raw.sizes.map((x) => ({ ...x, size: x.size || 'Standard' })) : [{ size: 'Standard', price: raw.price }]
    };
  };
  const PRODUCTS = [];
  readJson('script[data-vr-products]')
    .flat()
    .forEach((raw) => {
      if (raw && !PRODUCTS.some((p) => p.id === raw.id)) PRODUCTS.push(normalise(raw));
    });
  const CATEGORIES = readJson('script[data-vr-categories]')[0] || [{ id: 'all', label: 'All', title: '', blurb: '', ids: PRODUCTS.map((p) => p.id) }];
  const RITUAL = readJson('script[data-vr-ritual-data]')[0] || { dawn: [], dusk: [] };
  const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const categoryOf = (id) => CATEGORIES.find((c) => c.id !== 'all' && c.ids.includes(id));
  const imgUrl = (p, w) => (p && p.images && (p.images[w] || p.images['600'])) || '';
  // Cart line images arrive as plain CDN URLs; ask the CDN for a small rendition
  const sized = (url, w) => {
    if (!url) return '';
    if (/[?&]width=\d+/.test(url)) return url.replace(/([?&])width=\d+/, `$1width=${w}`);
    return `${url}${url.includes('?') ? '&' : '?'}width=${w}`;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const html = (str) => {
    const t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.firstElementChild;
  };
  const animate = (el, frames, opts) =>
    el && el.animate ? el.animate(frames, { fill: 'forwards', easing: EASE, ...opts }) : { finished: Promise.resolve(), cancel() {} };

  /* ------------------------------------------------------------------ */
  /* Icons (lucide-react output)                                         */
  /* ------------------------------------------------------------------ */
  const ICON_PATHS = {
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    minus: '<path d="M5 12h14"></path>',
    plus: '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
    'arrow-right': '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>',
    heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>',
    sparkles: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>'
  };
  const icon = (name, cls) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name} ${cls}" aria-hidden="true">${ICON_PATHS[name]}</svg>`;

  /* ------------------------------------------------------------------ */
  /* Shared UI pieces (src/components/ui.jsx)                            */
  /* ------------------------------------------------------------------ */
  function productImage(p, { className = '', sizes = '(max-width: 768px) 60vw, 30vw', eager = false, alt } = {}) {
    if (!imgUrl(p, '600')) return '';
    return `<img src="${imgUrl(p, '600')}" srcset="${imgUrl(p, '320')} 320w, ${imgUrl(p, '600')} 600w, ${imgUrl(p, '1200')} 1200w" sizes="${sizes}" alt="${esc(alt ?? `${p.fullName}${p.subtitle ? ` — ${p.subtitle}` : ''}`)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false" class="select-none ${className}">`;
  }

  function pillButton(label, { variant = 'solid', className = '', attrs = '' } = {}) {
    const solid = variant === 'solid';
    return `<button type="button" ${attrs} class="group relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-4 text-[15px] font-medium transition-colors duration-500 ${
      solid ? 'bg-[var(--text-primary)] text-[var(--accent-ink)]' : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:text-[var(--accent-ink)]'
    } ${className}"><span aria-hidden="true" class="absolute inset-0 translate-y-[101%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${
      solid ? 'bg-[var(--accent)]' : 'bg-[var(--text-primary)]'
    }"></span><span class="relative z-10 inline-flex items-center gap-2">${label}</span></button>`;
  }

  // AnimatedPrice: the number rolls vertically when it changes
  function animatedPrice(price, className = '') {
    return `<span class="inline-flex items-baseline overflow-hidden ${className}" data-vr-price="${price}"><span class="mr-[0.08em] text-[0.6em] opacity-70">$</span><span class="inline-block tabular-nums">${price}</span></span>`;
  }
  function rollPrice(wrap, price) {
    if (!wrap || wrap.dataset.vrPrice === String(price)) return;
    wrap.dataset.vrPrice = price;
    const old = wrap.lastElementChild;
    const next = html(`<span class="inline-block tabular-nums">${price}</span>`);
    old.style.position = 'absolute';
    animate(old, [{ transform: 'translateY(0%)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: 400 }).finished.then(() => old.remove());
    wrap.appendChild(next);
    animate(next, [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0%)', opacity: 1 }], { duration: 400 });
  }

  // TextureBlob: a morphing liquid swatch
  function textureBlob(color, className) {
    return `<span aria-hidden="true" data-vr-blob class="block ${className}" style="background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, ${color} 26%, ${color}AA 60%, rgba(0,0,0,0.4) 100%); box-shadow: 0 0 40px ${color}55, inset -6px -10px 18px rgba(0,0,0,0.35); border-radius: 58% 42% 55% 45% / 46% 54% 46% 54%;"></span>`;
  }
  function startBlobs(root) {
    $$('[data-vr-blob]', root).forEach((el) =>
      el.animate(
        [
          { borderRadius: '58% 42% 55% 45% / 46% 54% 46% 54%', transform: 'rotate(0deg)' },
          { borderRadius: '42% 58% 46% 54% / 56% 44% 58% 42%', transform: 'rotate(40deg)' },
          { borderRadius: '52% 48% 38% 62% / 42% 58% 44% 56%', transform: 'rotate(-20deg)' },
          { borderRadius: '58% 42% 55% 45% / 46% 54% 46% 54%', transform: 'rotate(0deg)' }
        ],
        { duration: 9000, iterations: Infinity, easing: 'ease-in-out' }
      )
    );
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scroll (App.jsx + lib/scroll.js)                             */
  /* ------------------------------------------------------------------ */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  function scrollToId(id, opts = {}) {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6, ...opts });
    else el.scrollIntoView({ behavior: 'smooth' });
  }

  let locks = 0;
  function lockScroll(lock) {
    locks = Math.max(0, locks + (lock ? 1 : -1));
    const on = locks > 0;
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
    if (lenis) on ? lenis.stop() : lenis.start();
  }

  /* ------------------------------------------------------------------ */
  /* Cart store (context/CartContext.jsx)                                */
  /* ------------------------------------------------------------------ */
  const store = {
    cart: [],
    promoApplied: false,
    promoError: '',
    listeners: [],
    subtotal: 0,
    discountAmount: 0,
    total: 0,
    count: 0,
    shippingThreshold: Number(window.VR_FREE_SHIPPING) || 120,
    subscribe(fn) {
      this.listeners.push(fn);
    },
    emit() {
      this.listeners.forEach((fn) => fn());
    },
    // Mirrors a /cart.js response into the shape the bag renders
    load(c) {
      // Shopify lists the newest line first; the bag shows lines in the order they were added
      this.cart = c.items.slice().reverse().map((i) => ({
        cartItemId: i.key,
        id: i.handle,
        name: i.product_title,
        image: (PRODUCTS.some((p) => p.id === i.handle) && imgUrl(getProduct(i.handle), '320')) || sized(i.image, 320),
        price: i.final_price / 100,
        size: i.variant_title || 'Standard',
        quantity: i.quantity
      }));
      this.subtotal = c.items_subtotal_price / 100;
      this.total = c.total_price / 100;
      this.discountAmount = Math.max(0, (c.items_subtotal_price - c.total_price) / 100);
      this.count = c.item_count;
      this.promoApplied = (c.discount_codes || []).some((d) => d.applicable);
      this.emit();
    },
    get suggestions() {
      return PRODUCTS.filter((p) => !this.cart.some((c) => c.id === p.id)).slice(0, 2);
    }
  };

  const cartRequest = (url, body) =>
    fetch(`${url}.js`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    }).then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))));
  const refreshCart = () => cartRequest(ROUTES.cart).then((c) => store.load(c));

  function addToCart(product, sizeVariant = null, quantity = 1, rect = null) {
    const selected =
      (typeof sizeVariant === 'string' ? product.sizes?.find((x) => x.size === sizeVariant) : sizeVariant) ||
      product.sizes?.[0] || { size: 'Standard', price: product.price };

    if (rect) flyToCart(rect, product);
    else bounceBag();

    if (!selected.variantId) return;
    cartRequest(ROUTES.cartAdd, { items: [{ id: selected.variantId, quantity }] })
      .then(() => {
        toast(t('toast.added', { product: `${product.fullName || product.name}${selected.size && selected.size !== 'Standard' ? ` · ${selected.size}` : ''}` }));
        return refreshCart();
      })
      .catch((e) => toast((e && e.description) || t('toast.unavailable')));
  }

  function updateQuantity(cartItemId, delta) {
    const item = store.cart.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    cartRequest(ROUTES.cartChange, { id: cartItemId, quantity: Math.max(0, item.quantity + delta) }).then((c) => store.load(c));
  }

  function removeFromCart(cartItemId) {
    return cartRequest(ROUTES.cartChange, { id: cartItemId, quantity: 0 }).then((c) => store.load(c));
  }

  function applyPromo(code) {
    const clean = code.trim();
    if (!clean) return;
    cartRequest(ROUTES.cartUpdate, { discount: clean })
      .then((c) => {
        const match = (c.discount_codes || []).find((d) => d.code.toUpperCase() === clean.toUpperCase());
        store.promoError = match && match.applicable ? '' : t('bag.code_invalid');
        store.load(c);
        if (!store.promoError) toast(t('toast.code_applied', { code: clean.toUpperCase() }));
      })
      .catch(() => {
        store.promoError = t('bag.code_invalid');
        store.emit();
      });
  }

  /* ------------------------------------------------------------------ */
  /* Toast, fly-to-cart, bag bounce (App.jsx + ui.jsx)                   */
  /* ------------------------------------------------------------------ */
  let toastTimer = null;
  function toast(msg) {
    const root = $('[data-vr-toast-root]');
    if (!root) return;
    const prev = root.firstElementChild;
    if (prev) animate(prev, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 400 }).finished.then(() => prev.remove());
    const el = html(
      `<div class="flex items-center gap-3 whitespace-nowrap rounded-full bg-[var(--text-primary)] py-2.5 pl-3 pr-5 text-[13px] text-[var(--accent-ink)] shadow-2xl"><span class="h-2 w-2 rounded-full bg-[var(--accent)]"></span>${esc(msg)}</div>`
    );
    if (prev) el.style.position = 'absolute';
    root.appendChild(el);
    animate(el, [{ opacity: 0, transform: 'translateY(20px) scale(0.95)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 400 }).finished.then(() => (el.style.position = ''));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      const cur = root.firstElementChild;
      if (cur) animate(cur, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 400 }).finished.then(() => cur.remove());
    }, 3200);
  }

  function bounceBag() {
    const bag = $('[data-vr-bag-open]');
    if (bag) bag.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(0.94)' }, { transform: 'scale(1)' }], { duration: 500 });
  }

  function flyToCart(rect, product) {
    const layer = $('[data-vr-fly]');
    if (!layer) return bounceBag();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const targetX = window.innerWidth - 56;
    const targetY = 34;
    layer.hidden = false;
    const el = html(
      `<div class="absolute -left-8 -top-10 h-20 w-16 overflow-hidden rounded-t-full rounded-b-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl"><img src="${imgUrl(product, '320')}" alt="" class="h-full w-full object-cover"></div>`
    );
    layer.appendChild(el);
    el.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1 },
        { transform: `translate(${(startX + targetX) / 2}px, ${Math.min(startY, targetY) - 140}px) scale(0.7)`, opacity: 1 },
        { transform: `translate(${targetX}px, ${targetY}px) scale(0.15)`, opacity: 0 }
      ],
      { duration: 800, easing: EASE, fill: 'forwards' }
    );
    setTimeout(() => {
      el.remove();
      if (!layer.children.length) layer.hidden = true;
      bounceBag();
    }, 750);
  }

  /* ------------------------------------------------------------------ */
  /* Navbar (components/Navbar.jsx)                                      */
  /* ------------------------------------------------------------------ */
  const header = $('[data-vr-header]');
  const menu = $('#site-menu');
  let menuOpen = false;

  function initNavbar() {
    if (!header) return;
    header.style.transition = `transform 0.6s ${EASE}`;
    requestAnimationFrame(() => (header.style.transform = 'translateY(0px)'));

    let prevY = window.scrollY;
    const onScroll = (y) => {
      const hidden = y > 300 && y > prevY && !menuOpen;
      header.style.transform = hidden ? 'translateY(-100px)' : 'translateY(0px)';
      prevY = y;
    };
    // framer's useScroll reads the window, which Lenis also drives
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

    $('[data-vr-menu-toggle]').addEventListener('click', () => setMenu(!menuOpen));
    $('[data-vr-bag-open]').addEventListener('click', () => openCart());

    // Product index with image reveal
    const list = $('[data-vr-menu-index]');
    PRODUCTS.forEach((p) => {
      const li = html(
        `<li class="border-b border-[var(--border-subtle)]" data-vr-index-item><button type="button" class="group flex w-full items-center justify-between gap-4 py-4 text-left"><span class="flex items-baseline gap-4"><span class="font-mono text-[11px] text-[var(--text-muted)]">${p.no}</span><span class="font-serif text-2xl transition-all duration-500 group-hover:translate-x-1 group-hover:italic sm:text-3xl">${esc(p.name)}</span></span><span class="flex items-center gap-4"><span class="label hidden sm:inline">${esc(p.category)}</span><span class="font-mono text-[12px] tabular-nums">${CUR}${p.price}</span></span></button></li>`
      );
      const btn = li.firstElementChild;
      btn.addEventListener('mouseenter', () => setPreview(p));
      btn.addEventListener('focus', () => setPreview(p));
      btn.addEventListener('click', () => {
        setMenu(false);
        openDossier(p);
      });
      list.appendChild(li);
    });
    if (PRODUCTS[0]) setPreview(PRODUCTS[0], true);
  }

  let previewId = null;
  function setPreview(p, instant) {
    const box = $('[data-vr-menu-preview]');
    if (!box || previewId === p.id) return;
    previewId = p.id;
    $$('[data-vr-preview]', box).forEach((old) => animate(old, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).finished.then(() => old.remove()));
    const el = html(`<div class="absolute inset-0" data-vr-preview>${productImage(p, { className: 'h-full w-full object-cover', sizes: '25vw' })}</div>`);
    box.appendChild(el);
    if (!instant) animate(el, [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 600 });
  }

  function setMenu(open) {
    if (open === menuOpen || !menu) return;
    menuOpen = open;
    const toggle = $('[data-vr-menu-toggle]');
    toggle.setAttribute('aria-expanded', String(open));
    $('[data-vr-menu-label]').textContent = open ? t('general.close') : t('general.menu');
    const a = $('[data-vr-burger="a"]');
    const b = $('[data-vr-burger="b"]');
    a.classList.toggle('top-0', !open);
    a.classList.toggle('top-1', open);
    a.classList.toggle('rotate-45', open);
    b.classList.toggle('top-2', !open);
    b.classList.toggle('top-1', open);
    b.classList.toggle('-rotate-45', open);
    if (open) header.style.transform = 'translateY(0px)';

    if (open) {
      lockScroll(true);
      menu.hidden = false;
      animate(menu, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 800, easing: QUINT });
      $$('[data-vr-menu-link]', menu).forEach((el, i) =>
        animate(el, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { delay: 300 + i * 50, duration: 800 })
      );
      $$('[data-vr-index-item]', menu).forEach((el, i) =>
        animate(el, [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }], { delay: 400 + i * 50, duration: 700 })
      );
    } else {
      lockScroll(false);
      animate(menu, [{ clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 800, easing: QUINT }).finished.then(() => {
        if (!menuOpen) menu.hidden = true;
      });
    }
  }

  // Anchor links: the navbar closes the menu first, then scrolls (Navbar.jsx `go`)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-vr-go]');
    if (!link) return;
    e.preventDefault();
    const id = link.dataset.vrGo;
    const offset = link.dataset.vrOffset ? Number(link.dataset.vrOffset) : undefined;
    const opts = offset !== undefined ? { offset } : {};
    if (link.closest('[data-vr-header], #site-menu')) {
      setMenu(false);
      setTimeout(() => scrollToId(id, opts), 450);
    } else {
      scrollToId(id, opts);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Hero (components/Hero.jsx)                                          */
  /* ------------------------------------------------------------------ */
  function initHero() {
    $$('[data-vr-enter]').forEach((el) => animate(el, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 900 }));
  }

  /* ------------------------------------------------------------------ */
  /* Collection (components/Collection.jsx)                              */
  /* ------------------------------------------------------------------ */
  let category = 'all';
  function renderCollection() {
    const grid = $('[data-vr-grid]');
    if (!grid) return;
    const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
    const items = PRODUCTS.filter((p) => cat.ids.includes(p.id));
    const editorial = cat.id === 'all';

    $('[data-vr-cat-title]').textContent = cat.title;
    $('[data-vr-cat-blurb]').textContent = cat.blurb;

    const filters = $('[data-vr-cat-filters]');
    filters.innerHTML = CATEGORIES.map(
      (c) =>
        `<button type="button" aria-pressed="${c.id === cat.id}" data-vr-cat="${c.id}" class="py-1 text-[15px] underline-offset-[6px] transition-colors hover:text-[var(--accent)] ${
          c.id === cat.id ? 'underline decoration-1' : 'text-[var(--text-secondary)]'
        }">${esc(c.label)}</button>`
    ).join('');

    grid.innerHTML = items
      .map((p, i) => {
        const large = editorial && i % 5 === 0;
        const right = large && i % 10 === 5;
        return `<li class="flex flex-col ${large ? 'col-span-2 lg:row-span-2' : ''} ${right ? 'lg:col-start-3' : ''}">
          <button type="button" data-vr-open="${p.id}" class="group flex flex-1 flex-col text-left" aria-label="${esc(t('product.view_named', { product: p.fullName }))}">
            <span class="relative block overflow-hidden bg-[var(--bg-secondary)] ${large ? 'aspect-[4/5] lg:aspect-auto lg:min-h-0 lg:flex-1' : 'aspect-[4/5]'}">
              ${productImage(p, {
                sizes: large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw',
                className: 'absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]'
              })}
            </span>
            <span class="mt-4 block font-serif leading-tight ${large ? 'text-[clamp(1.8rem,3vw,2.8rem)]' : 'text-[22px]'}">${esc(p.name)}</span>
            <span class="mt-1 block text-[14px] text-[var(--text-secondary)]">${esc(p.subtitle)}</span>
          </button>
          <div class="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span class="text-[15px] tabular-nums">${CUR}${p.price}</span>
            <button type="button" data-vr-add="${p.id}" class="text-[14px] underline decoration-1 underline-offset-[5px] hover:text-[var(--accent)]" aria-label="${esc(t('product.add_named', { product: p.name }))}">${esc(t('product.add'))}</button>
          </div>
        </li>`;
      })
      .join('');
  }

  function initCollection() {
    if (!$('[data-vr-grid]')) return;
    renderCollection();
    $('[data-vr-cat-filters]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-vr-cat]');
      if (!b) return;
      category = b.dataset.vrCat;
      renderCollection();
    });
    $('[data-vr-grid]').addEventListener('click', (e) => {
      const open = e.target.closest('[data-vr-open]');
      if (open) return openDossier(getProduct(open.dataset.vrOpen));
      const add = e.target.closest('[data-vr-add]');
      if (add) {
        const p = getProduct(add.dataset.vrAdd);
        addToCart(p, p.sizes[0], 1, add.getBoundingClientRect());
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ritual (components/Ritual.jsx)                                      */
  /* ------------------------------------------------------------------ */
  function initRitual() {
    const section = $('[data-vr-ritual]');
    if (!section || !RITUAL.dawn.length || !PRODUCTS.length) return;
    const stepsEl = $('[data-vr-ritual-steps]', section);
    const nodesEl = $('[data-vr-ritual-nodes]', section);
    const frame = $('[data-vr-ritual-frame]', section);
    const glow = $('[data-vr-ritual-glow]', section);
    const face = $('[data-vr-ritual-face]', section);
    const tabs = $$('[data-vr-ritual-mode]', section);
    const pill = $('[data-vr-ritual-pill]', section);

    let mode = 'dawn';
    let step = 0;
    let shownKey = null;
    let swapping = null;

    // Warm the cache for the ritual's photos once the page has loaded, so they don't compete with the hero
    const warm = () => {
      const ids = new Set([...RITUAL.dawn, ...RITUAL.dusk].map((x) => x.id));
      PRODUCTS.filter((p) => ids.has(p.id)).forEach((p) => imgUrl(p, '600') && (new Image().src = imgUrl(p, '600')));
    };
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    if (document.readyState === 'complete') idle(warm);
    else window.addEventListener('load', () => idle(warm), { once: true });

    const GLOWS = { dawn: [224, 147, 95, 0.14], dusk: [165, 82, 42, 0.2] };
    let glowNow = GLOWS.dawn.slice();
    let glowAnim = 0;
    function tweenGlow(to) {
      cancelAnimationFrame(glowAnim);
      const from = glowNow.slice();
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1400);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        glowNow = from.map((v, i) => v + (to[i] - v) * e);
        const [r, g, b, a] = glowNow;
        glow.style.background = `radial-gradient(60% 60% at 70% 50%, rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)}), transparent 70%)`;
        if (k < 1) glowAnim = requestAnimationFrame(tick);
      };
      glowAnim = requestAnimationFrame(tick);
    }
    glow.style.transition = '';

    function renderSteps() {
      stepsEl.innerHTML = RITUAL[mode]
        .map((s, i) => {
          const p = getProduct(s.id);
          const on = i === step;
          return `<li class="border-b border-[var(--border-subtle)]"><button type="button" data-step="${i}" class="flex w-full items-center gap-5 py-4 text-left"><span class="font-mono text-[11px] text-[var(--text-muted)]">${s.time}</span><span class="font-serif text-3xl transition-all duration-500 ${
            on ? 'translate-x-1 italic text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
          }" data-verb>${esc(s.verb)}</span><span class="ml-auto text-right text-[13px] text-[var(--text-secondary)]">${esc(p.name)}<span class="block font-mono text-[11px] text-[var(--text-muted)]">${CUR}${p.price}</span></span></button></li>`;
        })
        .join('');
      $$('[data-step]', stepsEl).forEach((b) => {
        const i = Number(b.dataset.step);
        b.addEventListener('click', () => setStep(i));
        b.addEventListener('mouseenter', () => setStep(i));
      });
    }

    function renderNodes() {
      nodesEl.innerHTML = '';
      RITUAL[mode].forEach((s, i) => {
        const angle = (-90 + 45 + i * 90) * (Math.PI / 180);
        const r = 41;
        const p = getProduct(s.id);
        const on = i === step;
        const btn = html(
          `<button type="button" aria-label="${esc(s.verb)}: ${esc(p.fullName)}" class="absolute -translate-x-1/2 -translate-y-1/2" style="left: ${50 + Math.cos(angle) * r}%; top: ${50 + Math.sin(angle) * r}%; opacity: 0; transform: scale(0.6);"><span class="block h-14 w-14 overflow-hidden rounded-full border-2 transition-colors sm:h-16 sm:w-16 ${
            on ? 'border-[var(--text-primary)]' : 'border-[var(--border-subtle)]'
          }"><img src="${imgUrl(p, '320')}" alt="${esc(p.name)}" class="h-full w-full object-cover" loading="lazy"></span><span class="label mt-2 block text-center">${String(i + 1).padStart(2, '0')}</span></button>`
        );
        // framer-motion reuses this transition (with its delay) for every later scale change too
        btn.style.transition = `opacity 0.6s ${EASE} ${0.5 + i * 0.08}s, transform 0.6s ${EASE} ${0.5 + i * 0.08}s`;
        btn.addEventListener('click', () => setStep(i));
        nodesEl.appendChild(btn);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            btn.style.opacity = '1';
            btn.style.transform = `scale(${on ? 1.15 : 1})`;
          })
        );
      });
    }

    function syncActive() {
      $$('[data-verb]', stepsEl).forEach((el, i) => {
        const on = i === step;
        el.classList.toggle('translate-x-1', on);
        el.classList.toggle('italic', on);
        el.classList.toggle('text-[var(--text-primary)]', on);
        el.classList.toggle('text-[var(--text-secondary)]', !on);
      });
      Array.from(nodesEl.children).forEach((btn, i) => {
        const on = i === step;
        btn.style.transform = `scale(${on ? 1.15 : 1})`;
        const ring = btn.firstElementChild;
        ring.classList.toggle('border-[var(--text-primary)]', on);
        ring.classList.toggle('border-[var(--border-subtle)]', !on);
      });
    }

    // AnimatePresence mode="wait": exit up, then the next photo rises in
    function updateCenter(initial) {
      const s = RITUAL[mode][step];
      const key = `${mode}-${s.id}`;
      if (key === shownKey) return;
      shownKey = key;
      if (initial) {
        const p = getProduct(s.id);
        frame.innerHTML = `<img src="${imgUrl(p, '600')}" alt="${esc(p.fullName)}" class="h-full w-full object-cover">`;
        return;
      }
      if (swapping) return;
      swapping = animate(frame, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(-16px) scale(0.96)' }], { duration: 550 });
      swapping.finished.then(() => {
        const cur = RITUAL[mode][step];
        const p = getProduct(cur.id);
        shownKey = `${mode}-${cur.id}`;
        frame.innerHTML = `<img src="${imgUrl(p, '600')}" alt="${esc(p.fullName)}" class="h-full w-full object-cover">`;
        animate(frame, [{ opacity: 0, transform: 'translateY(16px) scale(0.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 550 });
        swapping = null;
        updateCenter();
      });
    }

    function setStep(i) {
      if (i === step) return;
      step = i;
      syncActive();
      updateCenter();
    }

    function updateTotal() {
      const total = RITUAL[mode].reduce((sum, s) => sum + getProduct(s.id).price, 0);
      const label = $('[data-vr-ritual-add-label]', section);
      const tab = tabs.find((t) => t.dataset.vrRitualMode === mode);
      const name = tab ? tab.textContent.trim().toLowerCase() : mode;
      const total$ = `${CUR}${Math.round(total * 100) / 100}`;
      label.textContent = (label.dataset.template || 'Add the [time] ritual — [price]').replace('[time]', name).replace('[price]', total$);
    }

    // layoutId="ritual-pill": the pill glides to the selected tab
    function movePill(target) {
      const before = pill.getBoundingClientRect();
      target.insertBefore(pill, target.firstChild);
      const after = pill.getBoundingClientRect();
      animate(pill, [{ transform: `translateX(${before.left - after.left}px)` }, { transform: 'translateX(0)' }], { duration: 550 });
    }

    function switchMode(m) {
      if (m === mode) return;
      mode = m;
      step = 0;
      const night = m === 'dusk';
      tabs.forEach((t) => {
        const on = t.dataset.vrRitualMode === m;
        t.setAttribute('aria-selected', String(on));
        t.classList.toggle('text-[var(--accent-ink)]', on);
        t.classList.toggle('text-[var(--text-secondary)]', !on);
        if (on) movePill(t);
      });
      face.style.transform = `rotate(${night ? 180 : 0}deg)`;
      tweenGlow(GLOWS[m]);
      const sub = $('[data-vr-ritual-subtitle]', section);
      sub.textContent = night ? sub.dataset.dusk : sub.dataset.dawn;
      updateTotal();
      renderSteps();
      renderNodes();
      updateCenter();
    }

    tabs.forEach((t) => t.addEventListener('click', () => switchMode(t.dataset.vrRitualMode)));
    $('[data-vr-ritual-add]', section).addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      RITUAL[mode].forEach((s, i) => setTimeout(() => addToCart(getProduct(s.id), null, 1, i === 0 ? rect : null), i * 120));
    });

    renderSteps();
    renderNodes();
    updateTotal();
    updateCenter(true);
  }

  /* ------------------------------------------------------------------ */
  /* Footer (components/Footer.jsx)                                      */
  /* ------------------------------------------------------------------ */
  function initFooter() {
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(new Date());
    $$('[data-vr-grasse-time]').forEach((el) => (el.textContent = time));
    // Country and language: choosing an option submits Shopify's localization form
    $$('form[data-vr-localization] select').forEach((sel) => sel.addEventListener('change', () => sel.form.submit()));
  }

  /* ------------------------------------------------------------------ */
  /* Bag (components/CartDrawer.jsx)                                     */
  /* ------------------------------------------------------------------ */
  const cartRoot = $('[data-vr-cart-root]');
  let cart = null; // { el, step, code, pct, shown:Set }

  function openCart() {
    if (cart || !cartRoot) return;
    lockScroll(true);
    const el = html(
      `<div class="fixed inset-0 z-[170]" role="dialog" aria-modal="true" aria-label="${esc(t('bag.label'))}"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-backdrop></div><aside class="absolute bottom-2 right-2 top-2 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-none border border-[var(--border-strong)] bg-[var(--bg-primary)]"></aside></div>`
    );
    cartRoot.appendChild(el);
    cart = { el, step: 'cart', code: '', pct: 0, shown: new Set(store.cart.map((i) => i.cartItemId)), checkoutError: '' };
    animate($('[data-backdrop]', el), [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    animate($('aside', el), [{ transform: 'translateX(110%)' }, { transform: 'translateX(0)' }], { duration: 700, easing: QUINT });
    $('[data-backdrop]', el).addEventListener('click', closeCart);
    renderCart();
  }

  function closeCart() {
    if (!cart) return;
    const { el } = cart;
    cart = null;
    lockScroll(false);
    animate($('[data-backdrop]', el), [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out' });
    animate($('aside', el), [{ transform: 'translateX(0)' }, { transform: 'translateX(110%)' }], { duration: 700, easing: QUINT }).finished.then(() => el.remove());
  }

  function renderCart() {
    if (!cart) return;
    const aside = $('aside', cart.el);
    const items = store.cart;
    const pct = Math.min(100, (store.subtotal / store.shippingThreshold) * 100);
    const need = Math.max(0, store.shippingThreshold - store.subtotal);
    let body = '';

    if (cart.step === 'processing') {
      body = `<div class="flex flex-1 flex-col items-center justify-center gap-4"><span class="h-10 w-10 animate-spin rounded-full border border-[var(--text-primary)] border-t-transparent motion-reduce:animate-none"></span><p class="label">${esc(t('bag.processing'))}</p></div>`;
    } else {
      const meter = items.length
        ? `<div class="border-b border-[var(--border-subtle)] px-6 py-4"><p class="text-[13px] text-[var(--text-secondary)]">${esc(need > 0 ? t('bag.meter_need', { amount: `${CUR}${Math.round(need * 100) / 100}` }) : t('bag.meter_done'))}</p><div class="mt-2 h-px bg-[var(--border-strong)]"><div class="h-px bg-[var(--accent)]" data-meter style="width: ${cart.pct}%"></div></div></div>`
        : '';
      const list = items.length
        ? `<ul class="space-y-5">${items
            .map(
              (item) =>
                `<li class="flex gap-4" data-id="${esc(item.cartItemId)}"><img src="${item.image}" alt="${esc(item.name)}" class="h-24 w-20 shrink-0 rounded-none object-cover"><div class="flex flex-1 flex-col justify-between"><div class="flex justify-between gap-3"><div><p class="font-serif text-xl leading-tight">${esc(item.name)}</p><p class="label mt-1">${esc(item.size)}</p></div><p class="font-mono text-[13px] tabular-nums">${CUR}${item.price * item.quantity}</p></div><div class="flex items-center justify-between"><div class="flex items-center rounded-full border border-[var(--border-subtle)]"><button type="button" data-qty="-1" class="grid h-8 w-8 place-items-center" aria-label="${esc(t('general.decrease'))}">${icon('minus', 'h-3 w-3')}</button><span class="w-5 text-center font-mono text-[12px]">${item.quantity}</span><button type="button" data-qty="1" class="grid h-8 w-8 place-items-center" aria-label="${esc(t('general.increase'))}">${icon('plus', 'h-3 w-3')}</button></div><button type="button" data-remove class="label underline-offset-4 hover:text-[var(--text-primary)] hover:underline">${esc(t('bag.remove'))}</button></div></div></li>`
            )
            .join('')}</ul>`
        : `<div class="flex h-full flex-col items-center justify-center text-center"><p class="font-serif text-3xl">${esc(t('bag.empty'))}</p><p class="mt-2 text-[14px] text-[var(--text-secondary)]">${esc(t('bag.empty_text'))}</p>${pillButton(`${esc(t('bag.explore'))} ${icon('arrow-right', 'h-3.5 w-3.5')}`, { className: 'mt-6', attrs: 'data-close' })}</div>`;
      const suggestions =
        items.length && store.suggestions.length
          ? `<div class="mt-10"><p class="label">${esc(t('bag.suggestions'))}</p><div class="mt-3 space-y-2">${store.suggestions
              .map(
                (p) =>
                  `<div class="flex items-center gap-3 rounded-none border border-[var(--border-subtle)] p-2"><img src="${imgUrl(p, '320')}" alt="${esc(p.name)}" class="h-12 w-10 rounded-none object-cover"><div class="flex-1"><p class="font-serif text-lg leading-none">${esc(p.name)}</p><p class="font-mono text-[11px] text-[var(--text-muted)]">${CUR}${p.price}</p></div><button type="button" data-suggest="${p.id}" class="mr-1 rounded-none border border-[var(--border-strong)] px-3 py-1.5 text-[11px] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]">${esc(t('bag.add_suggestion'))}</button></div>`
              )
              .join('')}</div></div>`
          : '';
      const footer = items.length
        ? `<footer class="space-y-4 border-t border-[var(--border-subtle)] p-6"><form class="flex gap-2" data-promo><label for="promo" class="sr-only">${esc(t('bag.code'))}</label><input id="promo" value="${esc(cart.code)}" placeholder="${esc(t('bag.code'))}" class="flex-1 rounded-none border border-[var(--border-subtle)] bg-transparent px-4 py-2.5 text-[13px] uppercase placeholder:normal-case placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"><button type="submit" class="rounded-none border border-[var(--border-strong)] px-4 text-[12px]">${esc(t('bag.apply'))}</button></form>${
            store.promoApplied || store.promoError
              ? `<p class="text-[12px] ${store.promoApplied ? 'text-[var(--accent)]' : 'text-red-400'}">${store.promoApplied ? esc(t('bag.code_applied')) : esc(store.promoError)}</p>`
              : ''
          }${cart.checkoutError ? `<p class="text-[12px] text-red-400">${esc(cart.checkoutError)}</p>` : ''}<dl class="space-y-1.5 text-[14px] text-[var(--text-secondary)]"><div class="flex justify-between"><dt>${esc(t('bag.subtotal'))}</dt><dd class="tabular-nums">${CUR}${store.subtotal.toFixed(2)}</dd></div>${
            store.discountAmount > 0 ? `<div class="flex justify-between text-[var(--accent)]"><dt>${esc(t('bag.discount'))}</dt><dd class="tabular-nums">−${CUR}${store.discountAmount.toFixed(2)}</dd></div>` : ''
          }<div class="flex justify-between"><dt>${esc(t('bag.delivery'))}</dt><dd>${esc(store.subtotal >= store.shippingThreshold ? t('bag.free') : t('bag.delivery_later'))}</dd></div><div class="flex items-baseline justify-between pt-2 text-[var(--text-primary)]"><dt>${esc(t('bag.total'))}</dt><dd class="font-serif text-3xl" data-total></dd></div></dl>${pillButton(`${esc(t('bag.checkout'))} ${icon('arrow-right', 'h-3.5 w-3.5')}`, { className: 'w-full', attrs: 'data-checkout' })}</footer>`
        : '';
      body = `${meter}<div class="flex-1 overflow-y-auto p-6" data-lenis-prevent>${list}${suggestions}</div>${footer}`;
    }

    const prevTotal = $('[data-total] [data-vr-price]', aside);
    aside.innerHTML = `<header class="flex items-center justify-between border-b border-[var(--border-subtle)] p-6"><h2 class="font-serif text-3xl">${esc(t('bag.title'))} <sup class="font-mono text-[11px] text-[var(--text-muted)]">${store.count}</sup></h2><button type="button" data-close class="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-strong)]" aria-label="${esc(t('bag.close'))}">${icon('x', 'h-4 w-4')}</button></header>${body}`;

    const totalEl = $('[data-total]', aside);
    if (totalEl) {
      const value = store.total.toFixed(2);
      if (prevTotal) {
        totalEl.appendChild(prevTotal);
        rollPrice(prevTotal, value);
      } else totalEl.innerHTML = animatedPrice(value);
    }

    const meter = $('[data-meter]', aside);
    if (meter) {
      animate(meter, [{ width: `${cart.pct}%` }, { width: `${pct}%` }], { duration: 600 });
      cart.pct = pct;
    }

    $$('li[data-id]', aside).forEach((li) => {
      if (!cart.shown.has(li.dataset.id)) {
        cart.shown.add(li.dataset.id);
        animate(li, [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 300, easing: 'ease-out' });
      }
    });

    $$('[data-close]', aside).forEach((b) => b.addEventListener('click', closeCart));
    $$('li[data-id]', aside).forEach((li) => {
      const id = li.dataset.id;
      $$('[data-qty]', li).forEach((b) => b.addEventListener('click', () => updateQuantity(id, Number(b.dataset.qty))));
      $('[data-remove]', li).addEventListener('click', () => {
        animate(li, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-20px)' }], { duration: 250, easing: 'ease-in' }).finished.then(() => {
          cart && cart.shown.delete(id);
          removeFromCart(id);
        });
      });
    });
    $$('[data-suggest]', aside).forEach((b) => b.addEventListener('click', () => addToCart(getProduct(b.dataset.suggest))));
    const promo = $('[data-promo]', aside);
    if (promo) {
      const input = $('input', promo);
      input.addEventListener('input', () => (cart.code = input.value));
      promo.addEventListener('submit', (e) => {
        e.preventDefault();
        applyPromo(cart.code);
      });
    }
    const checkoutBtn = $('[data-checkout]', aside);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
  }

  function checkout() {
    if (!cart) return;
    cart.step = 'processing';
    renderCart();
    window.location.href = `${ROUTES.root.replace(/\/$/, '')}/checkout`;
  }

  /* ------------------------------------------------------------------ */
  /* Product dossier (components/ProductDetailModal.jsx)                 */
  /* ------------------------------------------------------------------ */
  const dossierRoot = $('[data-vr-dossier-root]');
  let dossier = null;

  function supports3D() {
    if ((navigator.hardwareConcurrency || 8) < 4) return false;
    try {
      const c = document.createElement('canvas');
      return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }
  const can3D = supports3D();

  function openDossier(product) {
    if (!dossierRoot || !product) return;
    if (dossier) closeDossier(true);
    lockScroll(true);
    const state = { product, sizeIdx: 0, qty: 1, view: 'product' };
    const cat = categoryOf(product.id);
    const pairs = PRODUCTS.filter((p) => p.id !== product.id && p.moment === product.moment).slice(0, 2);
    const others = pairs.length ? pairs : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);
    const views = [['product', t('product.view_image')], ...(product.portrait && product.portrait !== imgUrl(product, '1200') ? [['portrait', t('product.view_skin')]] : []), ...(can3D && !reduced ? [['3d', t('product.view_3d')]] : [])];
    const size = product.sizes[0];
    const pair = product.synergy && getProduct(product.synergy.pairId);

    const el = html(`<div class="fixed inset-0 z-[150]" role="dialog" aria-modal="true" aria-labelledby="dossier-title">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-backdrop></div>
      <div class="absolute inset-x-0 bottom-0 top-3 overflow-hidden rounded-none border-t border-[var(--border-strong)] bg-[var(--bg-primary)] sm:inset-x-3 sm:top-6" data-sheet>
        <button type="button" data-close class="absolute right-4 top-4 z-20 flex h-10 items-center gap-2 rounded-none bg-[var(--text-primary)] px-4 text-[12px] text-[var(--accent-ink)]">${icon('x', 'h-3.5 w-3.5')} ${esc(t('general.close'))}</button>
        <div class="grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden" data-lenis-prevent>
          <div class="relative min-h-[60vh] bg-[var(--bg-secondary)] lg:h-full">
            <div class="absolute inset-0 overflow-hidden" data-stage></div>
            <div class="absolute bottom-5 left-5 flex gap-2" data-views>${views
              .map(([id, l]) => `<button type="button" data-view="${id}" class="rounded-none px-4 py-2 text-[12px] backdrop-blur-md transition-colors ${id === 'product' ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'}">${esc(l)}</button>`)
              .join('')}</div>
          </div>
          <div class="flex flex-col px-6 pb-10 pt-8 sm:px-12 sm:pt-16 lg:overflow-y-auto" data-lenis-prevent>
            <div class="flex items-center gap-3">
              ${product.no ? `<span class="font-mono text-[12px] text-[var(--accent)]">N°${esc(product.no)}</span><span class="h-px w-8 bg-[var(--border-strong)]"></span>` : ''}
              <span class="label">${esc([cat ? cat.label : '', product.category].filter(Boolean).join(' · '))}</span>
            </div>
            <h2 id="dossier-title" class="mt-4 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.9]">${esc(product.name)}</h2>
            ${product.subtitle ? `<p class="mt-2 font-serif text-xl italic text-[var(--text-secondary)]">${esc(product.subtitle)}</p>` : ''}
            ${
              product.rating
                ? `<div class="mt-4 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"><span class="flex">${icon('star', 'h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]').repeat(5)}</span>${esc(t('product.reviews', { rating: product.rating, count: product.reviewsCount || 0 }))}</div>`
                : ''
            }
            ${
              product.ph || product.finish
                ? `<div class="mt-6 grid grid-cols-2 gap-2 border-y border-[var(--border-subtle)] py-4 text-center">
              <div class="rounded-none bg-[var(--bg-secondary)]/70 p-2.5"><span class="label block text-[12px]">${esc(t('product.ph'))}</span><span class="font-mono text-sm text-[var(--accent)] block mt-0.5">${esc(product.ph || '')}</span></div>
              <div class="rounded-none bg-[var(--bg-secondary)]/70 p-2.5"><span class="label block text-[12px]">${esc(t('product.finish'))}</span><span class="font-mono text-sm text-[var(--text-primary)] block mt-0.5">${esc(product.finish || '')}</span></div>
            </div>`
                : ''
            }
            <p class="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--text-secondary)]">${esc(product.description)}</p>
            <div class="mt-8 rounded-none border border-[var(--border-subtle)] p-5">
              <div class="flex items-center justify-between">
                <div class="flex gap-2" role="radiogroup" aria-label="${esc(t('product.size'))}">${product.sizes
                  .map((s, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-size="${i}" class="rounded-none border px-4 py-2 font-mono text-[11px] transition-colors ${i === 0 ? 'border-[var(--text-primary)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'}">${esc(s.size)}</button>`)
                  .join('')}</div>
                <span class="font-serif text-4xl" data-buy-price>${animatedPrice(size.price)}</span>
              </div>
              <div class="mt-5 flex gap-2">
                <div class="flex items-center rounded-full border border-[var(--border-subtle)]">
                  <button type="button" data-q="-1" class="grid h-12 w-10 place-items-center" aria-label="${esc(t('general.decrease'))}">${icon('minus', 'h-3.5 w-3.5')}</button>
                  <span class="w-6 text-center font-mono text-[13px]" aria-live="polite" data-qty>1</span>
                  <button type="button" data-q="1" class="grid h-12 w-10 place-items-center" aria-label="${esc(t('general.increase'))}">${icon('plus', 'h-3.5 w-3.5')}</button>
                </div>
                ${pillButton(esc(t('product.add')), { className: 'flex-1', attrs: 'data-buy' })}
              </div>
              ${t('product.note') ? `<p class="label mt-4">${esc(t('product.note'))}</p>` : ''}
            </div>
            <dl class="mt-10 grid grid-cols-1 border-t border-[var(--border-subtle)] sm:grid-cols-2">
              ${product.texture ? `<div class="border-b border-[var(--border-subtle)] py-5 sm:pr-6"><dt class="label">${esc(t('product.texture'))}</dt><dd class="mt-2 flex items-center gap-3 text-[15px]">${textureBlob(product.glow, 'h-7 w-7')} ${esc(product.texture)}</dd></div>` : ''}
              ${product.notes.length ? `<div class="border-b border-[var(--border-subtle)] py-5"><dt class="label">${esc(t('product.scent'))}</dt><dd class="mt-2 text-[15px]">${esc(product.notes.join(' · '))}</dd></div>` : ''}
              ${product.keyIngredients.length ? `<div class="border-b border-[var(--border-subtle)] py-5 sm:col-span-2"><dt class="label">${esc(t('product.key_ingredients'))}</dt><dd class="mt-3 flex flex-wrap gap-2">${product.keyIngredients.map((k) => `<span class="rounded-none border border-[var(--border-subtle)] px-3 py-1 text-[13px]">${esc(k)}</span>`).join('')}</dd></div>` : ''}
              ${product.benefits.length ? `<div class="border-b border-[var(--border-subtle)] py-5 sm:col-span-2"><dt class="label">${esc(t('product.benefits'))}</dt><dd class="mt-3 space-y-1.5">${product.benefits.map((b, i) => `<p class="flex gap-3 text-[15px]"><span class="font-mono text-[11px] text-[var(--text-muted)]">0${i + 1}</span>${esc(b)}</p>`).join('')}</dd></div>` : ''}
              ${product.howToUse ? `<div class="py-5 sm:col-span-2"><dt class="label">${esc(t('product.how_to_use'))}</dt><dd class="mt-2 text-[15px] text-[var(--text-secondary)]">${esc(product.howToUse)}</dd></div>` : ''}
            </dl>
            ${
              product.synergy
                ? `<div class="mt-8 rounded-none border border-[var(--border-strong)] bg-[var(--bg-secondary)]/50 p-4"><div class="flex items-center justify-between"><span class="label flex items-center gap-1.5 text-[var(--accent)]">${icon('sparkles', 'h-3 w-3')} ${esc(t('product.partner'))}</span></div><p class="mt-2 text-[13px] text-[var(--text-secondary)] leading-relaxed">${esc(product.synergy.benefit)}</p>${
                    pair
                      ? `<button type="button" data-duo class="mt-3 flex items-center justify-between w-full rounded-none border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] transition-all hover:bg-[var(--text-primary)] hover:text-[var(--accent-ink)]"><span>${esc(t('product.duo', { first: product.name, second: pair.name }))}</span><span data-duo-price>${CUR}${Math.round((size.price + pair.price) * 100) / 100}</span></button>`
                      : ''
                  }</div>`
                : ''
            }
            <div class="mt-6">
              <p class="label">${esc(t('product.pairs'))}</p>
              <div class="mt-4 grid grid-cols-2 gap-3">${others
                .map(
                  (p) =>
                    `<button type="button" data-switch="${p.id}" class="group flex items-center gap-3 rounded-none border border-[var(--border-subtle)] p-2 text-left transition-colors hover:border-[var(--border-strong)]"><img src="${imgUrl(p, '320')}" alt="${esc(p.name)}" class="h-16 w-14 rounded-none object-cover" loading="lazy"><span><span class="block font-serif text-lg leading-tight group-hover:italic">${esc(p.name)}</span><span class="font-mono text-[11px] text-[var(--text-muted)]">${CUR}${p.price}</span></span></button>`
                )
                .join('')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`);

    dossierRoot.appendChild(el);
    dossier = { el, state, scene: null };
    animate($('[data-backdrop]', el), [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    animate($('[data-sheet]', el), [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 800, easing: QUINT });
    startBlobs(el);
    $('[data-close]', el).focus({ preventScroll: true });

    const stage = $('[data-stage]', el);
    setView(stage, state, true);

    $('[data-backdrop]', el).addEventListener('click', () => closeDossier());
    $('[data-close]', el).addEventListener('click', () => closeDossier());
    $$('[data-view]', el).forEach((b) =>
      b.addEventListener('click', () => {
        if (state.view === b.dataset.view) return;
        state.view = b.dataset.view;
        $$('[data-view]', el).forEach((o) => {
          const on = o === b;
          o.classList.toggle('bg-white', on);
          o.classList.toggle('text-black', on);
          o.classList.toggle('bg-black/40', !on);
          o.classList.toggle('text-white', !on);
          o.classList.toggle('hover:bg-black/60', !on);
        });
        setView(stage, state);
      })
    );

    const priceWrap = () => $('[data-buy-price] [data-vr-price]', el);
    const refreshPrice = () => {
      const s = product.sizes[state.sizeIdx];
      rollPrice(priceWrap(), s.price * state.qty);
      const duo = $('[data-duo-price]', el);
      if (duo && pair) duo.textContent = `${CUR}${Math.round((s.price + pair.price) * 100) / 100}`;
    };
    $$('[data-size]', el).forEach((b) =>
      b.addEventListener('click', () => {
        state.sizeIdx = Number(b.dataset.size);
        $$('[data-size]', el).forEach((o, i) => {
          const on = i === state.sizeIdx;
          o.setAttribute('aria-checked', String(on));
          o.classList.toggle('border-[var(--text-primary)]', on);
          ['border-[var(--border-subtle)]', 'text-[var(--text-muted)]', 'hover:border-[var(--border-strong)]'].forEach((c) => o.classList.toggle(c, !on));
        });
        refreshPrice();
      })
    );
    $$('[data-q]', el).forEach((b) =>
      b.addEventListener('click', () => {
        state.qty = Math.max(1, state.qty + Number(b.dataset.q));
        $('[data-qty]', el).textContent = state.qty;
        refreshPrice();
      })
    );
    $('[data-buy]', el).addEventListener('click', (e) => {
      addToCart(product, product.sizes[state.sizeIdx], state.qty, e.currentTarget.getBoundingClientRect());
      closeDossier();
    });
    const duo = $('[data-duo]', el);
    if (duo)
      duo.addEventListener('click', (e) => {
        addToCart(product, product.sizes[state.sizeIdx], 1, e.currentTarget.getBoundingClientRect());
        setTimeout(() => addToCart(pair, null, 1, null), 150);
        closeDossier();
      });
    $$('[data-switch]', el).forEach((b) => b.addEventListener('click', () => openDossier(getProduct(b.dataset.switch))));
  }

  function closeDossier(replacing) {
    if (!dossier) return;
    const { el, scene } = dossier;
    dossier = null;
    if (scene) scene.dispose();
    lockScroll(false);
    if (!replacing) animate($('[data-backdrop]', el), [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out' });
    animate($('[data-sheet]', el), [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 800, easing: QUINT }).finished.then(() => el.remove());
  }

  // AnimatePresence mode="wait" keyed by view: old view fades out, the next one fades and settles in
  function setView(stage, state, initial) {
    const p = state.product;
    const old = stage.firstElementChild;
    const build = () => {
      if (dossier && dossier.scene) {
        dossier.scene.dispose();
        dossier.scene = null;
      }
      stage.innerHTML = '';
      const wrap = html('<div class="absolute inset-0"></div>');
      if (state.view === 'product') {
        wrap.innerHTML = productImage(p, { eager: true, sizes: '50vw', className: 'h-full w-full object-cover' });
      } else if (state.view === '3d') {
        wrap.innerHTML = `<div class="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"><p class="grid h-full place-items-center text-[15px] text-[var(--text-secondary)]" data-loading>${esc(t('product.loading_3d'))}</p><p class="pointer-events-none absolute left-5 top-5 text-[14px] text-[var(--text-secondary)]">${esc(t('product.drag_3d'))}</p></div>`;
        mountGlass(wrap.firstElementChild, p);
      } else {
        wrap.innerHTML = `<img src="${p.portrait}" alt="${esc(p.fullName)} on skin" class="h-full w-full object-cover">`;
      }
      stage.appendChild(wrap);
      const lens = html('<div class="pointer-events-none absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/40 shadow-2xl" hidden></div>');
      stage.appendChild(lens);
      stage.onpointermove =
        state.view === 'product'
          ? (e) => {
              const r = stage.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              lens.hidden = false;
              lens.style.left = `${x}%`;
              lens.style.top = `${y}%`;
              lens.style.backgroundImage = `url(${imgUrl(p, '1200')})`;
              lens.style.backgroundSize = '300%';
              lens.style.backgroundPosition = `${x}% ${y}%`;
            }
          : null;
      stage.onpointerleave = () => (lens.hidden = true);
      animate(wrap, [{ opacity: 0, transform: 'scale(1.05)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 700 });
    };
    if (initial || !old) return build();
    animate(old, [{ opacity: 1 }, { opacity: 0 }], { duration: 700 }).finished.then(build);
  }

  /* ------------------------------------------------------------------ */
  /* Glass bottle (components/three/GlassScene.jsx) on three.js r128     */
  /* ------------------------------------------------------------------ */
  let threeLoading = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!threeLoading)
      threeLoading = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = window.VR_THREE_URL;
        s.onload = () => resolve(window.THREE);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    return threeLoading;
  }

  function mountGlass(container, product) {
    const handle = { disposed: false, dispose() { this.disposed = true; if (this.stop) this.stop(); } };
    if (dossier) dossier.scene = handle;
    loadThree()
      .then((THREE) => {
        if (handle.disposed) return;
        const loading = $('[data-loading]', container);
        if (loading) loading.remove();
        handle.stop = glassScene(THREE, container, product);
      })
      .catch(() => {
        container.innerHTML = productImage(product, { eager: true, sizes: '50vw', className: 'h-full w-full object-cover' });
      });
    return handle;
  }

  const SHAPES = {
    dropper: { body: [[0, 0], [0.6, 0], [0.66, 0.04], [0.68, 0.14], [0.68, 1.22], [0.63, 1.36], [0.46, 1.47], [0.27, 1.53], [0.24, 1.6], [0.24, 1.7], [0, 1.7]], fill: 0.95, height: 2.35, frost: 0.04 },
    jar: { body: [[0, 0], [0.98, 0], [1.04, 0.06], [1.06, 0.16], [1.06, 0.82], [1.0, 0.9], [0.94, 0.94], [0, 0.94]], fill: 0.78, height: 1.3, frost: 0.32 },
    mist: { body: [[0, 0], [0.5, 0], [0.55, 0.05], [0.56, 0.14], [0.56, 1.86], [0.5, 1.95], [0.24, 2.0], [0, 2.0]], fill: 0.85, height: 2.6, frost: 0.28 },
    pump: { body: [[0, 0], [0.6, 0], [0.65, 0.05], [0.66, 0.14], [0.66, 1.36], [0.6, 1.47], [0.3, 1.54], [0, 1.54]], fill: 0.9, height: 2.25, frost: 0.3 },
    tube: { body: [[0, 0], [0.42, 0], [0.52, 0.06], [0.54, 0.2], [0.54, 1.75], [0.5, 1.95], [0.3, 2.02], [0, 2.02]], fill: 0, height: 2.3, frost: 1 }
  };

  function glassScene(THREE, container, product) {
    // three r128 reads hex as linear; the web app's three r187 converts from sRGB, so do it here
    const col = (hex) => new THREE.Color(hex).convertSRGBToLinear();
    const lathe = (pts, seg) => {
      const g = new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg);
      g.computeVertexNormals();
      return g;
    };
    const mesh = (geo, mat, y) => {
      const m = new THREE.Mesh(geo, mat);
      if (y) m.position.y = y;
      return m;
    };
    // CapsuleGeometry arrived after r128, so revolve a capsule profile
    const capsule = (radius, length) => {
      const pts = [];
      for (let i = 0; i <= 12; i++) {
        const a = -Math.PI / 2 + (i / 12) * (Math.PI / 2);
        pts.push([Math.cos(a) * radius, -length / 2 + Math.sin(a) * radius]);
      }
      for (let i = 0; i <= 12; i++) {
        const a = (i / 12) * (Math.PI / 2);
        pts.push([Math.cos(a) * radius, length / 2 + Math.sin(a) * radius]);
      }
      pts[0][0] = 0;
      pts[pts.length - 1][0] = 0;
      return lathe(pts, 32);
    };

    function label(shapeKey) {
      if (shapeKey === 'tube') return null;
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#C9A05A';
      ctx.lineWidth = 6;
      ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);
      ctx.fillStyle = '#111110';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 30px "Geist Mono", monospace';
      ctx.letterSpacing = '6px';
      ctx.fillText('VERENNE', canvas.width / 2, 130);
      ctx.font = '20px "Geist Mono", monospace';
      ctx.fillStyle = '#777';
      ctx.fillText('PARIS · GRASSE', canvas.width / 2, 185);
      ctx.strokeStyle = '#C9A05A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, 230);
      ctx.lineTo(canvas.width / 2 + 120, 230);
      ctx.stroke();
      ctx.font = 'italic 58px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = '#111110';
      ctx.fillText(product.name || 'Éclat Sauvage', canvas.width / 2, 330);
      ctx.font = 'bold 22px "Geist Mono", monospace';
      ctx.fillStyle = '#444';
      ctx.fillText((product.subtitle || 'Active Botanical Serum').toUpperCase(), canvas.width / 2, 420);
      ctx.font = 'italic 26px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = '#666';
      ctx.fillText(product.latin || 'Helichrysum Stoechas', canvas.width / 2, 480);
      ctx.font = '22px "Geist Mono", monospace';
      ctx.fillStyle = '#888';
      ctx.fillText('30 ML · 1.0 FL. OZ · BIO-ACTIF', canvas.width / 2, 600);
      ctx.font = '18px "Geist Mono", monospace';
      ctx.fillStyle = '#999';
      ctx.fillText('MADE IN FRANCE', canvas.width / 2, 650);
      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = 8;
      const radius = shapeKey === 'jar' ? 1.065 : shapeKey === 'mist' ? 0.565 : 0.685;
      const height = shapeKey === 'jar' ? 0.62 : shapeKey === 'mist' ? 1.15 : 0.88;
      const posY = shapeKey === 'jar' ? 0.52 : shapeKey === 'mist' ? 0.95 : 0.72;
      return mesh(
        new THREE.CylinderGeometry(radius, radius, height, 48, 1, true, -Math.PI * 0.44, Math.PI * 0.88),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0.08, side: THREE.DoubleSide }),
        posY
      );
    }

    function hardware(shape, accentGold) {
      const black = new THREE.MeshStandardMaterial({ color: col('#111110'), roughness: 0.45, metalness: 0.2 });
      const gold = new THREE.MeshStandardMaterial({ color: col('#c9a05a'), roughness: 0.18, metalness: 0.95 });
      const pipette = new THREE.MeshPhysicalMaterial({ color: col('#ffffff'), roughness: 0.05, transmission: 0.98, thickness: 0.2, ior: 1.5 });
      const g = new THREE.Group();
      if (shape === 'dropper') {
        g.position.y = 1.7;
        g.add(mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 64), gold, 0.06));
        g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 64), accentGold ? gold : black, 0.28));
        g.add(mesh(capsule(0.18, 0.3), black, 0.66));
        g.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.6, 16), pipette, -0.85));
        g.add(mesh(new THREE.ConeGeometry(0.045, 0.1, 16), pipette, -1.68));
      } else if (shape === 'jar') {
        g.add(mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.34, 96), gold, 0.94 + 0.17));
      } else if (shape === 'mist') {
        g.position.y = 2.0;
        g.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.14, 64), gold, 0.08));
        g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.46, 64), black, 0.36));
      } else if (shape === 'pump') {
        g.position.y = 1.54;
        g.add(mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.24, 64), gold, 0.12));
        g.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 32), gold, 0.36));
        g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 48), gold, 0.56));
      } else if (shape === 'tube') {
        g.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.44, 64), black, -0.22));
      }
      return g;
    }

    const glass = product.glass;
    const shapeKey = glass.shape;
    const shape = SHAPES[shapeKey] || SHAPES.dropper;
    const isTube = shapeKey === 'tube';
    const bottle = new THREE.Group();
    bottle.position.y = -shape.height / 2 + 0.1;
    if (isTube) bottle.scale.set(1, 1, 0.62);
    bottle.add(
      new THREE.Mesh(
        lathe(shape.body, 96),
        isTube
          ? new THREE.MeshPhysicalMaterial({ color: col(glass.color), roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.4 })
          : new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.86, roughness: shape.frost, clearcoat: 1, clearcoatRoughness: 0.08, color: col(glass.color) })
      )
    );
    if (shape.fill) {
      const maxY = shape.body[shape.body.length - 1][1] * shape.fill;
      const pts = shape.body.filter((p) => p[1] <= maxY).map((p) => [Math.max(0, p[0] * 0.9), Math.max(0.06, p[1])]);
      pts.push([0, maxY]);
      pts.unshift([0, 0.06]);
      bottle.add(new THREE.Mesh(lathe(pts, 64), new THREE.MeshPhysicalMaterial({ color: col(glass.liquid), emissive: col(glass.liquid), emissiveIntensity: 0.08, roughness: 0.12, transparent: true, opacity: 0.95 })));
    }
    const lbl = label(shapeKey);
    if (lbl) bottle.add(lbl);
    bottle.add(hardware(shapeKey, product.id === 'seve-doree'));

    // Renderer, camera and lights match the R3F <Canvas> defaults used in GlassScene
    const quality = window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4 ? 'low' : 'high';
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.75 : 1.25));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.physicallyCorrectLights = true;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.insertBefore(canvas, container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 7);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const glowLight = new THREE.PointLight(col(product.glow), 18, 7);
    glowLight.position.set(0, 0.4, -1.4);
    scene.add(glowLight);

    // Studio light strips reflected in the glass (drei <Environment> + <Lightformer>)
    const env = new THREE.Scene();
    const strip = (parent, geo, intensity, pos, color) => {
      const mat = new THREE.MeshBasicMaterial({ color: col(color || '#ffffff'), side: THREE.DoubleSide, toneMapped: false });
      mat.color.multiplyScalar(intensity);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(pos[0], pos[1], pos[2]);
      parent.add(m);
      parent.updateMatrixWorld(true);
      m.lookAt(0, 0, 0);
    };
    const ring = new THREE.Group();
    ring.rotation.set(-Math.PI / 3, 0, 1);
    env.add(ring);
    strip(ring, new THREE.CircleGeometry(1, 48), 4, [0, 5, -9]);
    strip(ring, new THREE.CircleGeometry(1, 48), 2, [-5, 1, -1]);
    strip(ring, new THREE.CircleGeometry(1, 48), 2, [-5, -1, -1]);
    strip(ring, new THREE.CircleGeometry(4, 48), 2, [10, 1, 0]);
    strip(env, new THREE.PlaneGeometry(0.4, 6), 3, [-3, 0, 4], '#fff4e0');
    strip(env, new THREE.PlaneGeometry(0.4, 6), 3, [3, 0, 4], '#fff4e0');
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0, 0.1, 100).texture;
    pmrem.dispose();

    const group = new THREE.Group();
    group.add(bottle);
    scene.add(group);

    // Rig: pointer tilt, 360° drag with inertia, gentle auto-rotation, float
    const manual = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    let dragging = false;
    let last = { x: 0, y: 0 };
    const onDown = (e) => {
      if (e.target !== canvas) return;
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      if (r.width && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      manual.y += dx * 0.008;
      manual.x = Math.max(-0.45, Math.min(0.45, manual.x + dy * 0.006));
      vel.x = dx * 0.008;
      vel.y = dy * 0.006;
    };
    const onUp = () => (dragging = false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    const damp = THREE.MathUtils.damp;
    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h && (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio()))) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      if (!dragging) {
        manual.y += vel.x;
        manual.x += vel.y * 0.3;
        vel.x *= 0.93;
        vel.y *= 0.93;
        if (!reduced) manual.y += dt * 0.18;
      }
      group.rotation.y = damp(group.rotation.y, manual.y + pointer.x * 0.35, 5, dt);
      group.rotation.x = damp(group.rotation.x, manual.x - pointer.y * 0.15, 5, dt);
      group.position.y = damp(group.position.y, reduced ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.05, 4, dt);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
    };
  }

  /* ------------------------------------------------------------------ */
  /* Product page (sections/vr-main-product.liquid)                      */
  /* ------------------------------------------------------------------ */
  function initProductPage() {
    const root = $('[data-vr-product-page]');
    if (!root) return;
    const handle = readJson('script[data-vr-product-page-data]')[0];
    const product = PRODUCTS.find((p) => p.id === handle);
    const stage = $('[data-vr-stage]', root);
    const lens = $('[data-vr-lens]', root);
    const views = $$('[data-vr-view]', root);
    const panel = (id) => $(`[data-vr-media="${id}"]`, stage);
    let current = '0';
    let scene = null;
    startBlobs(root);

    // The glass bottle is offered where it can run smoothly, as in the dossier
    const view3d = views.find((b) => b.dataset.vrView === '3d');
    if (view3d && product && can3D && !reduced) view3d.hidden = false;

    // Same fade as the dossier's view switcher
    views.forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.dataset.vrView;
        if (id === current) return;
        const from = panel(current);
        const to = panel(id);
        current = id;
        views.forEach((o) => {
          const on = o === b;
          o.classList.toggle('bg-white', on);
          o.classList.toggle('text-black', on);
          o.classList.toggle('bg-black/40', !on);
          o.classList.toggle('text-white', !on);
          o.classList.toggle('hover:bg-black/60', !on);
        });
        animate(from, [{ opacity: 1 }, { opacity: 0 }], { duration: 700 }).finished.then(() => {
          from.hidden = true;
          $$('video', from).forEach((v) => v.pause());
          if (scene && from.dataset.vrMedia === '3d') {
            scene.dispose();
            scene = null;
            from.innerHTML = '';
          }
          to.hidden = false;
          if (id === '3d') {
            to.innerHTML = `<p class="grid h-full place-items-center text-[15px] text-[var(--text-secondary)]" data-loading>${esc(t('product.loading_3d'))}</p><p class="pointer-events-none absolute left-5 top-5 text-[14px] text-[var(--text-secondary)]">${esc(t('product.drag_3d'))}</p>`;
            scene = mountGlass(to, product);
          }
          animate(to, [{ opacity: 0, transform: 'scale(1.05)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 700 });
        });
      })
    );

    // Magnifier over photos
    stage.addEventListener('pointermove', (e) => {
      const img = $('img[data-zoom]', panel(current));
      if (!img || e.pointerType === 'touch') return (lens.hidden = true);
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      lens.hidden = false;
      lens.style.left = `${x}%`;
      lens.style.top = `${y}%`;
      lens.style.backgroundImage = `url(${img.dataset.zoom})`;
      lens.style.backgroundSize = '300%';
      lens.style.backgroundPosition = `${x}% ${y}%`;
    });
    stage.addEventListener('pointerleave', () => (lens.hidden = true));

    // Buy box
    const form = $('form[data-vr-product-form]', root);
    if (!form) return;
    const input = $('[data-vr-variant-input]', form);
    const qtyInput = $('[data-vr-qty-input]', form);
    const addBtn = $('[data-vr-add-button]', form);
    const priceWrap = () => $('[data-vr-buy-price] [data-vr-price]', form);
    const variantButtons = $$('[data-vr-variant]', form);
    const unitPrice = () => {
      const active = variantButtons.find((b) => b.getAttribute('aria-checked') === 'true');
      return active ? Number(active.dataset.price) : product ? product.sizes[0].price : 0;
    };
    const qty = () => Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const refreshPrice = () => rollPrice(priceWrap(), Math.round(unitPrice() * qty() * 100) / 100);

    variantButtons.forEach((b) =>
      b.addEventListener('click', () => {
        variantButtons.forEach((o) => {
          const on = o === b;
          o.setAttribute('aria-checked', String(on));
          o.classList.toggle('border-[var(--text-primary)]', on);
          ['border-[var(--border-subtle)]', 'text-[var(--text-muted)]', 'hover:border-[var(--border-strong)]'].forEach((c) => o.classList.toggle(c, !on));
        });
        input.value = b.dataset.vrVariant;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        const available = b.dataset.available === 'true';
        if (addBtn) {
          addBtn.disabled = !available;
          $('.z-10', addBtn).textContent = available ? addBtn.dataset.addLabel : t('product.sold_out');
        }
        refreshPrice();
        const url = `${root.dataset.productUrl}?variant=${b.dataset.vrVariant}`;
        history.replaceState(null, '', url);
        // Pickup availability depends on the variant
        fetch(`${url}&section_id=${root.dataset.sectionId}`)
          .then((r) => r.text())
          .then((t) => {
            const fresh = new DOMParser().parseFromString(t, 'text/html').querySelector('[data-vr-pickup]');
            const old = $('[data-vr-pickup]', root);
            if (fresh && old) old.replaceWith(fresh);
          })
          .catch(() => {});
      })
    );

    $$('[data-vr-pq]', form).forEach((b) =>
      b.addEventListener('click', () => {
        qtyInput.value = Math.max(1, qty() + Number(b.dataset.vrPq));
        refreshPrice();
      })
    );
    qtyInput.addEventListener('change', refreshPrice);

    form.addEventListener('submit', (e) => {
      if (!product) return;
      e.preventDefault();
      const size = product.sizes.find((x) => String(x.variantId) === input.value) || product.sizes[0];
      addToCart(product, size, qty(), (addBtn || form).getBoundingClientRect());
    });
  }

  // Related and complementary products load after the page, from the recommendations endpoint
  function initRecommendations() {
    $$('[data-vr-recommendations]').forEach((el) => {
      fetch(el.dataset.url)
        .then((r) => r.text())
        .then((t) => {
          const fresh = new DOMParser().parseFromString(t, 'text/html').querySelector('[data-vr-recommendations]');
          if (fresh && fresh.innerHTML.trim()) {
            el.innerHTML = fresh.innerHTML;
            el.hidden = false;
          }
        })
        .catch(() => {});
    });
  }

  /* ------------------------------------------------------------------ */
  /* Collection and search pages                                         */
  /* ------------------------------------------------------------------ */
  // "Add to bag" on product cards outside the home page grid
  function initCards() {
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-vr-add]');
      if (!add || add.closest('[data-vr-grid]')) return;
      const p = PRODUCTS.find((x) => x.id === add.dataset.vrAdd);
      if (p) addToCart(p, p.sizes[0], 1, add.getBoundingClientRect());
    });
  }

  // Filters and sorting apply as soon as they change
  function initFacets() {
    $$('form[data-vr-facets]').forEach((form) => {
      let timer = null;
      const submit = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // Leave empty price fields out of the URL
          $$('input[type="number"]', form).forEach((i) => (i.disabled = i.value === ''));
          form.requestSubmit ? form.requestSubmit() : form.submit();
        }, 450);
      };
      form.addEventListener('change', submit);
      // One filter panel open at a time; close on outside click
      $$('details[data-vr-filter]', form).forEach((d) =>
        d.addEventListener('toggle', () => {
          if (d.open) $$('details[data-vr-filter]', form).forEach((o) => o !== d && (o.open = false));
        })
      );
      document.addEventListener('click', (e) => {
        if (!e.target.closest('details[data-vr-filter]')) $$('details[data-vr-filter]', form).forEach((d) => (d.open = false));
      });
    });
  }

  // Predictive search under any form marked data-vr-predictive
  function initPredictive() {
    $$('form[data-vr-predictive]').forEach((form) => {
      const input = $('[data-vr-predictive-input]', form);
      const box = $('[data-vr-predictive-results]', form);
      if (!input || !box) return;
      let timer = null;
      let controller = null;
      const close = () => {
        box.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      };
      input.addEventListener('input', () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) return close();
        timer = setTimeout(() => {
          if (controller) controller.abort();
          controller = new AbortController();
          const url = `${ROUTES.predictiveSearch || '/search/suggest'}?q=${encodeURIComponent(q)}&resources[type]=product,query,collection,page,article&resources[limit]=4&resources[options][unavailable_products]=last&section_id=vr-predictive-search`;
          fetch(url, { signal: controller.signal })
            .then((r) => r.text())
            .then((t) => {
              const doc = new DOMParser().parseFromString(t, 'text/html');
              const fresh = doc.querySelector('#shopify-section-vr-predictive-search') || doc.body;
              box.innerHTML = fresh.innerHTML;
              box.hidden = !box.textContent.trim();
              input.setAttribute('aria-expanded', String(!box.hidden));
            })
            .catch(() => {});
        }, 220);
      });
      input.addEventListener('keydown', (e) => e.key === 'Escape' && close());
      document.addEventListener('click', (e) => !form.contains(e.target) && close());
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cart page (sections/vr-main-cart.liquid)                            */
  /* ------------------------------------------------------------------ */
  function initCartPage() {
    const root = $('[data-vr-cart-page]');
    if (!root) return;
    // Quantity changes apply instantly, then the page re-renders with fresh totals and discounts
    const change = (key, quantity) => cartRequest(ROUTES.cartChange, { id: key, quantity }).then(() => window.location.reload());
    $$('[data-vr-line]', root).forEach((line) => {
      const key = line.dataset.vrLine;
      const input = $('[data-vr-line-input]', line);
      $$('[data-vr-line-qty]', line).forEach((b) =>
        b.addEventListener('click', () => change(key, Math.max(0, (parseInt(input.value, 10) || 0) + Number(b.dataset.vrLineQty))))
      );
      input.addEventListener('change', () => change(key, Math.max(0, parseInt(input.value, 10) || 0)));
      const remove = $('[data-vr-line-remove]', line);
      if (remove)
        remove.addEventListener('click', (e) => {
          e.preventDefault();
          animate(line, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-20px)' }], { duration: 250, easing: 'ease-in' });
          change(key, 0);
        });
    });
    const note = $('[data-vr-cart-note]', root);
    if (note) {
      let timer = null;
      note.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => cartRequest(ROUTES.cartUpdate, { note: note.value }).catch(() => {}), 500);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function syncBag() {
    $$('[data-vr-bag-count]').forEach((el) => (el.textContent = store.count));
    const bag = $('[data-vr-bag-open]');
    if (bag) bag.setAttribute('aria-label', t('bag.open', { count: store.count }));
    renderCart();
  }
  store.subscribe(syncBag);

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (dossier) closeDossier();
    else if (cart) closeCart();
    else if (menuOpen) setMenu(false);
  });

  initNavbar();
  initHero();
  initCollection();
  initRitual();
  initFooter();
  initProductPage();
  initCards();
  initCartPage();
  initFacets();
  initPredictive();
  initRecommendations();
  syncBag();

  refreshCart().catch(() => {});
})();
