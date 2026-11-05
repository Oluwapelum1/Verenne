// Builds the Verenne theme documentation (public/docs/index.html) for GitHub Pages.
// The settings reference is generated from the theme's own schemas, so it always matches the editor.
// Usage: node scripts/build-theme-docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const theme = path.join(root, 'verenne-os');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const globalSchema = JSON.parse(fs.readFileSync(path.join(theme, 'config', 'settings_schema.json'), 'utf8'));
const info = globalSchema.find((g) => g.name === 'theme_info');

// Section schemas, in the order merchants meet them
const ORDER = [
  'vr-header', 'vr-hero', 'vr-collection', 'vr-manifesto', 'vr-ritual', 'vr-origins', 'vr-press', 'vr-faq', 'vr-footer',
  'vr-main-product', 'vr-product-recommendations', 'vr-main-collection', 'vr-main-list-collections', 'vr-main-search',
  'vr-main-cart', 'vr-main-blog', 'vr-main-article', 'vr-main-page', 'vr-contact-form', 'vr-main-404', 'vr-main-password'
];
const sections = ORDER.map((file) => {
  const src = fs.readFileSync(path.join(theme, 'sections', `${file}.liquid`), 'utf8');
  const m = src.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/);
  return { file, schema: JSON.parse(m[1]) };
});

const TYPE_LABEL = {
  text: 'Text', textarea: 'Text area', richtext: 'Rich text', checkbox: 'Checkbox', range: 'Range', select: 'Select',
  number: 'Number', color: 'Color', font_picker: 'Font', image_picker: 'Image', collection: 'Collection', product: 'Product',
  link_list: 'Menu', liquid: 'Liquid', header: 'Heading'
};

function settingsTable(settings) {
  const rows = (settings || []).filter((s) => s.type !== 'header' && s.type !== 'paragraph');
  if (!rows.length) return '<p class="muted">No settings.</p>';
  return `<table><thead><tr><th>Setting</th><th>Type</th><th>Default</th><th>Notes</th></tr></thead><tbody>${rows
    .map((s) => {
      let def = s.default;
      if (s.type === 'select' && def !== undefined) def = (s.options.find((o) => o.value === def) || {}).label || def;
      if (s.type === 'checkbox') def = def ? 'On' : 'Off';
      if (s.type === 'range' && def !== undefined) def = `${def}${s.unit || ''} (${s.min}–${s.max})`;
      if (typeof def === 'string') def = def.replace(/<[^>]+>/g, '');
      return `<tr><td>${esc(s.label)}</td><td>${esc(TYPE_LABEL[s.type] || s.type)}</td><td>${def === undefined || def === '' ? '<span class="muted">—</span>' : esc(def)}</td><td>${esc(s.info || '')}</td></tr>`;
    })
    .join('')}</tbody></table>`;
}

function sectionDoc({ file, schema }) {
  const blocks = (schema.blocks || []).filter((b) => b.type !== '@app');
  const hasApp = (schema.blocks || []).some((b) => b.type === '@app');
  return `<article class="ref" id="${slug(schema.name)}">
    <h3>${esc(schema.name)} <code>${file}</code></h3>
    ${settingsTable(schema.settings)}
    ${
      blocks.length
        ? `<h4>Blocks</h4>${blocks
            .map((b) => `<details><summary>${esc(b.name)}${b.limit ? ` <span class="muted">· up to ${b.limit}</span>` : ''}</summary>${settingsTable(b.settings)}</details>`)
            .join('')}`
        : ''
    }
    ${hasApp ? '<p class="muted">Also accepts app blocks.</p>' : ''}
  </article>`;
}

const globalDoc = globalSchema
  .filter((g) => g.name !== 'theme_info')
  .map((g) => `<article class="ref" id="settings-${slug(g.name)}"><h3>${esc(g.name)}</h3>${settingsTable(g.settings)}</article>`)
  .join('');

const DETAILS_EXAMPLE = {
  subtitle: 'Active botanical serum',
  latin: 'Helichrysum stoechas',
  texture: 'Weightless golden micro-oil',
  notes: ['Immortelle', 'Neroli', 'Cedar'],
  keyIngredients: ['Corsican Helichrysum', 'Rosehip seed'],
  benefits: ['Replenishes the lipid barrier', 'Lit-from-within radiance'],
  howToUse: 'Warm 3–4 drops between palms and press into damp skin.',
  ph: '5.2 (Skin-neutral)',
  finish: 'Lit-from-within satin',
  glow: '#F2A65A',
  glass: { shape: 'dropper', color: '#7A3F12', liquid: '#E08A2E' },
  moment: 'Dawn',
  synergy: { pairId: 'brume-botanique', benefit: 'Press into damp skin so the oil spreads more easily' },
  description: 'A one or two sentence summary shown in the product dossier.'
};

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verenne theme documentation</title>
  <meta name="description" content="How to set up and customize the Verenne Shopify theme: settings, sections, product details, filters, reviews and translations.">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..600&family=Figtree:wght@300..600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../support/site.css">
