// Store content for the Verenne theme beyond products: the hero photo in Files and the
// navigation menus the header and footer read (main-menu, footer).
// Requires write_files and write_online_store_navigation. Safe to re-run.
// Usage: node scripts/setup-store-extras.mjs <store>.myshopify.com
import { admin } from './shopify-admin.mjs';

const store = process.argv[2];
if (!store) throw new Error('Usage: node scripts/setup-store-extras.mjs <store>.myshopify.com');
const gql = admin(store);

// 1. Hero photo
const HERO = 'model_oil_glow.jpg';
const found = gql('query ($q: String!) { files(first: 1, query: $q) { nodes { id fileStatus } } }', { q: `filename:${HERO}` }).files.nodes[0];
if (found) {
  console.log(`✓ ${HERO} already in Files`);
} else {
  const r = gql(
    'mutation ($f: [FileCreateInput!]!) { fileCreate(files: $f) { files { id fileStatus } userErrors { field message } } }',
    { f: [{ originalSource: `https://oluwapelum1.github.io/Verenne/products/${HERO}`, filename: HERO, contentType: 'IMAGE', alt: 'A woman pressing a golden facial oil into her cheek' }] },
    { mutate: true }
  ).fileCreate;
  if (r.userErrors.length) throw new Error(JSON.stringify(r.userErrors));
  console.log(`✓ ${HERO} uploaded to Files (${r.files[0].fileStatus})`);
}

// 2. Menus: links to home page sections scroll smoothly in the theme
const MENUS = {
  'main-menu': {
    title: 'Main menu',
    items: [
      ['Collection', '/#collection'],
      ['Ritual', '/#ritual'],
      ['Origins', '/#origins'],
      ['FAQ', '/#faq']
    ]
  },
  footer: {
    title: 'Footer menu',
    items: [
      ['Cleanse · 4 Formulas', '/#collection'],
      ['Treat · 4 Formulas', '/#collection'],
      ['Hydrate · 4 Formulas', '/#collection'],
      ['Restore · 4 Formulas', '/#collection']
    ]
  }
};
const menus = gql('{ menus(first: 50) { nodes { id handle } } }').menus.nodes;
for (const [handle, m] of Object.entries(MENUS)) {
  const items = m.items.map(([title, url]) => ({ title, type: 'HTTP', url }));
  const existing = menus.find((x) => x.handle === handle);
  const r = existing
    ? gql('mutation ($id: ID!, $t: String!, $h: String!, $i: [MenuItemUpdateInput!]!) { menuUpdate(id: $id, title: $t, handle: $h, items: $i) { userErrors { field message } } }', { id: existing.id, t: m.title, h: handle, i: items }, { mutate: true }).menuUpdate
    : gql('mutation ($t: String!, $h: String!, $i: [MenuItemCreateInput!]!) { menuCreate(title: $t, handle: $h, items: $i) { userErrors { field message } } }', { t: m.title, h: handle, i: items }, { mutate: true }).menuCreate;
  if (r.userErrors.length) throw new Error(JSON.stringify(r.userErrors));
  console.log(`✓ menu ${handle}`);
}
