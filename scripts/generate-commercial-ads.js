import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const productsDir = path.join(root, 'public', 'products');
const outputDir = path.join(root, 'public', 'videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 6 Core Showcase Formulations
const items = [
  { id: 'eclat-sauvage', name: 'N°01 Éclat Sauvage', tint: '#D97706', duration: 4 },
  { id: 'baume-resineux', name: 'N°02 Baume Résineux', tint: '#BC7C45', duration: 4 },
  { id: 'brume-botanique', name: 'N°03 Brume Botanique', tint: '#E5C396', duration: 4 },
  { id: 'seve-doree', name: 'N°04 Sève Dorée', tint: '#7B5CC4', duration: 4 },
  { id: 'argile-purifiante', name: 'N°05 Argile Purifiante', tint: '#8A9A86', duration: 4 },
  { id: 'creme-radieuse', name: 'N°06 Crème Radieuse', tint: '#D4AF37', duration: 4 }
];

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}

async function generateAdVideo(item) {
  const inputImage = path.join(productsDir, `${item.id}.webp`);
  const outputFile = path.join(outputDir, `${item.id}-ad.mp4`);

  if (!fs.existsSync(inputImage)) {
    console.error(`Input image not found: ${inputImage}`);
    return;
  }

  console.log(`Generating realistic ad video for ${item.id}...`);

  // Filter graph for luxury commercial ad:
  // 1. Pad to clean vertical 720x960 3:4 studio canvas with dark luxury background
  // 2. Smooth cinematic push-in (zoompan: 1.0 -> 1.07)
  // 3. Subtle dynamic lighting vignette and specular glint sweep
  const filter = [
    // Step A: ensure square/vertical pad with obsidian studio background
    `scale=720:960:force_original_aspect_ratio=decrease,pad=720:960:(ow-iw)/2:(oh-ih)/2:color=0x0A0A09`,
    // Step B: smooth 60fps Ken Burns zoom-in
    `zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=720x960:fps=60`,
    // Step C: subtle warm studio lighting curve & contrast
    `curves=all='0/0 0.5/0.52 1/1'`,
    // Step D: format pixel format for universal web playback
    `format=yuv420p`
  ].join(',');

  const args = [
    '-y',
    '-loop', '1',
    '-i', inputImage,
    '-filter_complex', filter,
    '-c:v', 'libx264',
    '-t', '4',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputFile
  ];

  await runFfmpeg(args);
  console.log(`✓ Saved ${outputFile}`);
}

async function main() {
  for (const item of items) {
    try {
      await generateAdVideo(item);
    } catch (e) {
      console.error(`Failed on ${item.id}:`, e);
    }
  }
}

main();

