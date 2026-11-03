import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Procedural bottle profiles (radius, height) — revolved with Lathe   */
/* ------------------------------------------------------------------ */
const v = (x, y) => new THREE.Vector2(x, y);

const SHAPES = {
  dropper: {
    body: [v(0, 0), v(0.6, 0), v(0.66, 0.04), v(0.68, 0.14), v(0.68, 1.22), v(0.63, 1.36), v(0.46, 1.47), v(0.27, 1.53), v(0.24, 1.6), v(0.24, 1.7), v(0, 1.7)],
    fill: 0.95,
    height: 2.35,
    frost: 0.04
  },
  jar: {
    body: [v(0, 0), v(0.98, 0), v(1.04, 0.06), v(1.06, 0.16), v(1.06, 0.82), v(1.0, 0.9), v(0.94, 0.94), v(0, 0.94)],
    fill: 0.78,
    height: 1.3,
    frost: 0.32
  },
  mist: {
    body: [v(0, 0), v(0.5, 0), v(0.55, 0.05), v(0.56, 0.14), v(0.56, 1.86), v(0.5, 1.95), v(0.24, 2.0), v(0, 2.0)],
    fill: 0.85,
    height: 2.6,
    frost: 0.28
  },
  pump: {
    body: [v(0, 0), v(0.6, 0), v(0.65, 0.05), v(0.66, 0.14), v(0.66, 1.36), v(0.6, 1.47), v(0.3, 1.54), v(0, 1.54)],
    fill: 0.9,
    height: 2.25,
    frost: 0.3
  },
  tube: {
    body: [v(0, 0), v(0.42, 0), v(0.52, 0.06), v(0.54, 0.2), v(0.54, 1.75), v(0.5, 1.95), v(0.3, 2.02), v(0, 2.02)],
    fill: 0,
    height: 2.3,
    frost: 1
  }
};

function useLathe(points, scale = 1) {
  return useMemo(() => {
    const pts = points.map((p) => new THREE.Vector2(p.x * scale, p.y));
    const g = new THREE.LatheGeometry(pts, 96);
    g.computeVertexNormals();
    return g;
  }, [points, scale]);
}

