// Theme Store demo extras (recommended by Shopify for demo stores):
// a product on sale, a sold-out variant, a gift card product, journal articles, and Contact / About pages.
// Run after import-products, setup-store-content and setup-store-extras. Safe to re-run.
// Usage: node scripts/setup-demo-extras.mjs <store>.myshopify.com
import { admin } from './shopify-admin.mjs';

const store = process.argv[2];
if (!store) throw new Error('Usage: node scripts/setup-demo-extras.mjs <store>.myshopify.com');
const gql = admin(store);
const IMG = 'https://oluwapelum1.github.io/Verenne/products/';
const check = (r, label) => {
  const errs = r.userErrors || [];
  if (errs.length) throw new Error(`${label}: ${JSON.stringify(errs)}`);
  return r;
};

const product = (handle) =>
  gql('query ($h: String!) { productByIdentifier(identifier: { handle: $h }) { id variants(first: 10) { nodes { id title price inventoryItem { id } } } } }', { h: handle })
    .productByIdentifier;

// 1. On sale: Huile Soyeuse at its usual price, with a higher compare-at price
{
  const p = product('huile-soyeuse');
  const variants = p.variants.nodes.map((v) => ({ id: v.id, compareAtPrice: (Math.round(Number(v.price) * 1.25) - 0.01).toFixed(2) }));
  check(gql('mutation ($p: ID!, $v: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $p, variants: $v) { userErrors { field message } } }', { p: p.id, v: variants }, { mutate: true }).productVariantsBulkUpdate, 'sale');
  console.log('✓ Huile Soyeuse shown on sale');
}

// 2. Sold out: the larger Baume Contour Regard is tracked with no stock
{
  const p = product('baume-regard');
  const v = p.variants.nodes[p.variants.nodes.length - 1];
  check(gql('mutation ($p: ID!, $v: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $p, variants: $v) { userErrors { field message } } }', { p: p.id, v: [{ id: v.id, inventoryPolicy: 'DENY', inventoryItem: { tracked: true } }] }, { mutate: true }).productVariantsBulkUpdate, 'track');
  const location = gql('{ locations(first: 1) { nodes { id } } }').locations.nodes[0].id;
  // This API version compares against the current quantity instead of skipping the check
  const level = gql(
    'query ($i: ID!, $l: ID!) { inventoryItem(id: $i) { inventoryLevel(locationId: $l) { quantities(names: ["available"]) { quantity } } } }',
    { i: v.inventoryItem.id, l: location }
  ).inventoryItem.inventoryLevel;
  const current = level ? level.quantities[0].quantity : 0;
  if (current !== 0)
    check(
      gql(
        'mutation ($i: InventorySetQuantitiesInput!) { inventorySetQuantities(input: $i) { userErrors { field message } } }',
        { i: { name: 'available', reason: 'correction', quantities: [{ inventoryItemId: v.inventoryItem.id, locationId: location, quantity: 0, changeFromQuantity: current }] } },
        { mutate: true }
      ).inventorySetQuantities,
      'stock'
    );
  console.log(`✓ Baume Contour Regard ${v.title} sold out`);
}

// 3. Gift card (needs gift cards activated under Settings → Gift cards)
try {
  const r = gql(
    'mutation ($id: ProductSetIdentifiers, $input: ProductSetInput!) { productSet(identifier: $id, input: $input, synchronous: true) { product { id } userErrors { field message } } }',
    {
      id: { handle: 'verenne-gift-card' },
      input: {
        title: 'Verenne Gift Card',
        handle: 'verenne-gift-card',
        giftCard: true,
        vendor: 'Verenne',
        productType: 'Gift card',
        status: 'ACTIVE',
        descriptionHtml: '<p>A ritual of their choosing. Delivered by email and redeemable on every formulation, with no expiry.</p>',
        productOptions: [{ name: 'Value', values: ['50', '100', '150'].map((v) => ({ name: `$${v}` })) }],
        variants: ['50', '100', '150'].map((v) => ({ optionValues: [{ optionName: 'Value', name: `$${v}` }], price: `${v}.00` })),
        files: [{ originalSource: `${IMG}model_mist_dew.jpg`, contentType: 'IMAGE', alt: 'A face mist caught in morning light' }]
      }
    },
    { mutate: true }
  ).productSet;
  check(r, 'gift card');
  const pub = gql('{ publications(first: 20) { nodes { id name } } }').publications.nodes.find((x) => /online store/i.test(x.name));
  if (pub) gql('mutation ($id: ID!, $pub: ID!) { publishablePublish(id: $id, input: [{ publicationId: $pub }]) { userErrors { message } } }', { id: r.product.id, pub: pub.id }, { mutate: true });
  console.log('✓ gift card product');
} catch (err) {
  console.log('• gift card skipped: activate gift cards under Settings → Gift cards, then run this script again');
}

