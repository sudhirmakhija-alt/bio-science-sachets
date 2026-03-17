import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "./ScrollContext";
import * as THREE from "three";

/** Stage color palettes (RGB 0-1) */
const stageColors: Record<string, [number, number, number]> = {
  hero:     [0.01, 0.52, 0.78],
  xray:     [0.50, 0.50, 0.52],
  origin:   [0.82, 0.62, 0.28],
  dosing:   [0.01, 0.52, 0.78],
  science:  [0.09, 0.64, 0.29],
  products: [0.48, 0.48, 0.50],
};

const stageSpeed: Record<string, number> = {
  hero: 1, xray: 0.08, origin: 0.4, dosing: 0.9, science: 0.7, products: 0.5,
};

const stageOpacity: Record<string, number> = {
  hero: 0.55, xray: 0.35, origin: 0.2, dosing: 0.55, science: 0.45, products: 0.3,
};

// ─── Dynamic Molecular Network ─────────────────────────────────────────────────

const NODE_COUNT = 40;
const MAX_BONDS = 120; // max dynamic connections
const BOND_DISTANCE = 2.8; // nodes within this distance get connected
const CURSOR_RADIUS = 3.5; // radius of cursor influence
const CURSOR_REPEL = 2.5; // repulsion strength

interface NodeData {
  homeX: number; homeY: number; homeZ: number;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; // 0=large, 1=medium, 2=small
  phase: number;
  orbitSpeed: number;
  orbitRadius: number;
}