/* ------------------------------------------------------------------ */
/* Realistic Paper Apothecary Label wrapped directly on the bottle    */
/* ------------------------------------------------------------------ */
function BottleLabel({ product, shapeKey }) {
  const canvasRef = useRef(null);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    canvasRef.current = canvas;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Warm ivory/cream tactile label paper
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle hairline gold border
    ctx.strokeStyle = '#C9A05A';
    ctx.lineWidth = 6;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

    // Brand Name
    ctx.fillStyle = '#111110';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 30px "Geist Mono", monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText('VERENNE', canvas.width / 2, 130);

    ctx.font = '20px "Geist Mono", monospace';
    ctx.fillStyle = '#777';
    ctx.fillText('PARIS · GRASSE', canvas.width / 2, 185);

    // Gold divider
    ctx.strokeStyle = '#C9A05A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, 230);
    ctx.lineTo(canvas.width / 2 + 120, 230);
    ctx.stroke();

    // Product Name
    ctx.font = 'italic 58px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#111110';
    ctx.fillText(product.name || 'Éclat Sauvage', canvas.width / 2, 330);

    // Subtitle / Discipline
    ctx.font = 'bold 22px "Geist Mono", monospace';
    ctx.fillStyle = '#444';
    ctx.fillText((product.subtitle || 'Active Botanical Serum').toUpperCase(), canvas.width / 2, 420);

    // Latin botanical
    ctx.font = 'italic 26px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#666';
    ctx.fillText(product.latin || 'Helichrysum Stoechas', canvas.width / 2, 480);

    // Bottom specs
    ctx.font = '22px "Geist Mono", monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('30 ML · 1.0 FL. OZ · BIO-ACTIF', canvas.width / 2, 600);

    ctx.font = '18px "Geist Mono", monospace';
    ctx.fillStyle = '#999';
    ctx.fillText('MADE IN FRANCE', canvas.width / 2, 650);

    texture.needsUpdate = true;
  }, [product, texture]);

  // Dimensions based on bottle shape
  if (shapeKey === 'tube') return null;

  const radius = shapeKey === 'jar' ? 1.065 : shapeKey === 'mist' ? 0.565 : 0.685;
  const height = shapeKey === 'jar' ? 0.62 : shapeKey === 'mist' ? 1.15 : 0.88;
  const posY = shapeKey === 'jar' ? 0.52 : shapeKey === 'mist' ? 0.95 : 0.72;

  return (
    <mesh position={[0, posY, 0]}>
      {/* Curved label sector hugging front of bottle */}
      <cylinderGeometry args={[radius, radius, height, 48, 1, true, -Math.PI * 0.44, Math.PI * 0.88]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.75}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Caps & hardware                                                     */
/* ------------------------------------------------------------------ */
function Hardware({ shape, accentGold }) {
  const black = <meshStandardMaterial color="#111110" roughness={0.45} metalness={0.2} />;
  const gold = <meshStandardMaterial color="#c9a05a" roughness={0.18} metalness={0.95} />;
  const bronze = <meshStandardMaterial color="#6e5640" roughness={0.25} metalness={0.9} />;
  const gun = <meshStandardMaterial color="#222222" roughness={0.25} metalness={0.9} />;

  switch (shape) {
    case 'dropper':
      return (
        <group position={[0, 1.7, 0]}>
          {/* Gold knurled collar ring */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.12, 64]} />
            {gold}
          </mesh>
          {/* Main collar barrel */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 64]} />
            {accentGold ? gold : black}
          </mesh>
          {/* Rubber dropper squeeze bulb */}
          <mesh position={[0, 0.66, 0]}>
            <capsuleGeometry args={[0.18, 0.3, 16, 32]} />
            {black}
          </mesh>
          {/* Inner glass pipette rod descending into liquid */}
          <mesh position={[0, -0.85, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 1.6, 16]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.98} thickness={0.2} ior={1.5} />
          </mesh>
          {/* Dropper tip */}
          <mesh position={[0, -1.68, 0]}>
            <coneGeometry args={[0.045, 0.1, 16]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.98} thickness={0.2} ior={1.5} />
          </mesh>
        </group>
      );
    case 'jar':
      return (
        <mesh position={[0, 0.94 + 0.17, 0]}>
          <cylinderGeometry args={[1.08, 1.08, 0.34, 96]} />
          {gold}
        </mesh>
      );
    case 'mist':
      return (
        <group position={[0, 2.0, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.14, 64]} />
            {gold}
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.46, 64]} />
            {black}
          </mesh>
        </group>
      );
    case 'pump':
      return (
        <group position={[0, 1.54, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.32, 0.24, 64]} />
            {gold}
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.3, 32]} />
            {gold}
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.16, 48]} />
            {gold}
          </mesh>
        </group>
      );
    case 'tube':
      return (
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.44, 64]} />
          {black}
        </mesh>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* A single bottle                                                     */
