import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "./ScrollContext";
import * as THREE from "three";

const SPHERE_COUNT = 100;
const CRYSTAL_COUNT = 16;

/** Stage color palettes (RGB 0-1) */
const stageColors: Record<string, [number, number, number]> = {
  hero:     [0.01, 0.52, 0.78],   // Marine Blue
  xray:     [0.50, 0.50, 0.52],   // Neutral Grey
  origin:   [0.82, 0.62, 0.28],   // Warm Amber
  dosing:   [0.01, 0.52, 0.78],   // Marine Blue
  science:  [0.09, 0.64, 0.29],   // Earth Green
  products: [0.48, 0.48, 0.50],   // Neutral Grey
};

/** Speed multipliers per stage – xray = near halt for "Locked Integrity" */
const stageSpeed: Record<string, number> = {
  hero: 1, xray: 0.08, origin: 0.4, dosing: 0.9, science: 0.7, products: 0.5,
};

/** Opacity per stage – origin fades particles to create "Memory" aesthetic */
const stageOpacity: Record<string, number> = {
  hero: 0.38, xray: 0.25, origin: 0.12, dosing: 0.4, science: 0.35, products: 0.2,
};

// ─── Micro-Spheres ─────────────────────────────────────────────────────────────

const MicroSpheres = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentColor = useRef(new THREE.Color(...stageColors.hero));
  const currentOpacity = useRef(0.38);

  const particles = useMemo(() =>
    Array.from({ length: SPHERE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 12 - 2,
      scale: 0.025 + Math.random() * 0.11,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.003,
    })), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const { stage, velocity, mouseX, mouseY } = scroll;

    // Smooth color lerp
    const tc = stageColors[stage] ?? stageColors.hero;
    currentColor.current.lerp(new THREE.Color(tc[0], tc[1], tc[2]), 0.025);

    // Smooth opacity
    const targetOp = stageOpacity[stage] ?? 0.35;
    currentOpacity.current += (targetOp - currentOpacity.current) * 0.03;
    (mesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current;

    // Fluid dynamics: scroll velocity compresses Z
    const compression = 1 - Math.min(velocity * 0.007, 0.45);
    const speedMult = stageSpeed[stage] ?? 1;

    for (let i = 0; i < SPHERE_COUNT; i++) {
      const p = particles[i];
      const st = t * p.speed * speedMult;

      // Orbital + drift
      const ox = Math.sin(st + p.phase) * 0.35 + Math.sin(st * 0.4) * 0.1;
      const oy = Math.cos(st * 0.65 + p.phase) * 0.25;

      // Mouse parallax (deeper particles move less)
      const depthFactor = 1 + p.z * 0.06;
      const mx = mouseX * 0.6 * depthFactor;
      const my = mouseY * 0.6 * depthFactor;

      dummy.position.set(p.x + ox + mx, p.y + oy + my, p.z * compression);

      // Scale with depth fade
      const depthFade = Math.max(0.25, 1 - Math.abs(p.z) * 0.07);
      dummy.scale.setScalar(p.scale * depthFade * (0.75 + compression * 0.5));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Per-instance color variation
      const v = 0.8 + p.scale * 1.5;
      mesh.setColorAt(i, new THREE.Color(
        currentColor.current.r * v,
        currentColor.current.g * v,
        currentColor.current.b * v,
      ));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPHERE_COUNT]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        transparent
        opacity={0.38}
        roughness={0.75}
        metalness={0.08}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Crystalline Structures ────────────────────────────────────────────────────

const CrystallineStructures = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentOpacity = useRef(0.15);

  const crystals = useMemo(() =>
    Array.from({ length: CRYSTAL_COUNT }, () => ({
      x: (Math.random() - 0.5) * 22,
      y: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 8 - 4,
      rotSpeed: (Math.random() - 0.5) * 0.25,
      scale: 0.05 + Math.random() * 0.09,
      phase: Math.random() * Math.PI * 2,
    })), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const { mouseX, mouseY, stage } = scroll;
    const speedMult = stageSpeed[stage] ?? 1;

    const targetOp = (stageOpacity[stage] ?? 0.15) * 0.5;
    currentOpacity.current += (targetOp - currentOpacity.current) * 0.03;
    (mesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current;

    for (let i = 0; i < CRYSTAL_COUNT; i++) {
      const c = crystals[i];
      const st = t * speedMult * 0.15;

      dummy.position.set(
        c.x + mouseX * 0.35,
        c.y + mouseY * 0.35 + Math.sin(st + c.phase) * 0.12,
        c.z,
      );
      dummy.rotation.set(st * c.rotSpeed, st * c.rotSpeed * 0.6, st * c.rotSpeed * 0.4);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CRYSTAL_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        transparent
        opacity={0.15}
        roughness={0.3}
        metalness={0.45}
        color="#8899aa"
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Dosing Orbit Sachets ──────────────────────────────────────────────────────

const DosingOrbitSachets = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX = 6;

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const { dosingCount, stage } = scroll;

    // Only show during dosing stage
    const visible = stage === "dosing";
    const count = Math.ceil(dosingCount);

    for (let i = 0; i < MAX; i++) {
      if (!visible || i >= count) {
        dummy.scale.setScalar(0);
        dummy.position.set(0, 100, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const angle = (i / count) * Math.PI * 2 + t * 0.4;
      const radius = 2.2 + Math.sin(t * 0.5 + i) * 0.3;
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.4,
        Math.sin(angle * 0.5) * 1.2,
      );
      dummy.rotation.set(t * 0.2, angle, t * 0.15);
      dummy.scale.setScalar(0.18);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      mesh.setColorAt(i, new THREE.Color(0.01, 0.52, 0.78));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX]}>
      <boxGeometry args={[1, 0.6, 0.08]} />
      <meshStandardMaterial
        transparent
        opacity={0.6}
        roughness={0.4}
        metalness={0.55}
        color="#c0c8d0"
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Studio Lighting (3-point) ─────────────────────────────────────────────────

const StudioLighting = () => (
  <>
    <ambientLight intensity={0.55} />
    <directionalLight position={[8, 10, 5]} intensity={0.75} color="#ffffff" />
    <directionalLight position={[-6, 4, -5]} intensity={0.25} color="#aabbcc" />
    <pointLight position={[0, -8, 4]} intensity={0.18} color="#eeddcc" />
  </>
);

// ─── Main Canvas ───────────────────────────────────────────────────────────────

const BioBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <StudioLighting />
      <MicroSpheres />
      <CrystallineStructures />
      <DosingOrbitSachets />
    </Canvas>

    {/* Film grain overlay ~3% */}
    <div
      className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
    />
  </div>
);

export default BioBackground;
