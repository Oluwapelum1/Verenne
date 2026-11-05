const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
export const asset = (p) => `${BASE}${p.startsWith('/') ? p : `/${p}`}`;

/**
 * VERENNE — curated catalogue
 * Sixteen formulations, each backed by real photography (/public/products),
 * an on-skin portrait (/public/products/model_*.jpg) and a ritual film (/public/videos).
 */
export const PRODUCTS = [
  {
    id: 'eclat-sauvage',
    no: '01',
    name: 'Éclat Sauvage',
    fullName: 'N°01 Éclat Sauvage',
    category: 'Serum',
    moment: 'Dawn',
    subtitle: 'Active botanical serum',
    latin: 'Helichrysum stoechas',
    sizes: [
      { size: '30 ml', volume: '1.0 fl oz', price: 118 },
      { size: '50 ml', volume: '1.7 fl oz', price: 168 }
    ],
    price: 118,
    rating: 4.9,
    reviewsCount: 142,
    tint: '#C8782A',
    glow: '#F2A65A',
    glass: { shape: 'dropper', color: '#7A3F12', liquid: '#E08A2E' },
    image: asset('/products/eclat-sauvage'),
    portrait: asset('/products/model_oil_glow.jpg'),
    texture: 'Weightless golden micro-oil',
    notes: ['Immortelle', 'Neroli', 'Cedar'],
    keyIngredients: ['Corsican Helichrysum', 'Rosehip seed', 'Sea buckthorn', 'Olive squalane'],
    benefits: ['Replenishes the lipid barrier', 'Lit-from-within radiance', 'Antioxidant support'],
    howToUse: 'Warm 3–4 drops between palms, breathe in, then press upward into damp skin.',
    ph: '5.2 (Skin-neutral)',
    bioactivePct: '99.4%',
    absorptionSeconds: 14,
    finish: 'Lit-from-within satin',
    concerns: ['Dryness', 'Dullness', 'Barrier fatigue'],
    synergy: {
      pairId: 'brume-botanique',
      label: 'The Hydra-Lipid Protocol',
      benefit: 'Press into damp skin so the oil spreads more easily'
    },
    description:
      'Eighteen cold-pressed seeds and wild everlasting flower, folded into a single golden drop. Sinks in like sunlight on warm stone.'
  },
  {
    id: 'baume-resineux',
    no: '02',
    name: 'Baume Résineux',
    fullName: 'N°02 Baume Résineux',
    category: 'Balm',
    moment: 'Night',
    subtitle: 'Frankincense & ceramide salve',
    latin: 'Boswellia carterii',
    sizes: [
      { size: '50 ml', volume: '1.7 oz', price: 94 },
      { size: '100 ml', volume: '3.4 oz', price: 148 }
    ],
    price: 94,
    rating: 4.9,
    reviewsCount: 119,
    tint: '#CDB68A',
    glow: '#E9D3A4',
    glass: { shape: 'jar', color: '#D9D2C3', liquid: '#F1E2BE' },
    image: asset('/products/baume-resineux'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Whipped balm that melts to satin',
    notes: ['Frankincense', 'Oat', 'Honey'],
    keyIngredients: ['Somali frankincense', 'Oat beta-glucan', 'Plant ceramides', 'Cupuaçu butter'],
    benefits: ['Cushions dry, wind-worn skin', 'Seals in moisture overnight', 'Calms tightness'],
    howToUse: 'Warm a pearl between fingertips until molten. Press onto cheekbones, lips and dry patches.',
    ph: '5.5 (Acid mantle)',
    bioactivePct: '98.8%',
    absorptionSeconds: 40,
    finish: 'Cashmere moisture glove',
    concerns: ['Compromised barrier', 'Chapping', 'Extreme cold'],
    synergy: {
      pairId: 'seve-doree',
      label: 'The Nocturnal Barrier Cocoon',
      benefit: 'Locks in overnight Bakuchiol cell recovery without moisture loss'
    },
    description:
      'A velvet soufflé of sacred resin and five plant ceramides. Built for cold air, long flights and the last step of the night.'
  },
  {
    id: 'brume-botanique',
    no: '03',
    name: 'Brume Botanique',
    fullName: 'N°03 Brume Botanique',
    category: 'Mist',
    moment: 'Day',
    subtitle: 'Neroli & damask rose hydrosol',
    latin: 'Citrus aurantium',
    sizes: [
      { size: '100 ml', volume: '3.4 fl oz', price: 68 },
      { size: '200 ml', volume: '6.8 fl oz', price: 112 }
    ],
    price: 68,
    rating: 4.8,
    reviewsCount: 84,
    tint: '#E3B98F',
    glow: '#F5D2AE',
    glass: { shape: 'mist', color: '#E9DCCB', liquid: '#F7E6D0' },
    image: asset('/products/brume-botanique'),
    portrait: asset('/products/model_mist_dew.jpg'),
    texture: 'Crystalline micro-dew',
    notes: ['Orange blossom', 'Damask rose', 'Birch sap'],
    keyIngredients: ['Neroli hydrosol', 'Damask rose distillate', 'Snow tremella', 'Birch sap'],
    benefits: ['Instant dewy quench', 'Balances skin after cleansing', 'Preps skin for oils'],
    howToUse: 'Mist over face after cleansing. Keep in the fridge for an icy wake-up.',
    ph: '5.0 (Optimal post-cleanse)',
    bioactivePct: '100% (Single-still)',
    absorptionSeconds: 6,
    finish: 'Poreless dewy quench',
    concerns: ['Dehydration', 'Tightness', 'Surface dullness'],
    synergy: {
      pairId: 'eclat-sauvage',
      label: 'The Living Dew Matrix',
      benefit: 'Dampens skin first so the serum spreads evenly'
    },
    description:
      'Copper-still distilled orange blossom and heritage roses with fermented birch sap. A cloud of morning garden, on demand.'
  },
  {
    id: 'seve-doree',
    no: '04',
    name: 'Sève Dorée',
    fullName: 'N°04 Sève Dorée',
    category: 'Night Oil',
    moment: 'Night',
    subtitle: 'Overnight renewal elixir',
    latin: 'Tanacetum annuum',
    sizes: [
      { size: '30 ml', volume: '1.0 fl oz', price: 135 },
      { size: '50 ml', volume: '1.7 fl oz', price: 185 }
    ],
    price: 135,
    rating: 5.0,
    reviewsCount: 98,
    tint: '#7B5CC4',
    glow: '#E7B356',
    glass: { shape: 'dropper', color: '#2A1652', liquid: '#E4A63A' },
    image: asset('/products/seve-doree'),
    portrait: asset('/products/model_serum_shower.jpg'),
    texture: 'Silky indigo dry oil',
    notes: ['Blue tansy', 'Geranium', 'Vetiver'],
    keyIngredients: ['Moroccan blue tansy', 'Bakuchiol', 'Alpine edelweiss', 'Evening primrose'],
    benefits: ['Smoother texture by morning', 'Calms visible redness', 'Gentle retinol alternative'],
    howToUse: 'Press 4 drops over face as the final step of your evening ritual.',
    ph: '5.4',
    bioactivePct: '99.1%',
    absorptionSeconds: 22,
    finish: 'Cashmere-soft matte velvet',
    concerns: ['Redness & reactivity', 'Micro-texture', 'Overnight renewal'],
    synergy: {
      pairId: 'baume-resineux',
      label: 'The Nocturnal Shield Duo',
      benefit: 'Seals in moisture overnight'
    },
    description:
      'Blue tansy, edelweiss and bakuchiol in violet glass. Works quietly while you sleep, and is gone by the time you wake.'
  },
  {
    id: 'argile-purifiante',
    no: '05',
    name: 'Argile Purifiante',
    fullName: 'N°05 Argile Purifiante',
    category: 'Cleanser',
    moment: 'Dawn',
    subtitle: 'Botanical clay cleanser',
    latin: 'Montmorillonite',
    sizes: [{ size: '75 ml', volume: '2.5 fl oz', price: 58 }],
    price: 58,
    rating: 4.9,
    reviewsCount: 62,
    tint: '#A89A84',
    glow: '#D6C6A8',
    glass: { shape: 'tube', color: '#CFC3AE', liquid: '#CFC3AE' },
    image: asset('/products/argile-purifiante'),
    portrait: asset('/products/model_argile_mask.jpg'),
    texture: 'Supple mineral paste',
    notes: ['Rosemary', 'Pine', 'Sea air'],
    keyIngredients: ['French green clay', 'Spirulina', 'Pine bark', 'Rosemary CO₂'],
    benefits: ['Lifts the day from pores', 'Never tight or squeaky', 'Doubles as a 5-min mask'],
    howToUse: 'Massage onto damp skin, rinse. As a mask, leave 5 minutes before it dries.',
    ph: '5.8 (Non-stripping)',
    bioactivePct: '96.5%',
    absorptionSeconds: 30,
    finish: 'Silky clarified suppleness',
    concerns: ['Congested pores', 'Environmental residue', 'T-zone balance'],
    synergy: {
      pairId: 'brume-botanique',
      label: 'The Clarifying Flush',
      benefit: 'Instantly resets acidic mantle after gentle mineral clay cleansing'
    },
    description:
      'Sun-dried clay and wild spirulina whipped into a cleanser that clarifies without stripping. Smells like a pine forest after rain.'
  },
  {
    id: 'creme-radieuse',
    no: '06',
    name: 'Crème Radieuse',
    fullName: 'N°06 Crème Radieuse',
    category: 'Moisturiser',
    moment: 'Day',
    subtitle: 'Daily moisture lotion',
    latin: 'Tremella fuciformis',
    sizes: [
      { size: '50 ml', volume: '1.7 fl oz', price: 92 },
      { size: '100 ml', volume: '3.4 fl oz', price: 145 }
    ],
    price: 92,
    rating: 4.9,
    reviewsCount: 89,
    tint: '#E6DCC6',
    glow: '#F4EAD2',
    glass: { shape: 'pump', color: '#EDE6D6', liquid: '#F3EBDA' },
    image: asset('/products/creme-radieuse'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Cloud-light lotion',
    notes: ['Black tea', 'Fig leaf', 'Musk'],
    keyIngredients: ['Snow mushroom', 'Kombucha ferment', 'Centella', 'Jojoba esters'],
    benefits: ['All-day bouncy hydration', 'Supports the skin microbiome', 'Soft, velvet finish'],
    howToUse: 'Smooth 1–2 pumps over face and neck, morning and evening.',
    ph: '5.3 (Biome equilibrium)',
    bioactivePct: '97.6%',
    absorptionSeconds: 18,
    finish: 'Cashmere cloud cushion',
    concerns: ['Barrier maintenance', 'Loss of elasticity', 'Microbiome balance'],
    synergy: {
      pairId: 'eclat-sauvage',
      label: 'The Plump & Glow Veil',
      benefit: 'Emulsifies into a custom velvet nectar before applying sunscreen'
    },
    description:
      'Snow mushroom and black-tea ferment in a lotion so light it feels like breath. The everyday constant of the collection.'
  },
  {
    id: 'lait-nectar',
    no: '07',
    name: 'Lait Nectar Démaquillant',
    fullName: 'N°07 Lait Nectar Démaquillant',
    category: 'Cleanser',
    moment: 'Night',
    subtitle: 'Alpine squalane & immortelle cleansing milk',
    latin: 'Helichrysum & Squalane',
    sizes: [
      { size: '150 ml', volume: '5.1 fl oz', price: 64 },
      { size: '250 ml', volume: '8.5 fl oz', price: 96 }
    ],
    price: 64,
    rating: 4.9,
    reviewsCount: 78,
    tint: '#D4B996',
    glow: '#F3DFC1',
    glass: { shape: 'pump', color: '#EDE3D1', liquid: '#F7EDDE' },
    image: asset('/products/lait-nectar'),
    portrait: asset('/products/model_lait_cleanse.jpg'),
    texture: 'Silk emulsion melting into botanical milk',
    notes: ['Immortelle', 'Almond blossom', 'White tea'],
    keyIngredients: ['Corsican immortelle', 'Olive squalane', 'Marshmallow root', 'Sweet almond milk'],
    benefits: ['Dissolves mineral sunscreen & waterproof pigments', 'Preserves natural lipid mantle', 'Leaves skin cushion-soft without residue'],
    howToUse: 'Massage 2–3 pumps across dry face and closed eyes. Add warm water to emulsify into a milky veil, then rinse.',
    ph: '5.5 (Acid-mantle match)',
    bioactivePct: '98.2%',
    absorptionSeconds: 20,
    finish: 'Supple velvet cashmere',
    concerns: ['Barrier fragility', 'Daily pollution', 'Waterproof sunscreen removal'],
    synergy: {
      pairId: 'brume-botanique',
      label: 'The Double Cloud Cleansing Ritual',
      benefit: 'Holds in moisture straight after rinsing'
    },
    description:
      'A cushiony botanical milk that dissolves the urban day without disrupting the delicate microbiome. Skin feels rinsed clean, yet deeply cushioned.'
  },
  {
    id: 'gel-glaciaire',
    no: '08',
    name: 'Gelée Glaciaire',
    fullName: 'N°08 Gelée Glaciaire',
    category: 'Cleanser',
    moment: 'Dawn',
    subtitle: 'Glacial salicylic & wild rosemary clarifier',
    latin: 'Salix alba & Rosmarinus',
    sizes: [
      { size: '120 ml', volume: '4.0 fl oz', price: 56 },
      { size: '200 ml', volume: '6.8 fl oz', price: 84 }
    ],
    price: 56,
    rating: 4.8,
    reviewsCount: 92,
    tint: '#789E8C',
    glow: '#A8D4BF',
    glass: { shape: 'tube', color: '#B6D6C6', liquid: '#CEE8DC' },
    image: asset('/products/gel-glaciaire'),
    portrait: asset('/products/model_argile_mask.jpg'),
    texture: 'Cooling glacial micro-jelly',
    notes: ['Wild rosemary', 'Alpine mint', 'Glacial air'],
    keyIngredients: ['Wild willow bark BHA', 'Swiss glacier water', 'Alpine rosemary CO₂', 'Zinc PCA'],
    benefits: ['Purifies pores without tightness', 'Cools redness on contact', 'Balances excess sebum throughout the day'],
    howToUse: 'Lather a nickel-sized amount with cool water between palms, massage across skin for 30 seconds, then rinse.',
    ph: '5.2 (Pore-clarifying)',
    bioactivePct: '97.4%',
    absorptionSeconds: 15,
    finish: 'Matte crystal freshness',
    concerns: ['Congested pores', 'Excess sebum', 'Micro-blemishes'],
    synergy: {
      pairId: 'brume-botanique',
      label: 'The Alpine Purity Flush',
      benefit: 'Tightens refined pores while reintroducing flora hydration'
    },
    description:
      'Infused with high-altitude Swiss glacier mineral water and natural willow bark, this cooling jelly purifies congested pores with zero stripping.'
  },
  {
    id: 'huile-soyeuse',
    no: '09',
    name: 'Huile Soyeuse Purifiante',
    fullName: 'N°09 Huile Soyeuse Purifiante',
    category: 'Cleanser',
    moment: 'Night',
    subtitle: 'Golden camellia & bergamot cleansing oil',
    latin: 'Camellia japonica',
    sizes: [
      { size: '100 ml', volume: '3.4 fl oz', price: 72 },
      { size: '200 ml', volume: '6.8 fl oz', price: 118 }
    ],
    price: 72,
    rating: 4.9,
    reviewsCount: 104,
    tint: '#D99B43',
    glow: '#F6C174',
    glass: { shape: 'pump', color: '#E8B96E', liquid: '#F8CE8B' },
    image: asset('/products/huile-soyeuse'),
    portrait: asset('/products/model_oil_glow.jpg'),
    texture: 'Golden satin oil that rinses completely sheer',
    notes: ['Japanese camellia', 'Bergamot peel', 'Cedar resin'],
    keyIngredients: ['Cold-pressed camellia seed', 'Castor polyglycerides', 'Bergamot FCF', 'Vitamin E tocopherol'],
    benefits: ['Effortlessly melts heavy makeup & SPF', 'Rinses completely clean without residue', 'Softens hardened sebum in pores'],
    howToUse: 'Warm 2–3 pumps on dry hands and massage slowly into dry skin. Add a splash of water to flash into milk, then splash rinse.',
    ph: 'Self-adjusting anhydrous',
    bioactivePct: '100%',
    absorptionSeconds: 25,
    finish: 'Silky petal smoothness',
    concerns: ['Heavy SPF removal', 'Deep sebum plugs', 'Dull winter skin'],
    synergy: {
      pairId: 'argile-purifiante',
      label: 'The Master Double-Cleanse Method',
      benefit: 'Dissolves lipophilic impurities before deep mineral detoxification'
    },
    description:
      'Harvested from wild camellia seeds, this golden elixir attracts and dissolves hardened sebum and heavy sunscreens, rinsing off completely clean without a cloth.'
  },
  {
    id: 'resurfacing-nectar',
    no: '10',
    name: 'Nectar Resurfaçant',
    fullName: 'N°10 Nectar Resurfaçant',
    category: 'Treat',
    moment: 'Night',
    subtitle: 'Fermented AHA & hibiscus flower peeling',
    latin: 'Hibiscus sabdariffa',
    sizes: [
      { size: '30 ml', volume: '1.0 fl oz', price: 124 },
      { size: '50 ml', volume: '1.7 fl oz', price: 174 }
    ],
    price: 124,
    rating: 4.9,
    reviewsCount: 115,
    tint: '#B84A62',
    glow: '#E27B91',
    glass: { shape: 'dropper', color: '#822338', liquid: '#B84A62' },
    image: asset('/products/resurfacing-nectar'),
    portrait: asset('/products/model_serum_shower.jpg'),
    texture: 'Luminescent ruby nectar fluid',
    notes: ['Wild hibiscus', 'Blood orange', 'Pink pepper'],
    keyIngredients: ['Fermented hibiscus flower acids', 'Lactic acid 8%', 'Pomegranate enzymes', 'Snow mushroom'],
    benefits: ['Gently clears dead skin buildup', 'Reveals glass-like surface luminosity', 'Smoothes textural irregularities overnight'],
    howToUse: 'Dispense 3–4 drops onto fingertips at twilight. Press into clean skin before oils. Use 3 nights per week.',
    ph: '3.8 (Precision bio-exfoliation)',
    bioactivePct: '98.7%',
    absorptionSeconds: 12,
    finish: 'Smooth, glassy',
    concerns: ['Textural roughness', 'Hyperpigmentation', 'Tired-looking skin'],
    synergy: {
      pairId: 'seve-doree',
      label: 'The Nocturnal Renewal Cascade',
      benefit: 'Accelerates cell turnover while soothing newly resurfaced skin'
    },
    description:
      'Ruby hibiscus petals cold-fermented with lactic acid and pomegranate enzymes. Gently unglues dull surface keratin for an unmistakable glass-skin morning reveal.'
  },
  {
    id: 'cuivre-peptides',
    no: '11',
    name: 'Élixir Cuivré Peptides',
    fullName: 'N°11 Élixir Cuivré Peptides',
    category: 'Treat',
    moment: 'Dawn',
    subtitle: 'Copper tripeptide-1 & marine chlorella',
    latin: 'GHK-Cu & Chlorella vulgaris',
    sizes: [
      { size: '30 ml', volume: '1.0 fl oz', price: 148 },
      { size: '50 ml', volume: '1.7 fl oz', price: 198 }
    ],
    price: 148,
    rating: 5.0,
    reviewsCount: 134,
    tint: '#2B7FA8',
    glow: '#56B3DF',
    glass: { shape: 'dropper', color: '#14465F', liquid: '#2B7FA8' },
    image: asset('/products/cuivre-peptides'),
    portrait: asset('/products/model_serum_shower.jpg'),
    texture: 'Blue peptide concentrate',
    notes: ['Marine salt', 'Crushed leaves', 'Ozone'],
    keyIngredients: ['GHK-Cu Copper Tripeptide-1 (2%)', 'Micro-algae chlorella', 'Palmitoyl Tripeptide-38', 'Botanical hyaluronic acid'],
    benefits: ['Helps skin feel firmer', 'Supports elasticity', 'Refreshes tired-looking skin'],
    howToUse: 'Apply 3 drops morning and evening directly after cleansing or misting. Pat gently until absorbed.',
    ph: '5.8 (Peptide stability window)',
    bioactivePct: '99.5%',
    absorptionSeconds: 16,
    finish: 'High-density firming bounce',
    concerns: ['Loss of firmness', 'Sagging skin', 'Deep expression contours'],
    synergy: {
      pairId: 'creme-radieuse',
      label: 'The Architectural Matrix Infusion',
      benefit: 'Seals active peptide chains beneath a biome-supportive lipid veil'
    },
    description:
      'A sapphire-toned serum with 2% copper peptide, made to help skin feel firmer and more elastic.'
  },
  {
    id: 'essence-fleurie',
    no: '12',
    name: 'Essence Florale Cellulaire',
    fullName: 'N°12 Essence Florale Cellulaire',
    category: 'Hydrate',
    moment: 'Dawn',
    subtitle: 'Fermented birch sap & tremella nectar',
    latin: 'Betula alba & Tremella',
    sizes: [
      { size: '100 ml', volume: '3.4 fl oz', price: 78 },
      { size: '200 ml', volume: '6.8 fl oz', price: 126 }
    ],
    price: 78,
    rating: 4.9,
    reviewsCount: 86,
    tint: '#C4A872',
    glow: '#EED9A6',
    glass: { shape: 'mist', color: '#E0D0AE', liquid: '#F5E8C9' },
    image: asset('/products/essence-fleurie'),
    portrait: asset('/products/model_mist_dew.jpg'),
    texture: 'Silky micro-viscous hydration nectar',
    notes: ['Linden blossom', 'Green tea', 'Silver birch'],
    keyIngredients: ['Fermented birch sap', 'Tremella mushroom poly-saccharides', 'Linden flower distillate', 'Ectoin 1%'],
    benefits: ['Hydrates skin as soon as it goes on', 'Protects against environmental dehydration shock', 'Prepares skin for the serum that follows'],
    howToUse: 'Pour a generous splash into palms and pat firmly into face and neck until skin feels springy and quenched.',
    ph: '5.1',
    bioactivePct: '99.2%',
    absorptionSeconds: 10,
    finish: 'Deeply saturated plump quench',
    concerns: ['Chronic dehydration', 'Moisture loss', 'Air-conditioning dryness'],
    synergy: {
      pairId: 'eclat-sauvage',
      label: 'The Aqua-Lipidic Infusion',
      benefit: 'Blends easily with oils on skin'
    },
    description:
      'Tapped directly from spring birch groves in Scandinavia and blended with fermented tremella mushrooms. Delivers a profound wave of moisture that stays locked inside cells.'
  },
  {
    id: 'voile-hydratant',
    no: '13',
    name: 'Voile Solaire Botanique SPF 50+',
    fullName: 'N°13 Voile Solaire Botanique SPF 50+',
    category: 'Hydrate',
    moment: 'Day',
    subtitle: 'Weightless mineral fluid & alpine edelweiss',
    latin: 'Leontopodium alpinum',
    sizes: [
      { size: '50 ml', volume: '1.7 fl oz', price: 82 },
      { size: '100 ml', volume: '3.4 fl oz', price: 132 }
    ],
    price: 82,
    rating: 4.9,
    reviewsCount: 110,
    tint: '#E8D2A7',
    glow: '#F6E6C7',
    glass: { shape: 'pump', color: '#F1E7D5', liquid: '#FDF7EB' },
    image: asset('/products/voile-hydratant'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Featherlight non-greasy milk that leaves zero white cast',
    notes: ['Edelweiss blossom', 'Solar neroli', 'White cedar'],
    keyIngredients: ['Non-nano Zinc Oxide 18%', 'Alpine Edelweiss extract', 'Karanja oil', 'Maritime pine bark'],
    benefits: ['Full spectrum UVA/UVB & HEV blue light protection', 'Antioxidant defense against urban ozone', 'Invisible satin finish on all skin tones'],
    howToUse: 'Apply 2 generous pumps every morning as the final step of your skincare ritual before makeup or outdoors.',
    ph: '5.6 (Skin-harmonious)',
    bioactivePct: '96.8%',
    absorptionSeconds: 14,
    finish: 'Satin velvet daylight shield',
    concerns: ['Photo-aging', 'UV hyperpigmentation', 'Environmental oxidative stress'],
    synergy: {
      pairId: 'creme-radieuse',
      label: 'The Photoprotective Daylight Barrier',
      benefit: 'Pairs with your daily SPF step in the morning'
    },
    description:
      'An ultra-fluid mineral sun veil that melts invisibly into all complexions. High-altitude alpine edelweiss defends against free radicals while non-nano zinc shields skin all day.'
  },
  {
    id: 'cire-nocturne',
    no: '14',
    name: 'Cire Réparatrice Nocturne',
    fullName: 'N°14 Cire Réparatrice Nocturne',
    category: 'Restore',
    moment: 'Night',
    subtitle: 'Raw propolis & phytosterol sleeping cocoon',
    latin: 'Propolis cera & Butyrospermum',
    sizes: [
      { size: '50 ml', volume: '1.7 oz', price: 112 },
      { size: '100 ml', volume: '3.4 oz', price: 168 }
    ],
    price: 112,
    rating: 5.0,
    reviewsCount: 65,
    tint: '#BD8746',
    glow: '#EBB474',
    glass: { shape: 'jar', color: '#774C1E', liquid: '#B87A31' },
    image: asset('/products/cire-nocturne'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Rich molten wax butter that wraps the skin in comfort',
    notes: ['Wild honeycomb', 'Benzoin tears', 'Myrrh'],
    keyIngredients: ['Artisanal raw propolis', 'Avocado phytosterols', 'Murumuru butter', 'Helichrysum CO₂'],
    benefits: ['Rebuilds cracked epidermal lipid barriers', 'Seals wounded wind-chapped skin overnight', 'Comforts a stressed skin barrier'],
    howToUse: 'Warm a dime-sized amount between clean palms until clear. Gently press into dry, sensitive, or compromised zones before sleep.',
    ph: 'Waterless anhydrous balm',
    bioactivePct: '100%',
    absorptionSeconds: 45,
    finish: 'Cocooning honey velvet shield',
    concerns: ['Compromised barrier', 'Severe dry flaking', 'Post-procedure sensitivity'],
    synergy: {
      pairId: 'baume-resineux',
      label: 'The Intensive Recovery Cocoon',
      benefit: 'Adds a protective layer over dry, irritated skin'
    },
    description:
      'Harvested sustainably from ancient Corsican beehives and blended with concentrated phytosterols. Heals windburn, flaking and compromised skin overnight with zero irritation.'
  },
  {
    id: 'baume-regard',
    no: '15',
    name: 'Baume Contour Regard',
    fullName: 'N°15 Baume Contour Regard',
    category: 'Restore',
    moment: 'Night',
    subtitle: 'Wild arnica & bio-ceramide eye melt',
    latin: 'Arnica montana & Coffea',
    sizes: [
      { size: '15 ml', volume: '0.5 fl oz', price: 88 },
      { size: '30 ml', volume: '1.0 fl oz', price: 138 }
    ],
    price: 88,
    rating: 4.9,
    reviewsCount: 89,
    tint: '#B8A484',
    glow: '#DFCBB0',
    glass: { shape: 'jar', color: '#8F7F67', liquid: '#D2C1A8' },
    image: asset('/products/baume-regard'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Cooling whipped butter melting on orbital contact',
    notes: ['Elderflower', 'Green coffee', 'Roman chamomile'],
    keyIngredients: ['Wild Alpine arnica', 'Green coffee supercritical extract', 'Ceramide NP & AP', 'Eyebright extract'],
    benefits: ['De-puffs under-eye stagnation', 'Fades dark vascular circles', 'Fills fine micro-creases with lipid moisture'],
    howToUse: 'Using your ring finger, tap a tiny rice-grain amount along the orbital bone from inner to outer corner.',
    ph: '6.5 (Ophthalmic-grade neutral)',
    bioactivePct: '98.9%',
    absorptionSeconds: 22,
    finish: 'Luminous rested satin',
    concerns: ['Under-eye circles', 'Morning puffiness', 'Periorbital fine lines'],
    synergy: {
      pairId: 'seve-doree',
      label: 'The Complete Eye & Face Restorative',
      benefit: 'Pairs a night treatment with gentle eye care'
    },
    description:
      'Formulated specifically for the delicate 0.5mm skin around the eye. Wild arnica stimulates lymphatic drainage while bio-ceramides plump fine expression lines.'
  },
  {
    id: 'onguent-protecteur',
    no: '16',
    name: 'Onguent Barrière Extrême',
    fullName: 'N°16 Onguent Barrière Extrême',
    category: 'Restore',
    moment: 'Day',
    subtitle: 'Centella asiatica & cupuaçu cold-recovery balm',
    latin: 'Centella asiatica',
    sizes: [
      { size: '50 ml', volume: '1.7 fl oz', price: 96 },
      { size: '100 ml', volume: '3.4 fl oz', price: 148 }
    ],
    price: 96,
    rating: 5.0,
    reviewsCount: 74,
    tint: '#A3927B',
    glow: '#D2C4B1',
    glass: { shape: 'jar', color: '#6A5E50', liquid: '#B4A593' },
    image: asset('/products/onguent-protecteur'),
    portrait: asset('/products/model_cream_massage.jpg'),
    texture: 'Protective lipidic ointment with zero tackiness',
    notes: ['Gotu kola', 'Cistus ladanifer', 'St John’s wort'],
    keyIngredients: ['Centella Asiatica (Madecassoside 95%)', 'Cupuaçu seed butter', 'Evening primrose oil', 'Colloidal oat'],
    benefits: ['Instant relief from stinging and barrier burning', 'Locks moisture against sub-zero alpine conditions', 'Accelerates tissue re-epithelialization'],
    howToUse: 'Smooth generously over wind-whipped cheeks, cracked cuticles, or areas experiencing severe weather distress.',
    ph: '5.4 (Physiological barrier shield)',
    bioactivePct: '99.1%',
    absorptionSeconds: 35,
    finish: 'Silky protective glove',
    concerns: ['Extreme weather exposure', 'Post-sun/wind irritation', 'Acute redness flare-ups'],
    synergy: {
      pairId: 'baume-resineux',
      label: 'The Ultimate Alpine Defense Ritual',
      benefit: 'Forms a resilient dual-layer barrier against cold, wind and dry altitude air'
    },
    description:
      'Designed for extreme altitudes and punishing winds. 95% pure madecassoside calm acute irritation while Amazonian cupuaçu butter holds 440% its weight in water.'
  }
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

/** Shopping categories — 4 distinct categories, each with at least 4 iconic formulations */
export const CATEGORIES = [
  {
    id: 'all',
    label: 'All Formulations',
    title: 'All 16 formulations',
    blurb: 'Four steps, four formulas each. Pick a step or browse them all.',
    ids: PRODUCTS.map((p) => p.id)
  },
  {
    id: 'cleanse',
    label: 'Cleanse',
    title: 'Purify & Clarify',
    blurb: 'Remove impurities and sunscreen without stripping your skin.',
    ids: ['argile-purifiante', 'lait-nectar', 'gel-glaciaire', 'huile-soyeuse']
  },
  {
    id: 'treat',
    label: 'Treat',
    title: 'Targeted treatments',
    blurb: 'Concentrated serums, peptides and overnight treatments.',
    ids: ['eclat-sauvage', 'seve-doree', 'resurfacing-nectar', 'cuivre-peptides']
  },
  {
    id: 'hydrate',
    label: 'Hydrate',
    title: 'Hydration Veils',
    blurb: 'Mists, lotions and a weightless daily SPF.',
    ids: ['brume-botanique', 'creme-radieuse', 'essence-fleurie', 'voile-hydratant']
  },
  {
    id: 'restore',
    label: 'Restore',
    title: 'Barrier Cocoon',
    blurb: 'Rich balms, night butters and eye care.',
    ids: ['baume-resineux', 'cire-nocturne', 'baume-regard', 'onguent-protecteur']
  }
];

export const categoryOf = (id) => CATEGORIES.find((c) => c.id !== 'all' && c.ids.includes(id));

export const BOTANICALS = [
  {
    latin: 'Helichrysum stoechas',
    common: 'Immortelle',
    origin: 'Corsica',
    coords: '42°09′N 9°05′E',
    harvest: 'July, by hand at dawn',
    story: 'Its golden heads never wither after picking. We distil them the same afternoon, on the island.',
    color: '#E3A13B'
  },
  {
    latin: 'Tanacetum annuum',
    common: 'Blue Tansy',
    origin: 'Northern Morocco',
    coords: '35°10′N 5°16′W',
    harvest: 'Late summer',
    story: 'Steam turns its oil a startling indigo — a sign of chamazulene, the compound skin finds so calming.',
    color: '#5B7BD6'
  },
  {
    latin: 'Boswellia carterii',
    common: 'Frankincense',
    origin: 'Horn of Africa',
    coords: '10°26′N 45°02′E',
    harvest: 'Resin tears, dry season',
    story: 'Gathered by cooperatives who have tapped the same trees for generations. Fair price, set in advance.',
    color: '#D9B77E'
  },
  {
    latin: 'Citrus aurantium',
    common: 'Bitter Orange Blossom',
    origin: 'Grasse, France',
    coords: '43°39′N 6°55′E',
    harvest: 'Two weeks in May',
    story: 'One tonne of blossom gives one litre of hydrosol. Distilled in copper within hours of picking.',
    color: '#F1D3B0'
  }
];

export const RITUAL = {
  dawn: [
    { id: 'argile-purifiante', verb: 'Cleanse', time: '07:00' },
    { id: 'brume-botanique', verb: 'Mist', time: '07:02' },
    { id: 'eclat-sauvage', verb: 'Illuminate', time: '07:03' },
    { id: 'creme-radieuse', verb: 'Veil', time: '07:05' }
  ],
  dusk: [
    { id: 'huile-soyeuse', verb: 'Dissolve', time: '22:00' },
    { id: 'essence-fleurie', verb: 'Quench', time: '22:02' },
    { id: 'seve-doree', verb: 'Renew', time: '22:04' },
    { id: 'baume-resineux', verb: 'Seal', time: '22:06' }
  ]
};

export const PRESS = [
  {
    quote: 'Éclat Sauvage replaced three steps in my routine. My skin has never looked calmer.',
    author: 'Elena R.',
    role: 'Customer, Zürich'
  },
  {
    quote: 'The first balm that actually survived a Swiss winter on my face.',
    author: 'Mara K.',
    role: 'Customer, Geneva'
  }
];

export const FAQS = [
  {
    q: 'Are Verenne formulas suitable for sensitive skin?',
    a: 'Every formula is fragrance-free of synthetic perfume and patch-tested. Sève Dorée and Baume Résineux were designed with reactive skin in mind. As with any new product, patch test first.'
  },
  {
    q: 'How long does a bottle last?',
    a: 'Used daily, a 30 ml serum lasts roughly 10–12 weeks. Mist and lotion around 8 weeks. Balm, a full season.'
  },
  {
    q: 'Do you ship worldwide?',
    a: 'Yes — carbon-neutral delivery to 40+ countries. Free on orders over $150.'
  },
  {
    q: 'Can I return an opened product?',
    a: 'Within 30 days, opened or not. We would rather you find the right ritual than keep the wrong one.'
  }
];
