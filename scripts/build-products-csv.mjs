// Writes verenne-products-import.csv (Shopify product CSV) from src/data.js,
// so the store's catalogue matches the storefront: same handles, sizes, prices and photography.
// Handles equal the storefront ids and variant titles equal the size labels ("30 ml"),
// which is what the bag's checkout uses to find each Shopify variant.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS, CATEGORIES } = await import(pathToFileURL(path.join(root, 'src', 'data.js')).href);
const IMAGE_BASE = 'https://oluwapelum1.github.io/Verenne/products/';

const COLUMNS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker',
  'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable', 'Image Src',
  'Image Position', 'Image Alt Text', 'Gift Card', 'SEO Title', 'SEO Description', 'Variant Weight Unit', 'Status'
];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const file = (p) => p.replace(/^.*\/products\//, '');

const rows = [];
for (const p of PRODUCTS) {
  const cat = CATEGORIES.find((c) => c.id !== 'all' && c.ids.includes(p.id));
  const body = [
    `<p>${esc(p.description)}</p>`,
    `<p><strong>Key botanicals:</strong> ${esc(p.keyIngredients.join(', '))}</p>`,
    `<p><strong>Texture:</strong> ${esc(p.texture)} · <strong>Scent:</strong> ${esc(p.notes.join(' · '))}</p>`,
    `<p><strong>How to use:</strong> ${esc(p.howToUse)}</p>`
  ].join('');
  const images = [
    { src: `${IMAGE_BASE}${file(p.image)}.jpg`, alt: `${p.fullName} — ${p.subtitle}` },
    { src: `${IMAGE_BASE}${file(p.portrait)}`, alt: `${p.fullName} on skin` }
  ];

  p.sizes.forEach((s, i) => {
    const first = i === 0;
    rows.push({
      Handle: p.id,
      Title: first ? p.fullName : '',
      'Body (HTML)': first ? body : '',
      Vendor: first ? 'Verenne' : '',
      Type: first ? p.category : '',
      Tags: first ? [cat?.label, p.category, p.moment].filter(Boolean).join(', ') : '',
      Published: first ? 'TRUE' : '',
      'Option1 Name': first ? 'Size' : '',
      'Option1 Value': s.size,
      'Variant SKU': `VER-${p.no}-${s.size.replace(/\s+/g, '').toUpperCase()}`,
      'Variant Grams': 0,
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': s.price.toFixed(2),
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Image Src': images[i]?.src ?? '',
      'Image Position': images[i] ? i + 1 : '',
      'Image Alt Text': images[i]?.alt ?? '',
      'Gift Card': first ? 'FALSE' : '',
      'SEO Title': first ? `${p.fullName} — ${p.subtitle} | Verenne` : '',
      'SEO Description': first ? p.description : '',
      'Variant Weight Unit': 'g',
      Status: first ? 'active' : ''
    });
  });
  // Any image beyond the variant rows still needs its own row
  for (let i = p.sizes.length; i < images.length; i++) {
    rows.push({ Handle: p.id, 'Image Src': images[i].src, 'Image Position': i + 1, 'Image Alt Text': images[i].alt });
  }
}

const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(root, 'verenne-products-import.csv'), '﻿' + csv);
console.log(`verenne-products-import.csv: ${PRODUCTS.length} products, ${rows.length} rows`);
