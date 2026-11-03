# VERENNE — Luxury Haute-Botanique eCommerce & Editorial Lookbook

> **"Botanical skincare, formulated slowly."**  
> An art-directed luxury skincare storefront designed for high-end boutique brands, ThemeForest, and headless eCommerce. Built with **React 19**, **Three.js / React Three Fiber**, **Tailwind CSS v4**, **Framer Motion**, and **Lenis**.

[![React: 19](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Tailwind: v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Three.js: WebGL 3D](https://img.shields.io/badge/Three.js-WebGL_Transmission_Glass-amber.svg)](https://threejs.org/)
[![License: Commercial / ThemeForest](https://img.shields.io/badge/License-Envato_Market-green.svg)](#license--credits)

---

## 🌟 Key Features & Innovations

1. **Obsidian Dark Luxury Aesthetic**:
   - Deep obsidian canvas (`#0A0A09`), champagne gold highlights (`#E2B26A`), subtle hairline borders, micro-film grain, and dual-font typography (*Instrument Serif* + *Geist* / *Geist Mono*).
   - Top rotating **Announcement Bar** for free shipping thresholds, batch availability, and botanical guarantees.
   - Refined **Maison Verenne Gold Seal Crest** and vector favicon.

2. **Real-Time 3D WebGL Bottle Studio (`src/components/three/GlassScene.jsx`)**:
   - Procedural transmission glass bottle shader with refractive liquid core, internal pipette, knurled gold collar, and authentic paper label with gold hairline foil.
   - **Interactive 360° Direct Pointer Orbit**: Drag horizontally and vertically to rotate the flacon with physical inertia and dampening.
   - Automatic graceful degradation for low-GPU devices and reduced-motion preferences.

3. **Haute Editorial Lookbook & Shoppable Hotspots (`src/components/OnSkin.jsx`)**:
   - Double-page magazine editorial spread modeled after Dribbble & Behance award-winning skincare lookbooks.
   - **Interactive Shoppable Hotspot Pin**: Pulsing gold pin on the product packshot reveals a floating frosted glass pill with live price, formula name, and direct 1-tap "Quick Add to Bag".
   - Scannable clinical formulation pillars (*Cold-Pressed < 28°C*, *14s Intercellular Absorption*, *99.4% Biomimetic*).
   - Autonomous smooth progression between flagship campaigns with user hover/touch override.

4. **L'Atelier des Standards (`src/components/Manifesto.jsx`)**:
   - Interactive alchemical console proving the Four Inviolable Statutes:
     - **Pillar I (16 Formulations · Equilibrium)**: Closed biological system (4 Cleansers, 4 Treatments, 4 Hydrators, 4 Restoratives).
     - **Pillar II (72h Kinetics)**: Dawn Corsican harvest to cold copper-still distillation within 72 hours.
     - **Pillar III (99.4% Biomimetic Lipids)**: Plant squalane matching human sebum in 14 seconds.
     - **Pillar IV (0% Synthetic Additives)**: Institutional ban on silicones, PEGs, and artificial fragrances.

5. **Dual-Experience Product Catalogue (`src/components/Collection.jsx`)**:
   - **The Specimen Shelf**: 3D spatial coverflow carousel with continuous auto-orbiting, floor reflections, and size selectors.
   - **Formulation Matrix**: High-productivity comparative laboratory table displaying pH level, bio-active potency %, absorption window, and targeted concern badges with quick 1-click Add to Bag.
   - **Botanical Synergy Duo Protocol**: Highlights paired companion products with calculated synergy benefits and instant bundle discounts.

6. **Full-Featured Commerce Experience**:
   - Slide-over **Cart Drawer** with live shipping fee calculation ($120 free shipping threshold), promo codes, item quantity controls, and fly-to-cart particle feedback.
   - Comprehensive **Product Detail Dossier Modal** with interactive pointer zoom magnifier, sensory swatches, key botanicals, and circadian pairing suggestions.

---

## 🚀 Quick Start & Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (default port 5180)
npm run dev

# 3. Compile optimized production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg          # Bespoke Maison Verenne gold monogram favicon
│   ├── products/            # 16 distinct photorealistic product packshots (.webp, -600, -320)
│   └── videos/              # Video ad loops and ritual cinematics
├── src/
│   ├── components/
│   │   ├── AnnouncementBar.jsx      # Top rotating conversion ticker
│   │   ├── Navbar.jsx               # Header with brand crest, atmospheric aura, and bag trigger
│   │   ├── Hero.jsx                 # Campaign hero with 3D studio integration
│   │   ├── HeroCommercialAdStage.jsx# Dual-mode Editorial Specimen & 3D Flacon
│   │   ├── Manifesto.jsx            # Scroll word-reveal & Four Inviolable Statutes
│   │   ├── Categories.jsx           # Diagnostic concern filter & routine categories
│   │   ├── Collection.jsx           # Dual-mode catalogue (3D Shelf + Formulation Matrix)
│   │   ├── OnSkin.jsx               # Haute Editorial Lookbook & Shoppable Hotspot Pins
│   │   ├── Ritual.jsx               # Circadian Dawn / Dusk interactive dial
│   │   ├── Origins.jsx              # Pinned scrollytelling harvest journey
│   │   ├── Press.jsx                # Endless marquee of press quotes
│   │   ├── FAQ.jsx                  # Accordion FAQ & client assistance
│   │   ├── Footer.jsx               # French luxury footer with sitemap & Grasse clock
│   │   ├── CartDrawer.jsx           # Slide-out bag drawer with tier progress
│   │   ├── ProductDetailModal.jsx   # Product dossier with zoom magnifier & telemetry
│   │   ├── Cursor.jsx               # Velocity-responsive magnetic dewdrop cursor
│   │   ├── Preloader.jsx            # Animated gold monogram & wordmark preloader
│   │   ├── ui.jsx                   # VerenneLogo, SplitChars, PillButton, AnimatedPrice
│   │   └── three/
│   │       └── GlassScene.jsx       # WebGL 3D glass transmission bottle engine
│   ├── context/
│   │   ├── CartContext.jsx          # Shopping bag, wishlist, and toast state
│   │   └── AuraContext.jsx          # Atmospheric color calibration state
│   ├── data.js                      # 16 complete formulations, categories, and reviews
│   ├── App.jsx                      # Main layout and storefront orchestration
│   └── index.css                    # Tailwind CSS v4 @theme, luxury tokens & film grain
└── package.json
```

---

## 📜 License & Asset Credits

This template complies with all Envato Author Terms and marketplace licensing standards:

* **Typography**:
  - *Instrument Serif* — Designed by Rodrigo Fuenzalida (SIL Open Font License)
  - *Geist* & *Geist Mono* — Designed by Vercel (SIL Open Font License)
* **Icons**:
  - *Lucide React* — Open source (ISC License / MIT)
* **Libraries**:
  - React 19, Three.js, React Three Fiber, Framer Motion, Lenis — (MIT License)
* **Imagery & Media**:
  - Packshots and brand assets are original creations for the fictional brand *Maison Verenne* and cleared for demonstration and template preview use.
