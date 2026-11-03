# VERENNE Video Pipeline & Shot List Specification

**Brand**: VERENNE ("veh-lee-neen")  
**Product**: Luxury Organic Skincare Storefront  
**Asset Scope**: 12 Micro-Clips (3–5 seconds, seamless 60fps loops)  
**Deliverable Format**: WebM (VP9) + MP4 (H.265/AV1), 900x900px, 3.5s duration, $\le 1.8\text{ MB}$ target per clip.  
**Pipeline**: Blender 4.2 Cycles (Physical Raytracing) / AI Video Generation (Runway Gen-3 Alpha, Luma Dream Machine, Kling AI).

---

## Technical Lighting & Camera Standards (Universal)
- **Aspect Ratio**: 1:1 Square (900 x 900 px) & 4:5 Vertical (1080 x 1350 px).
- **Lighting Temperature**: Key light 5400K daylight, rim light 2800K champagne gold (`#E5C396`), bounce fill on frosted glass.
- **Color Grading**: Film stock Kodak 5207, Lifted shadows (`#0A0C09`), zero burnt highlights.
- **Camera Lens**: 85mm Macro, f/2.8, shallow depth of field with creamy circular bokeh.

---

## The 12 Product Video Shot List

---

### Specimen 01: N°01 Éclat Sauvage (Active Treatment Serum)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Slow descending orbital dolly (45° $\rightarrow$ 30°), focusing on amber pipette tip.
- **Physical Action**: A single drop of luminous golden honey-viscosity serum beads at the tapered glass dropper tip, swells under surface tension, falls in extreme slow-motion (240fps), and creates a soft ripple in the amber meniscus below.
- **Blender Instructions**: Mantaflow liquid simulation, viscosity 0.045, surface tension 0.072. Glass IOR 1.52, amber absorption color `#D97706`.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro cinematic 85mm slow motion commercial of a luxury amber glass apothecary serum bottle with embossed gold text "VERENNE". A single droplet of golden lipid oil gathers at the pipette glass tip, swells, and drops onto a dark marble surface, creating concentric gold ripples. Warm 2800K studio rim lighting, shallow depth of field, photorealistic, 8k.*

---

### Specimen 02: N°02 Sève Dorée (Nocturnal Regeneration Oil)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Linear lateral tracking pass across the dark indigo glass curvature.
- **Physical Action**: Deep Prussian-blue and Moroccan blue tansy oil spreads in a sheer translucent micro-veil over wet obsidian stone, catching specular flares of warm candlelight.
- **Blender Instructions**: Fluid dynamic sheet spreading over displacement texture map. Indigo transmission shader with dispersion 0.02.
- **Runway Gen-3 / Luma Prompt**:
  > *Extreme macro studio shot of deep midnight indigo blue botanical face oil smoothly gliding across polished dark obsidian stone. Translucent Prussian blue hue, microscopic air bubbles suspended in oil, golden candlelight glints on surface tension. Ultra-luxurious cosmetics commercial, 4k, photorealistic.*

---

### Specimen 03: N°03 Brume Botanique (Alpine Neroli & Rose Mist)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Static straight-on macro with backlit rim lighting.
- **Physical Action**: The champagne gold mist actuator depresses; an ethereal, ultra-fine crystalline cloud of microscopic floral dew droplets disperses through a golden sunbeam in slow motion.
- **Blender Instructions**: Particle hair/point emitter, 4,000 sub-micron droplet spheres with turbulence force field. Volumetric scatter light pass.
- **Runway Gen-3 / Luma Prompt**:
  > *High-speed 1000fps phantom camera macro shot of a luxury frosted glass spray bottle dispensing an ultra-fine botanical mist plume into a golden shaft of morning light. Microscopic glistening water droplets catching golden reflections, dark background, cinematic beauty commercial.*

---

### Specimen 04: N°04 Baume Résineux (Ceramide Barrier Salve)
- **Duration**: 4.0 seconds seamless loop.
- **Camera Move**: 45° descending push-in toward the open jar surface.
- **Physical Action**: A polished horn apothecary spatula scoops a pearl of rich, whipped botanical frankincense cream, leaving a sculpted wave-peak in the velvety balm surface.
- **Blender Instructions**: Viscous non-Newtonian fluid sculpture, subsurface scattering (SSS) radius `[1.2, 0.8, 0.4]`, color `#FFFDF9`.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro beauty shot of a heavy frosted glass cosmetic jar with brushed brass rim. A minimalist spatula smoothly carves a curl of opulent whipped ivory face cream, revealing luxurious velvety texture. Soft studio lighting, editorial high-end skincare, 8k.*