</head>
<body>
  <header class="top">
    <a class="brand" href="../">Verenne <span>Theme documentation</span></a>
    <nav><a href="#start">Start</a><a href="#settings">Settings</a><a href="#sections">Sections</a><a href="../support/">Support</a></nav>
  </header>

  <div class="layout">
    <aside class="toc" aria-label="Contents">
      <p class="label">Guides</p>
      <a href="#start">Getting started</a>
      <a href="#details">Product details</a>
      <a href="#home">Home page content</a>
      <a href="#navigation">Menus and anchors</a>
      <a href="#filters">Filters and search</a>
      <a href="#reviews">Reviews</a>
      <a href="#markets">Countries and languages</a>
      <a href="#text">Editing theme text</a>
      <a href="#accessibility">Accessibility</a>
      <p class="label">Reference</p>
      <a href="#settings">Theme settings</a>
      <a href="#sections">Sections</a>
      <a href="#changelog">Release notes</a>
    </aside>

    <main>
      <section class="hero">
        <p class="label">Version ${esc(info.theme_version)}</p>
        <h1>A slow, botanical storefront, <em>set up in an afternoon.</em></h1>
        <p class="lead">Verenne is an editorial Shopify theme for small-batch beauty and wellness brands: an asymmetric product grid, a full-page product dossier with a magnifier and a 3D glass bottle, and a dawn-to-dusk ritual dial.</p>
      </section>

      <section id="start">
        <h2>Getting started</h2>
        <ol>
          <li>In your Shopify admin, go to <strong>Online Store → Themes</strong>, add Verenne and choose <strong>Customize</strong>.</li>
          <li>Under <strong>Theme settings</strong>, pick your <strong>Heading font</strong> and <strong>Body font</strong> and set the dark and light color schemes. The defaults are Bodoni Moda and Figtree on warm ink and travertine.</li>
          <li>On the home page, choose the <strong>Product collection</strong> section's collection and add a <strong>Filter</strong> block for each category you want as a tab.</li>
          <li>Add <strong>Step</strong> blocks to the <strong>Ritual dial</strong>, one per product, set to the first or second routine (for example Dawn and Dusk).</li>
          <li>Create menus named <code>main-menu</code> and <code>footer</code> under <strong>Content → Menus</strong>; the header and footer use them automatically.</li>
          <li>Optionally add the <a href="#details">product details metafield</a> to unlock the dossier's specs, texture swatch, scent notes and 3D bottle.</li>
        </ol>
      </section>

      <section id="details">
        <h2>Product details</h2>
        <p>Everything in the theme works with standard product data: title, description, images, variants and price. The dossier and product page show extra rows when a product has a <code>verenne.details</code> metafield of type <strong>JSON</strong>. Each field is optional; rows without data are hidden.</p>
        <ol>
          <li>Go to <strong>Settings → Custom data → Products</strong> and add a definition: namespace and key <code>verenne.details</code>, type <strong>JSON</strong>.</li>
          <li>Open a product and paste its details into the new field:</li>
        </ol>
        <pre><code>${esc(JSON.stringify(DETAILS_EXAMPLE, null, 2))}</code></pre>
        <table>
          <thead><tr><th>Field</th><th>Shown as</th></tr></thead>
          <tbody>
            <tr><td><code>subtitle</code></td><td>Italic line under the product name, and on product cards</td></tr>
            <tr><td><code>ph</code>, <code>finish</code></td><td>The two specification boxes</td></tr>
            <tr><td><code>texture</code>, <code>glow</code></td><td>Texture row with an animated swatch in the <code>glow</code> color</td></tr>
            <tr><td><code>notes</code>, <code>keyIngredients</code>, <code>benefits</code>, <code>howToUse</code></td><td>Scent, key botanicals, numbered benefits and how-to rows</td></tr>
            <tr><td><code>glass</code></td><td>The 3D bottle: <code>shape</code> is <code>dropper</code>, <code>jar</code>, <code>mist</code>, <code>pump</code> or <code>tube</code>; <code>color</code> is the glass, <code>liquid</code> the contents</td></tr>
            <tr><td><code>moment</code></td><td>Groups products for “Pairs well with” in the home page dossier</td></tr>
            <tr><td><code>synergy</code></td><td>“Recommended partner” with a button that adds both products. <code>pairId</code> is the partner's handle</td></tr>
            <tr><td><code>description</code></td><td>Short summary used in the dossier instead of the full description</td></tr>
          </tbody>
        </table>
        <p>Product titles that start with a number such as <code>N°01 Éclat Sauvage</code> show the number separately and the name in large type.</p>
      </section>

      <section id="home">
        <h2>Home page content</h2>
        <p>The home page is built from sections you can reorder, hide or duplicate: Hero, Product collection, Manifesto, Ritual dial, Origins, Press and FAQ. Lists such as manifesto standards, origins, quotes and questions are blocks, so you can add or remove entries freely. The hero button can show your lowest price: write <code>[price]</code> in its label.</p>
        <p>Clicking a product on the home page opens the product dossier in place. Product cards everywhere else link to the full product page.</p>
      </section>

      <section id="navigation">
        <h2>Menus and anchors</h2>
        <p>Links to sections on the home page scroll smoothly. Use the section's anchor, for example <code>/#collection</code>, <code>/#ritual</code>, <code>/#origins</code> or <code>/#faq</code>. Until you create a <code>main-menu</code>, the header shows these four links. The full-screen menu also lists your products and includes predictive search.</p>
      </section>

      <section id="filters">
        <h2>Filters and search</h2>
        <p>Collection and search pages use Shopify's storefront filtering. Choose which filters appear (availability, price, product type, tags, variant options or metafields) in the free <strong>Search &amp; Discovery</strong> app. The same app sets complementary products for the “Complete the ritual” recommendations on product pages.</p>
      </section>

      <section id="reviews">
        <h2>Reviews</h2>
        <p>Star ratings appear on product pages and in the dossier when products have Shopify's standard review metafields (<code>reviews.rating</code> and <code>reviews.rating_count</code>). Most review apps write these automatically. Without review data, no stars are shown.</p>
      </section>

      <section id="markets">
        <h2>Countries and languages</h2>
        <p>The footer's language and currency control switches the storefront when you sell in several markets or languages. Add them under <strong>Settings → Markets</strong> and <strong>Settings → Languages</strong>; the control updates on its own.</p>
      </section>

      <section id="text">
        <h2>Editing theme text</h2>
        <p>Headings and section text are edited in the theme editor. Shopper-facing labels such as “Add to bag”, “Bag”, “Checkout”, the empty-bag message and delivery notes live in the theme's language file: go to <strong>Online Store → Themes → ⋯ → Edit default theme content</strong> and search for the text. Translations for other languages are added the same way, or with the Translate &amp; Adapt app.</p>
      </section>

      <section id="accessibility">
        <h2>Accessibility</h2>
        <p>The theme scores 100 for accessibility in Lighthouse on the home, product and collection pages. Menus, the bag and the dossier close with Escape, every control is reachable by keyboard with a visible focus outline, motion is reduced for visitors who ask for it, and the default colors meet WCAG AA contrast. If you change colors, keep body text at a contrast of at least 4.5:1.</p>
      </section>

      <section id="settings">
        <h2>Theme settings</h2>
        ${globalDoc}
      </section>

      <section id="sections">
        <h2>Sections</h2>
        <p class="muted">Generated from the theme's section schemas.</p>
        ${sections.map(sectionDoc).join('')}
      </section>

      <section id="changelog">
        <h2>Release notes</h2>
        <h3>${esc(info.theme_version)}</h3>
        <ul>
          <li>First release: editorial home page with product dossier, ritual dial, origins and FAQ.</li>
          <li>Product page with magnifier, media views, 3D glass bottle, dynamic checkout, Shop Pay Installments, pickup availability and recommendations.</li>
          <li>Collection, search and collection list pages with storefront filtering, sorting and predictive search.</li>
          <li>Cart drawer and cart page with discounts, unit prices and accelerated checkout; blog, article, contact, 404, password and gift card pages.</li>
          <li>Customer account button, country and language selectors, and fully translatable text.</li>
        </ul>
      </section>

      <footer class="foot">
        <p>Need help? <a href="../support/">Contact support</a>. We reply within two business days.</p>
      </footer>
    </main>
  </div>
</body>
</html>
`;

const out = path.join(root, 'public', 'docs');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`public/docs/index.html — ${sections.length} sections, ${globalSchema.length - 1} setting groups`);
