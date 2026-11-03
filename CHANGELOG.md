# Changelog — Verenne Botanical Skincare

All notable changes to the Verenne storefront are documented in this file.

---

## [2.0.0] - 2026-11-02

### Major Creative & Technical Elevation (Phases 1–5)

#### Brand Architecture & Rebranding
- Rebranded every storefront asset, wordmark, meta tag, documentation, and preloader from **Verenne** to **Verenne**.
- Standardized luxury editorial typography pairing Cormorant Garamond with Manrope.
- Introduced three persistent atmospheric themes: **Mist**, **Dusk**, and **Blush** (stored in `localStorage.getItem("verenne-theme")` with zero flash on initial load).
- Integrated **Lenis** smooth scrolling for 60 FPS inertia.

#### Unified Product System (Route B)
- Engineered a single `<Product id size interactive />` component deployed consistently across all surfaces (Hero, Shop Cards, Quick View, Circadian Rituals, Cart Drawer, and Bestseller Rail).
- Handcrafted layered SVG rendering covering 7 luxury cosmetic archetypes: Dropper, Jar, Lotion Pump, Airless Pump, Mist Spray, Tube, and Oil Bottle.
- Features dynamic liquid levels, glass refraction highlights, embossed `"VELENNE"` glass wordmarks, and floor contact shadows.

#### Signature 3.0s "Product Moment" Animations
- Rebuilt all product visuals as accessible `<button aria-label="Play {name} animation">` elements.
- Engineered a universal 4-stage physics envelope: Anticipation (0–0.25s), Lift (0.25–0.9s), Archetype Action (0.9–2.2s), and Spring Settle (2.2–3.0s).
- Product actions:
  - *Dropper*: Pipette lift, falling droplet, floor ripple, 8 drifting petals.
  - *Jar*: Lid twist-off, animated cream swirl via SVG `pathLength`, rising scent wisps.
  - *Pump*: Head depression, foam bloom, bottle recoil.
  - *Mist*: Nozzle press, 14-particle dew fan, recoil.
  - *Tube*: Tube squeeze, extruded cream ribbon curl and retract.
  - *Oil*: 35° tilt, golden liquid stream, floor ripples.
- Added pointer-following 3D perspective tilt, idle breathing, and 6-second hero auto-play.

#### Signature "Dew" Skincare Cursor
- Created an organic liquid bead cursor with 5 trailing droplets merged via SVG gooey filter (`feGaussianBlur` + `feColorMatrix`).
- Integrated velocity-based elongation and directional rotation.
- Contextual interaction modes:
  - `"Tap to play"` badge over product visuals.
  - `"<— Drag —>"` badge over horizontal rails.
  - Soft expansion ring over buttons and links.
  - Restored native cursor over input fields and textareas.
- Click feedback: 8-particle micro-droplet splash and expanding ripple ring.
- Automatic touch detection (`pointer: coarse`) and reduced motion fallback.

#### 12-Product Catalog & Commerce UX
- Expanded catalog to 12 biodynamic formulations across 5 categories (`Cleanse`, `Treat`, `Hydrate`, `Protect`, `Body`).
- Implemented multi-size variant selection with real-time price morphing (`AnimatedPrice`).
- Built category, skin-type, and price-tier filtering with live search matching.
- Implemented Quick-View shared-element modal transition (`layoutId`).
- Added parabolic fly-to-cart animation (`FlyToCartOverlay`) with bag bounce.
- Wishlist heart with `localStorage` persistence.
- Cart drawer with free shipping progress bar ($120 goal), promo engine (`BOTANICAL15`), and "Complete the Ritual" recommendations.

#### New Editorial Experiences
- **"From Soil to Skin" Scroll Story**: Pinned section with botanical line art drawing itself via `strokeDashoffset`, live elevation/temp counters, and a Swiss violet glass vial whose liquid rises with scroll progress.
- **Best-Sellers Horizontal Rail**: Snap-scrolling rail with drag inertia, star ratings, and instant add-to-bag.
- **Diagnostic Skin Quiz**: 3-question diagnostic tool prescribing a bespoke 3-product routine with a single-click *"Add Entire Ritual to Bag"* (15% savings).
- **Before / After Clinical Drag Slider**: Interactive comparison between Day 0 barrier deficit and Day 28 cellular radiance with verified corneometry metrics.
- **Atelier Customizer Panel**: Drawer allowing real-time switching of 3 themes, 4 botanical accents, font pairs, and motion intensity.

#### Quality & Performance Gates
- Main bundle size: `164.5 kB` gzip (strictly $\le 220\text{ kB}$).
- Clean Vite build in `~1.2 seconds`.
- 0 runtime console errors across desktop and mobile viewports.
- 0 horizontal overflow across 360px, 390px, 820px, and 1440px viewports.
- Keyboard accessibility: full path verified through card focus, quick-view modal, variant selection, cart drawer, and checkout.