---

### Specimen 05: N°05 Lait Purifiant (Enzymatic Cleansing Milk)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Top-down flat lay rotating 15 degrees.
- **Physical Action**: Silky cleansing milk emulsifies into clear water, blooming into swirling botanical lace clouds before clearing.
- **Runway Gen-3 / Luma Prompt**:
  > *Overhead macro slow motion of white botanical cleansing milk dropping into pure crystalline water, creating hypnotic swirling organic cloud patterns. Pure, clean, minimalist apothecary aesthetic, soft diffused lighting.*

---

### Specimen 06: N°06 Argile Céleste (Montmorillonite Clay Mask)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Raking side-angle macro revealing surface topography.
- **Physical Action**: A wide brush stroke of smooth, rich jade-green French clay paste is drawn across slate, showing mineral fine-grain texture.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro texture swipe of organic French green clay mask being smoothed onto dark textured slate. Creamy earthy paste, whipped consistency, botanical Spirulina infusion, studio lighting.*

---

### Specimen 07: N°07 Émulsion Solaire (Mineral SPF 50 Shield)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Micro push-in on skin swatch.
- **Physical Action**: A drop of lightweight mineral fluid blends seamlessly into skin, vanishing completely with zero white cast into a sheer satin glow.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro beauty shot of a lightweight mineral SPF lotion being gently patted into skin, absorbing instantly into a radiant satin finish with zero residue. Sunlit natural warm lighting.*

---

### Specimen 08: N°08 Sérum Yeux (Periorbital Caffeine Elixir)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: 360-degree micro turntable rotation.
- **Physical Action**: Cooling ceramic-tip applicator releases a single micro-bead of green coffee serum, sparkling with emerald botanicals.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro shot of a luxury eye serum dropper with cooling ceramic tip. A crystalline amber drop forms and glistens with botanical active particles. Dark luxury studio backdrop.*

---

### Specimen 09: N°09 Crème Veloutée (Snow Mushroom Biome Cream)
- **Duration**: 4.0 seconds seamless loop.
- **Camera Move**: Macro zoom out from cream surface.
- **Physical Action**: A bouncy, cloud-like dollop of snow mushroom moisturizer rebounds gently when touched, showcasing pneumatic elastic elasticity.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro slow motion of bouncy cloud-like white face moisturizer responding to light touch, showing plush marshmallow elasticity and cushion. Diffused studio lighting.*

---

### Specimen 10: N°10 Huile de Bain (Botanical Bath & Body Nectar)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Tilting downward camera tracking golden stream.
- **Physical Action**: Golden amber bath oil pours into warm steaming bathwater, dispersing into microscopic milky aromatic swirls.
- **Runway Gen-3 / Luma Prompt**:
  > *Cinematic slow motion of rich golden essential oil pouring into clear bath water, blossoming into milky white fragrant ribbons. Ambient luxury spa atmosphere, warm backlight.*

---

### Specimen 11: N°11 Gommage Botanique (Walnut & Rosemary Body Polish)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: 30-degree tracking pan across texture.
- **Physical Action**: Micronized walnut granules suspended in golden botanical oil glistening under soft directional light.
- **Runway Gen-3 / Luma Prompt**:
  > *Extreme macro detail of artisanal botanical body scrub paste, showing golden oils and fine natural walnut granules catching light reflections. Organic luxury cosmetic texture.*

---

### Specimen 12: N°12 Baume des Mains (Ceramide Hand & Cuticle Salve)
- **Duration**: 3.5 seconds seamless loop.
- **Camera Move**: Slow glide across minimalist aluminum tube dispenser.
- **Physical Action**: A clean ribbon of dense botanical hand cream extrudes from the matte aluminum tube nozzle.
- **Runway Gen-3 / Luma Prompt**:
  > *Macro shot of a minimalist luxury aluminum cosmetic tube extruding a perfectly sculpted ribbon of rich botanical lavender hand balm. High fashion cosmetic packaging design.*

