import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "./ScrollContext";
import * as THREE from "three";

const MOLECULE_COUNT = 18;
const ATOMS_PER_MOLECULE = 5;
const BONDS_PER_MOLECULE = 4;
const TOTAL_ATOMS = MOLECULE_COUNT * ATOMS_PER_MOLECULE;
const TOTAL_BONDS = MOLECULE_COUNT * BONDS_PER_MOLECULE;

/** Stage color palettes (RGB 0-1) */
const stageColors: Record<string, [number, number, number]> = {
  hero:     [0.01, 0.52, 0.78],
  xray:     [0.50, 0.50, 0.52],
  origin:   [0.82, 0.62, 0.28],
  dosing:   [0.01, 0.52, 0.78],
  science:  [0.09, 0.64, 0.29],
  products: [0.48, 0.48, 0.50],
};

/** Speed multipliers per stage */
const stageSpeed: Record<string, number> = {
  hero: 1, xray: 0.08, origin: 0.4, dosing: 0.9, science: 0.7, products: 0.5,
};

/** Opacity per stage */
const stageOpacity: Record<string, number> = {
  hero: 0.38, xray: 0.25, origin: 0.12, dosing: 0.4, science: 0.35, products: 0.2,
};

// Molecular layout templates (local offsets for atoms)
const moleculeTemplates = [
  // Tetrahedral-ish
  [
    [0, 0, 0],
    [0.35, 0.25, 0],
    [-0.3, 0.3, 0.1],
    [0.1, -0.35, 0.15],
    [-0.2, -0.15, -0.2],
  ],
  // Linear chain
  [
    [-0.4, 0, 0],
    [-0.15, 0.15, 0],
    [0.1, -0.1, 0],
    [0.35, 0.1, 0.1],
    [0.55, -0.05, -0.1],
  ],
  // Ring-ish
  [
    [0, 0.3, 0],
    [0.28, 0.1, 0],
    [0.18, -0.25, 0],
    [-0.18, -0.25, 0],
    [-0.28, 0.1, 0],
  ],
];

// Bond connections (indices into atom array)
const bondConnections = [
  [0, 1], [1, 2], [2, 3], [3, 4],
];

// ─── Molecular Structures ──────────────────────────────────────────────────────

const MolecularStructures = () => {
  const atomRef = useRef<THREE.InstancedMesh>(null);
  const bondRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentColor = useRef(new THREE.Color(...stageColors.hero));
  const currentOpacity = useRef(0.38);

  const molecules = useMemo(() =>
    Array.from({ length: MOLECULE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 12 - 2,
      scale: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.6,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      template: Math.floor(Math.random() * moleculeTemplates.length),
    })), []);

  useFrame(({ clock }) => {
    const atomMesh = atomRef.current;
    const bondMesh = bondRef.current;
    if (!atomMesh || !bondMesh) return;
    const t = clock.elapsedTime;
    const { stage, velocity, mouseX, mouseY } = scroll;

    const tc = stageColors[stage] ?? stageColors.hero;
    currentColor.current.lerp(new THREE.Color(tc[0], tc[1], tc[2]), 0.025);

    const targetOp = stageOpacity[stage] ?? 0.35;
    currentOpacity.current += (targetOp - currentOpacity.current) * 0.03;
    (atomMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current;
    (bondMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current * 0.6;

    const compression = 1 - Math.min(velocity * 0.007, 0.45);
    const speedMult = stageSpeed[stage] ?? 1;

    const tempPos = new THREE.Vector3();
    const atomPositions: THREE.Vector3[] = [];

    // Place atoms
    for (let m = 0; m < MOLECULE_COUNT; m++) {
      const mol = molecules[m];
      const st = t * mol.speed * speedMult;
      const template = moleculeTemplates[mol.template];

      const ox = Math.sin(st + mol.phase) * 0.35;
      const oy = Math.cos(st * 0.65 + mol.phase) * 0.25;
      const depthFactor = 1 + mol.z * 0.06;
      const mx = mouseX * 0.6 * depthFactor;
      const my = mouseY * 0.6 * depthFactor;

      const baseX = mol.x + ox + mx;
      const baseY = mol.y + oy + my;
      const baseZ = mol.z * compression;
      const rot = st * mol.rotSpeed;

      for (let a = 0; a < ATOMS_PER_MOLECULE; a++) {
        const [lx, ly, lz] = template[a];
        // Rotate local offset
        const cosR = Math.cos(rot);
        const sinR = Math.sin(rot);
        const rx = lx * cosR - ly * sinR;
        const ry = lx * sinR + ly * cosR;

        const px = baseX + rx * mol.scale;
        const py = baseY + ry * mol.scale;
        const pz = baseZ + lz * mol.scale;

        tempPos.set(px, py, pz);
        atomPositions.push(tempPos.clone());

        const idx = m * ATOMS_PER_MOLECULE + a;
        dummy.position.copy(tempPos);
        // Center atom larger, outer atoms smaller
        const atomScale = a === 0 ? 0.06 * mol.scale : 0.04 * mol.scale;
        dummy.scale.setScalar(atomScale);
        dummy.updateMatrix();
        atomMesh.setMatrixAt(idx, dummy.matrix);

        const v = 0.8 + (a === 0 ? 0.3 : 0.15);
        atomMesh.setColorAt(idx, new THREE.Color(
          currentColor.current.r * v,
          currentColor.current.g * v,
          currentColor.current.b * v,
        ));
      }

      // Place bonds
      for (let b = 0; b < BONDS_PER_MOLECULE; b++) {
        const [i0, i1] = bondConnections[b];
        const p0 = atomPositions[m * ATOMS_PER_MOLECULE + i0];
        const p1 = atomPositions[m * ATOMS_PER_MOLECULE + i1];

        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        const midZ = (p0.z + p1.z) / 2;

        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const dz = p1.z - p0.z;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const bondIdx = m * BONDS_PER_MOLECULE + b;
        dummy.position.set(midX, midY, midZ);
        dummy.scale.set(0.012 * mol.scale, len, 0.012 * mol.scale);

        // Orient cylinder along bond direction
        dummy.lookAt(p1.x, p1.y, p1.z);
        dummy.rotateX(Math.PI / 2);
        dummy.updateMatrix();
        bondMesh.setMatrixAt(bondIdx, dummy.matrix);
      }
    }

    atomMesh.instanceMatrix.needsUpdate = true;
    if (atomMesh.instanceColor) atomMesh.instanceColor.needsUpdate = true;
    bondMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={atomRef} args={[undefined, undefined, TOTAL_ATOMS]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          transparent
          opacity={0.38}
          roughness={0.5}
          metalness={0.15}
          depthWrite={false}
        />
      </instancedMesh>
      <instancedMesh ref={bondRef} args={[undefined, undefined, TOTAL_BONDS]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial
          transparent
          opacity={0.22}
          roughness={0.6}
          metalness={0.1}
          color="#8899aa"
          depthWrite={false}
        />
      </instancedMesh>
    </>
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