// 4. Journal
{
  const blogs = gql('{ blogs(first: 20) { nodes { id handle } } }').blogs.nodes;
  let blog = blogs.find((b) => b.handle === 'journal');
  if (!blog) blog = check(gql('mutation ($b: BlogCreateInput!) { blogCreate(blog: $b) { blog { id handle } userErrors { field message } } }', { b: { title: 'Journal', handle: 'journal' } }, { mutate: true }).blogCreate, 'blog').blog;
  const existing = gql('query ($q: String!) { articles(first: 20, query: $q) { nodes { handle } } }', { q: `blog_id:${blog.id.split('/').pop()}` }).articles.nodes.map((a) => a.handle);
  const ARTICLES = [
    {
      handle: 'the-immortelle-harvest',
      title: 'The immortelle harvest',
      tags: ['Origins', 'Corsica'],
      image: 'eclat-sauvage.jpg',
      body: `<p>Every July, before the heat settles on the Balagne hills, the immortelle is cut by hand. Its small golden heads never wilt after picking, which is how the plant earned its name, and it is also why we can afford to be patient with it.</p><p>We distil the flowers the same afternoon, in a copper still that sits a few kilometres from the field. The oil that comes over is a deep amber, warm and slightly honeyed, and it is the heart of Éclat Sauvage.</p><h2>Why the same growers every year</h2><p>The families who grow our immortelle agree a price with us before the season begins. That certainty lets them leave the plants to flower fully instead of cutting early, and it is the single biggest reason the oil is as rich as it is.</p><blockquote>Slow by design, because skin is too.</blockquote><p>Next month we will follow the blue tansy harvest in northern Morocco.</p>`
    },
    {
      handle: 'a-dawn-and-dusk-ritual',
      title: 'A dawn and dusk ritual',
      tags: ['Ritual'],
      image: 'model_oil_glow.jpg',
      body: `<p>Skin behaves differently in the morning and at night. In the morning it wants lightness and protection; at night it repairs, and can take richer textures.</p><h2>Dawn, in four minutes</h2><ol><li><strong>Cleanse</strong> with Argile Purifiante, massaged onto damp skin.</li><li><strong>Mist</strong> with Brume Botanique while the skin is still damp.</li><li><strong>Illuminate</strong> with three drops of Éclat Sauvage, pressed in.</li><li><strong>Veil</strong> with Crème Radieuse.</li></ol><h2>Dusk, in six</h2><p>Dissolve the day with Huile Soyeuse, quench with Essence Florale, renew with Sève Dorée, and seal with Baume Résineux. Nothing else is needed.</p>`
    }
  ];
  for (const a of ARTICLES) {
    if (existing.includes(a.handle)) continue;
    check(
      gql(
        'mutation ($a: ArticleCreateInput!) { articleCreate(article: $a) { article { id } userErrors { field message } } }',
        { a: { blogId: blog.id, title: a.title, handle: a.handle, body: a.body, tags: a.tags, author: { name: 'Maison Verenne' }, isPublished: true, image: { url: `${IMG}${a.image}`, altText: a.title } } },
        { mutate: true }
      ).articleCreate,
      'article'
    );
  }
  console.log('✓ journal with 2 articles');
}

// 5. Pages
{
  const PAGES = [
    { handle: 'contact', title: 'Contact', templateSuffix: 'contact', body: '<p>Our atelier is at 12 Rue de l’Oratoire in Grasse, open Monday to Saturday from 9:00 to 18:00. Write to us below about a formula, an order or your ritual.</p>' },
    { handle: 'our-atelier', title: 'Our atelier', body: '<p>Verenne is a small botanical skincare house in Grasse. We make sixteen formulations and nothing else.</p><h2>How we work</h2><p>Plants are picked by hand at dawn and distilled in copper within 72 hours. We buy from the same growers in Corsica, Morocco, the Horn of Africa and Grasse every year, at a price agreed before the season.</p><h2>What we leave out</h2><p>No synthetic fragrance, silicones, parabens, phthalates or artificial colour in any formula. Every bottle is dark glass, and every glass is recyclable.</p>' }
  ];
  const have = gql('{ pages(first: 50) { nodes { handle } } }').pages.nodes.map((p) => p.handle);
  for (const pg of PAGES) {
    if (have.includes(pg.handle)) continue;
    check(gql('mutation ($p: PageCreateInput!) { pageCreate(page: $p) { page { id } userErrors { field message } } }', { p: { ...pg, isPublished: true } }, { mutate: true }).pageCreate, 'page');
  }
  console.log('✓ Contact and Our atelier pages');
}