const MolecularNetwork = () => {
  const ringRef = useRef<THREE.InstancedMesh>(null);
  const coreRef = useRef<THREE.InstancedMesh>(null);
  const bondRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentColor = useRef(new THREE.Color(...stageColors.hero));
  const currentOpacity = useRef(0.55);

  const nodes = useMemo<NodeData[]>(() =>
    Array.from({ length: NODE_COUNT }, (_, i) => {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 6 - 1;
      return {
        homeX: x, homeY: y, homeZ: z,
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        size: i < 8 ? 0 : i < 22 ? 1 : 2, // mix of large, medium, small
        phase: Math.random() * Math.PI * 2,
        orbitSpeed: 0.06 + Math.random() * 0.12,
        orbitRadius: 0.3 + Math.random() * 0.5,
      };
    }), []);

  // Persistent bond count ref
  const bondCount = useRef(0);

  useFrame(({ clock }) => {
    const ringMesh = ringRef.current;
    const coreMesh = coreRef.current;
    const bondMesh = bondRef.current;
    if (!ringMesh || !coreMesh || !bondMesh) return;

    const t = clock.elapsedTime;
    const { stage, velocity, mouseX, mouseY } = scroll;
    const speedMult = stageSpeed[stage] ?? 1;

    const tc = stageColors[stage] ?? stageColors.hero;
    currentColor.current.lerp(new THREE.Color(tc[0], tc[1], tc[2]), 0.035);

    const targetOp = stageOpacity[stage] ?? 0.45;
    currentOpacity.current += (targetOp - currentOpacity.current) * 0.04;

    (ringMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current;
    (coreMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current * 0.4;
    (bondMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current * 0.7;

    // Convert mouse to world-ish coords
    const cursorX = mouseX * 8;
    const cursorY = mouseY * 6;

    // Update node positions with cursor interaction
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      const st = t * n.orbitSpeed * speedMult;

      // Gentle orbital motion around home
      const targetX = n.homeX + Math.sin(st + n.phase) * n.orbitRadius;
      const targetY = n.homeY + Math.cos(st * 0.7 + n.phase) * n.orbitRadius;
      const targetZ = n.homeZ + Math.sin(st * 0.3) * 0.15;

      // Cursor repulsion - break apart effect
      const dx = n.x - cursorX;
      const dy = n.y - cursorY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CURSOR_RADIUS && dist > 0.01) {
        const force = (1 - dist / CURSOR_RADIUS) * CURSOR_REPEL;
        n.vx += (dx / dist) * force * 0.03;
        n.vy += (dy / dist) * force * 0.03;
      }

      // Spring back to target (slower)
      n.vx += (targetX - n.x) * 0.008;
      n.vy += (targetY - n.y) * 0.008;
      n.vz += (targetZ - n.z) * 0.008;

      // Damping
      n.vx *= 0.92;
      n.vy *= 0.92;
      n.vz *= 0.92;

      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      // Size based on type (like the reference: big central nodes, medium, small)
      const scale = n.size === 0 ? 0.18 : n.size === 1 ? 0.12 : 0.07;

      // Ring (torus) for hollow circle look
      dummy.position.set(n.x, n.y, n.z);
      dummy.rotation.set(0, 0, 0); // face camera
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      ringMesh.setMatrixAt(i, dummy.matrix);

      // Small core dot inside
      dummy.scale.setScalar(scale * 0.3);
      dummy.updateMatrix();
      coreMesh.setMatrixAt(i, dummy.matrix);

      // Color
      const brightness = n.size === 0 ? 1.1 : n.size === 1 ? 0.95 : 0.8;
      const col = new THREE.Color(
        currentColor.current.r * brightness,
        currentColor.current.g * brightness,
        currentColor.current.b * brightness,
      );
      ringMesh.setColorAt(i, col);
      coreMesh.setColorAt(i, col);
    }

    // Dynamic bonds - connect nearby nodes
    let bIdx = 0;
    for (let i = 0; i < NODE_COUNT && bIdx < MAX_BONDS; i++) {
      for (let j = i + 1; j < NODE_COUNT && bIdx < MAX_BONDS; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < BOND_DISTANCE && dist > 0.1) {
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const midZ = (a.z + b.z) / 2;

          dummy.position.set(midX, midY, midZ);
          // Thickness tapers with distance
          const thickness = 0.04 * (1 - dist / BOND_DISTANCE) + 0.012;
          dummy.scale.set(thickness, dist, thickness);
          dummy.lookAt(b.x, b.y, b.z);
          dummy.rotateX(Math.PI / 2);
          dummy.updateMatrix();
          bondMesh.setMatrixAt(bIdx, dummy.matrix);
          bIdx++;
        }
      }
    }

    // Hide ALL unused bonds (not just previous count)
    for (let i = bIdx; i < MAX_BONDS; i++) {
      dummy.position.set(0, 100, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      bondMesh.setMatrixAt(i, dummy.matrix);
    }
    bondCount.current = bIdx;

    ringMesh.instanceMatrix.needsUpdate = true;
    coreMesh.instanceMatrix.needsUpdate = true;
    bondMesh.instanceMatrix.needsUpdate = true;
    if (ringMesh.instanceColor) ringMesh.instanceColor.needsUpdate = true;
    if (coreMesh.instanceColor) coreMesh.instanceColor.needsUpdate = true;
  });

  return (
    <>
      {/* Hollow ring nodes (torus) */}
      <instancedMesh ref={ringRef} args={[undefined, undefined, NODE_COUNT]}>
        <torusGeometry args={[1, 0.2, 12, 32]} />
        <meshStandardMaterial
          transparent
          opacity={0.55}
          roughness={0.4}
          metalness={0.1}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      {/* Small filled core dots */}
      <instancedMesh ref={coreRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          transparent
          opacity={0.25}
          roughness={0.5}
          metalness={0.1}
          depthWrite={false}
        />
      </instancedMesh>
      {/* Dynamic bonds - main */}
      <instancedMesh ref={bondRef} args={[undefined, undefined, MAX_BONDS]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial
          transparent
          opacity={0.5}
          roughness={0.3}
          metalness={0.15}
          depthWrite={false}
          emissive={new THREE.Color(0.01, 0.52, 0.78)}
          emissiveIntensity={0.35}
        />
      </instancedMesh>
      {/* Bond glow layer */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, MAX_BONDS]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshBasicMaterial
          transparent
          opacity={0.12}
          depthWrite={false}
          color={new THREE.Color(0.01, 0.52, 0.78)}
        />
      </instancedMesh>
    </>
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
        transparent opacity={0.6} roughness={0.4} metalness={0.55}
        color="#c0c8d0" depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Studio Lighting ───────────────────────────────────────────────────────────

const StudioLighting = () => (
  <>
    <ambientLight intensity={0.65} />
    <directionalLight position={[8, 10, 5]} intensity={0.85} color="#ffffff" />
    <directionalLight position={[-6, 4, -5]} intensity={0.3} color="#aabbcc" />
    <pointLight position={[0, -8, 4]} intensity={0.2} color="#eeddcc" />
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
      <MolecularNetwork />
      <DosingOrbitSachets />
    </Canvas>
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
