// Prepares a store for the Verenne theme (verenne-os) from src/data.js:
//   - writes the `verenne.details` metafield on every product (subtitle, texture, notes, 3D glass…)
//   - creates or updates the collections the home page uses: verenne-all plus one per category,
//     with products in catalogue order, published to the Online Store.
// Safe to re-run. Usage: node scripts/setup-store-content.mjs <store>.myshopify.com
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { admin, productDetails } from './shopify-admin.mjs';

const store = process.argv[2];
if (!store) throw new Error('Usage: node scripts/setup-store-content.mjs <store>.myshopify.com');
const gql = admin(store);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PRODUCTS, CATEGORIES } = await import(pathToFileURL(path.join(root, 'src', 'data.js')).href);

// Product ids by handle
const ids = {};
for (const p of PRODUCTS) {
  const r = gql('query ($h: String!) { productByIdentifier(identifier: { handle: $h }) { id } }', { h: p.id });
  if (!r.productByIdentifier) throw new Error(`Product ${p.id} is missing — run scripts/import-products.mjs first`);
  ids[p.id] = r.productByIdentifier.id;
}

// 1. Details metafields, in batches of 25
const metafields = PRODUCTS.map((p) => ({
  ownerId: ids[p.id],
  namespace: 'verenne',
  key: 'details',
  type: 'json',
  value: JSON.stringify(productDetails(p))
}));
for (let i = 0; i < metafields.length; i += 25) {
  const r = gql(
    'mutation ($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { metafields { id } userErrors { field message } } }',
    { m: metafields.slice(i, i + 25) },
    { mutate: true }
  ).metafieldsSet;
  if (r.userErrors.length) throw new Error(JSON.stringify(r.userErrors));
}
console.log(`✓ details metafield on ${metafields.length} products`);

// 2. Collections
const onlineStore = gql('{ publications(first: 20) { nodes { id name } } }').publications.nodes.find((x) => /online store/i.test(x.name));
for (const c of CATEGORIES) {
  const handle = `verenne-${c.id}`;
  const productIds = c.ids.map((h) => ids[h]).filter(Boolean);
  const existing = gql('query ($h: String!) { collectionByIdentifier(identifier: { handle: $h }) { id products(first: 100) { nodes { id } } } }', { h: handle }).collectionByIdentifier;
  let id = existing && existing.id;
  if (!id) {
    const r = gql(
      'mutation ($input: CollectionCreateInput!) { collectionCreate(collection: $input) { collection { id } userErrors { field message } } }',
      { input: { title: c.id === 'all' ? 'All formulations' : c.label, handle, sortOrder: 'MANUAL', descriptionHtml: `<p>${c.blurb}</p>` } },
      { mutate: true }
    ).collectionCreate;
    if (r.userErrors.length) throw new Error(JSON.stringify(r.userErrors));
    id = r.collection.id;
  }
  // Products are added separately; this API version doesn't take them at creation
  const have = existing ? existing.products.nodes.map((n) => n.id) : [];
  const missing = productIds.filter((x) => !have.includes(x));
  if (missing.length) {
    const r = gql('mutation ($id: ID!, $p: [ID!]!) { collectionAddProducts(id: $id, productIds: $p) { userErrors { message } } }', { id, p: missing }, { mutate: true }).collectionAddProducts;
    if (r.userErrors.length) throw new Error(JSON.stringify(r.userErrors));
  }
  // Keep catalogue order
  gql(
    'mutation ($id: ID!, $moves: [MoveInput!]!) { collectionReorderProducts(id: $id, moves: $moves) { userErrors { message } } }',
    { id, moves: productIds.map((p, i) => ({ id: p, newPosition: String(i) })) },
    { mutate: true }
  );
  if (onlineStore) gql('mutation ($id: ID!, $pub: ID!) { publishablePublish(id: $id, input: [{ publicationId: $pub }]) { userErrors { message } } }', { id, pub: onlineStore.id }, { mutate: true });
  console.log(`✓ collection ${handle} (${productIds.length} products)`);
}