/* ------------------------------------------------------------------ */
function Bottle({ product, quality }) {
  const shapeKey = product.glass.shape;
  const shape = SHAPES[shapeKey] || SHAPES.dropper;
  const bodyGeo = useLathe(shape.body);
  const liquidGeo = useMemo(() => {
    if (!shape.fill) return null;
    const maxY = shape.body[shape.body.length - 1].y * shape.fill;
    const pts = shape.body
      .filter((p) => p.y <= maxY)
      .map((p) => new THREE.Vector2(Math.max(0, p.x * 0.9), Math.max(0.06, p.y)));
    pts.push(new THREE.Vector2(0, maxY));
    pts.unshift(new THREE.Vector2(0, 0.06));
    const g = new THREE.LatheGeometry(pts, 64);
    g.computeVertexNormals();
    return g;
  }, [shape]);

  const isTube = shapeKey === 'tube';
  const accentGold = product.id === 'seve-doree' || product.id === 'eclat-sauvage';

  return (
    <group position={[0, -shape.height / 2 + 0.1, 0]} scale={isTube ? [1, 1, 0.62] : 1}>
      {isTube ? (
        <mesh geometry={bodyGeo}>
          <meshPhysicalMaterial color={product.glass.color} roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} sheen={0.6} sheenColor="#ffffff" />
        </mesh>
      ) : (
        <mesh geometry={bodyGeo}>
          <MeshTransmissionMaterial
            backside={quality === 'high'}
            backsideThickness={0.3}
            samples={quality === 'high' ? 6 : 3}
            resolution={quality === 'high' ? 768 : 384}
            transmission={1}
            thickness={0.55}
            roughness={shape.frost}
            ior={1.48}
            chromaticAberration={0.06}
            anisotropy={0.25}
            distortion={0.16}
            distortionScale={0.4}
            temporalDistortion={0.08}
            clearcoat={1}
            attenuationDistance={1.6}
            attenuationColor={product.glass.color}
            color={product.glass.color}
          />
        </mesh>
      )}

      {liquidGeo && (
        <mesh geometry={liquidGeo}>
          <meshPhysicalMaterial
            color={product.glass.liquid}
            emissive={product.glass.liquid}
            emissiveIntensity={0.22}
            roughness={0.12}
            transmission={shapeKey === 'jar' || shapeKey === 'pump' ? 0 : 0.6}
            thickness={0.8}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}

      {/* Branded Label hugging bottle front */}
      <BottleLabel product={product} shapeKey={shapeKey} />

      {/* Hardware & Dropper Pipette */}
      <Hardware shape={shapeKey} accentGold={accentGold} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The product name, painted onto a plane behind the glass so it is    */
/* physically refracted through the bottle.                            */
/* ------------------------------------------------------------------ */
function NamePlate({ text }) {
  const [texture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 640;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  });

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const c = texture.image;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#EDE7DC';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 360;
      ctx.font = `italic 400 ${size}px "Instrument Serif", serif`;
      while (ctx.measureText(text).width > c.width * 0.94 && size > 120) {
        size -= 10;
        ctx.font = `italic 400 ${size}px "Instrument Serif", serif`;
      }
      ctx.fillText(text, c.width / 2, c.height / 2 + 20);
      texture.needsUpdate = true;
    };
    draw();
    document.fonts?.load('italic 400 100px "Instrument Serif"').then(draw).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [text, texture]);

  const { viewport } = useThree();
  const w = Math.min(viewport.width * 1.15, 14);

  return (
    <mesh position={[0, 0.15, -2.6]}>
      <planeGeometry args={[w, w * (640 / 2048)]} />
      <meshBasicMaterial map={texture} transparent opacity={0.92} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Orbit rings — the “observatory” motif                               */
/* ------------------------------------------------------------------ */
function Orbits({ color }) {
  const a = useRef();
  const b = useRef();
  const moon = useRef();
  const mat = useRef();
  const target = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.12;
    if (moon.current) moon.current.rotation.z += dt * 0.35;
    if (b.current) b.current.rotation.z -= dt * 0.08;
    mat.current?.color.lerp(target, 0.05);
  });

  return (
    <group rotation={[Math.PI / 2.25, 0, 0.18]}>
      <mesh ref={a}>
        <torusGeometry args={[1.85, 0.006, 8, 256]} />
        <meshBasicMaterial ref={mat} color={color} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0.22, 0.1, 0]}>
        <torusGeometry args={[2.35, 0.0035, 8, 256]} />
        <meshBasicMaterial color="#EDE7DC" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {/* a small “moon” riding the inner ring */}
      <group ref={moon}>
        <mesh position={[1.85, 0, 0]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshBasicMaterial color="#FFF3DC" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Pedestal caustic ground ring & coordinates                          */
/* ------------------------------------------------------------------ */
function Pedestal({ color }) {
  const disk = useRef();
  const target = useMemo(() => new THREE.Color(color), [color]);

  useFrame(() => {
    if (disk.current) {
      disk.current.color.lerp(target, 0.05);
    }
  });

  return (
    <group position={[0, -1.6, 0]}>
      {/* Inner caustic glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.45, 64]} />
        <meshBasicMaterial ref={disk} color={color} transparent opacity={0.22} toneMapped={false} />
      </mesh>
      {/* Precision hairline perimeter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.44, 1.455, 96]} />
        <meshBasicMaterial color="#EDE7DC" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.75, 1.76, 96]} />
        <meshBasicMaterial color="#EDE7DC" transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Rig: pointer tilt, interactive 360° drag, scroll drift, swap animation */
/* ------------------------------------------------------------------ */
function Rig({ product, scroll, reduced, quality }) {
  const group = useRef();
  const swap = useRef();
  const light = useRef();
  const [shown, setShown] = useState(product);
  const phase = useRef('in'); // 'out' | 'in'
  const glow = useMemo(() => new THREE.Color(product.glow), [product.glow]);

  // Direct 360 drag tracking
  const manualRot = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (product.id !== shown.id) phase.current = 'out';
  }, [product, shown.id]);

  useEffect(() => {
    const onDown = (e) => {
      // Only drag if in upper half/middle viewport
      if (e.clientY > window.innerHeight * 0.85) return;
      isDragging.current = true;
      lastPtr.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPtr.current.x;
      const dy = e.clientY - lastPtr.current.y;
      lastPtr.current = { x: e.clientX, y: e.clientY };
      manualRot.current.y += dx * 0.008;
      manualRot.current.x = Math.max(-0.45, Math.min(0.45, manualRot.current.x + dy * 0.006));
      velocity.current = { x: dx * 0.008, y: dy * 0.006 };
    };
    const onUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    const s = swap.current;
    if (!g || !s) return;
    const p = scroll?.get?.() ?? 0;

    // Apply inertia when released
    if (!isDragging.current) {
      manualRot.current.y += velocity.current.x;
      manualRot.current.x += velocity.current.y * 0.3;
      velocity.current.x *= 0.93;
      velocity.current.y *= 0.93;

      // Gentle auto-rotation
      if (!reduced) {
        manualRot.current.y += dt * 0.18;
      }
    }

    const targetY = manualRot.current.y + state.pointer.x * 0.35 + p * Math.PI * 1.2;
    const targetX = manualRot.current.x - state.pointer.y * 0.15 + p * 0.25;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.05) - p * 1.6, 4, dt);

    // swap: shrink + twist out, change, grow back
    if (phase.current === 'out') {
      const k = THREE.MathUtils.damp(s.scale.x, 0, 9, dt);
      s.scale.setScalar(k);
      s.rotation.y += dt * 8;
      if (k < 0.03) {
        setShown(product);
        phase.current = 'in';
      }
    } else {
      const k = THREE.MathUtils.damp(s.scale.x, 1, 6, dt);
      s.scale.setScalar(k);
      s.rotation.y = THREE.MathUtils.damp(s.rotation.y, Math.round(s.rotation.y / (Math.PI * 2)) * Math.PI * 2, 4, dt);
    }

    light.current?.color.lerp(glow, 0.04);
  });

  return (
    <>
      <pointLight ref={light} position={[0, 0.4, -1.4]} intensity={18} distance={7} color={product.glow} />
      <Pedestal color={product.glow} />
      <group ref={group}>
        <group ref={swap}>
          <Bottle key={shown.id} product={shown} quality={quality} />
        </group>
        <Orbits color={product.glow} />
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export default function GlassScene({ product, scroll, reduced = false, active = true }) {
  const quality = typeof window !== 'undefined' && (window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4) ? 'low' : 'high';

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 7], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <NamePlate text={product.name} />
      <Rig product={product} scroll={scroll} reduced={reduced} quality={quality} />
      <Sparkles count={quality === 'high' ? 70 : 30} scale={[7, 5, 3]} size={2.2} speed={reduced ? 0 : 0.25} opacity={0.55} color={product.glow} />

      {/* Studio light strips — reflected in the glass, no network HDR required */}
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
        <Lightformer form="rect" intensity={3} position={[-3, 0, 4]} scale={[0.4, 6, 1]} color="#fff4e0" />
        <Lightformer form="rect" intensity={3} position={[3, 0, 4]} scale={[0.4, 6, 1]} color="#fff4e0" />
      </Environment>
    </Canvas>
  );
}
