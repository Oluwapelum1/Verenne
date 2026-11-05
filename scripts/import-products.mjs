// Creates or updates the 16 Verenne products in a Shopify store from src/data.js,
// then publishes them to the Online Store. Safe to re-run: products are matched by handle.
// Requires a one-time `shopify store auth --store <domain> --scopes write_products,read_products,write_publications,read_publications`.
// Usage: node scripts/import-products.mjs <store>.myshopify.com
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const store = process.argv[2];
if (!store) throw new Error('Usage: node scripts/import-products.mjs <store>.myshopify.com');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS, CATEGORIES } = await import(pathToFileURL(path.join(root, 'src', 'data.js')).href);
const IMAGE_BASE = 'https://oluwapelum1.github.io/Verenne/products/';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verenne-import-'));

function gql(query, variables, { mutate = false } = {}) {
  // Query and variables go through files so the Windows shell never splits them
  const varFile = path.join(tmp, 'vars.json');
  const queryFile = path.join(tmp, 'query.graphql');
  fs.writeFileSync(varFile, JSON.stringify(variables || {}));
  fs.writeFileSync(queryFile, query);
  const args = ['store', 'execute', '--store', store, '--query-file', queryFile, '--variable-file', varFile, '--json', '--no-input'];
  if (mutate) args.push('--allow-mutations');
  // The CLI aborts slow requests (productSet waits on image downloads); retrying is safe because products are matched by handle
  for (let attempt = 1; ; attempt++) {
    try {
      const out = execFileSync('shopify', args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
      const json = JSON.parse(out.slice(out.indexOf('{')));
      return json.data ?? json;
    } catch (err) {
      if (attempt >= 4) throw err;
      console.log(`  retrying (${attempt}/3)…`);
    }
  }
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const file = (p) => p.replace(/^.*\/products\//, '');

const PRODUCT_SET = `mutation ($identifier: ProductSetIdentifiers, $input: ProductSetInput!) {
  productSet(identifier: $identifier, input: $input, synchronous: true) {
    product { id handle title }
    userErrors { field message }
  }
}`;

const publications = gql('{ publications(first: 20) { nodes { id name } } }').publications.nodes;
const onlineStore = publications.find((p) => /online store/i.test(p.name));

for (const p of PRODUCTS) {
  const cat = CATEGORIES.find((c) => c.id !== 'all' && c.ids.includes(p.id));
  const input = {
    title: p.fullName,
    handle: p.id,
    vendor: 'Verenne',
    productType: p.category,
    status: 'ACTIVE',
    tags: [cat?.label, p.category, p.moment].filter(Boolean),
    descriptionHtml: [
      `<p>${esc(p.description)}</p>`,
      `<p><strong>Key botanicals:</strong> ${esc(p.keyIngredients.join(', '))}</p>`,
      `<p><strong>Texture:</strong> ${esc(p.texture)} · <strong>Scent:</strong> ${esc(p.notes.join(' · '))}</p>`,
      `<p><strong>How to use:</strong> ${esc(p.howToUse)}</p>`
    ].join(''),
    seo: { title: `${p.fullName} — ${p.subtitle} | Verenne`, description: p.description },
    productOptions: [{ name: 'Size', values: p.sizes.map((s) => ({ name: s.size })) }],
    variants: p.sizes.map((s) => ({
      optionValues: [{ optionName: 'Size', name: s.size }],
      price: s.price.toFixed(2),
      sku: `VER-${p.no}-${s.size.replace(/\s+/g, '').toUpperCase()}`,
      inventoryPolicy: 'DENY',
      taxable: true
    })),
    files: [
      { originalSource: `${IMAGE_BASE}${file(p.image)}.jpg`, contentType: 'IMAGE', alt: `${p.fullName} — ${p.subtitle}` },
      { originalSource: `${IMAGE_BASE}${file(p.portrait)}`, contentType: 'IMAGE', alt: `${p.fullName} on skin` }
    ]
  };

  const res = gql(PRODUCT_SET, { identifier: { handle: p.id }, input }, { mutate: true }).productSet;
  if (res.userErrors.length) {
    console.log(`✗ ${p.id}: ${res.userErrors.map((e) => e.message).join('; ')}`);
    continue;
  }
  if (onlineStore) {
    gql(
      'mutation ($id: ID!, $pub: ID!) { publishablePublish(id: $id, input: [{ publicationId: $pub }]) { userErrors { message } } }',
      { id: res.product.id, pub: onlineStore.id },
      { mutate: true }
    );
  }
  console.log(`✓ ${res.product.handle} — ${res.product.title}`);
}

if (!onlineStore) console.log('Note: no Online Store publication found; publish the products from the admin.');
fs.rmSync(tmp, { recursive: true, force: true });
