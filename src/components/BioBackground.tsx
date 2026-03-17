import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "./ScrollContext";
import * as THREE from "three";

// ─── Color palette from reference (navy, medium blue, light blue, grey) ────────

const nodeColors = [
  new THREE.Color(0.08, 0.12, 0.22),  // dark navy
  new THREE.Color(0.10, 0.18, 0.32),  // navy
  new THREE.Color(0.25, 0.45, 0.62),  // medium blue
  new THREE.Color(0.42, 0.65, 0.78),  // light blue
  new THREE.Color(0.68, 0.82, 0.90),  // pale blue
  new THREE.Color(0.55, 0.58, 0.60),  // grey
];

const bondColors = [
  new THREE.Color(0.10, 0.18, 0.32),  // navy bond
  new THREE.Color(0.30, 0.50, 0.65),  // blue bond
  new THREE.Color(0.50, 0.65, 0.75),  // light bond
];

/** Stage-driven opacity */
const stageOpacity: Record<string, number> = {
  hero: 0.7, xray: 0.4, origin: 0.25, dosing: 0.65, science: 0.5, products: 0.35,
};

const stageSpeed: Record<string, number> = {
  hero: 1, xray: 0.08, origin: 0.4, dosing: 0.9, science: 0.7, products: 0.5,
};

// ─── Molecule cluster definitions ──────────────────────────────────────────────
// Each cluster is a pre-defined molecule shape (like the reference image)

interface MolCluster {
  // Local atom positions and sizes
  atoms: { lx: number; ly: number; lz: number; size: number; colorIdx: number }[];
  // Bond pairs (indices into atoms)
  bonds: [number, number][];
}

const clusterTemplates: MolCluster[] = [
  // Large central molecule (like the big one in reference)
  {
    atoms: [
      { lx: 0, ly: 0, lz: 0, size: 0.22, colorIdx: 0 },
      { lx: 0.5, ly: 0.35, lz: 0, size: 0.18, colorIdx: 1 },
      { lx: -0.45, ly: 0.4, lz: 0, size: 0.16, colorIdx: 0 },
      { lx: -0.55, ly: -0.3, lz: 0, size: 0.20, colorIdx: 1 },
      { lx: 0.15, ly: -0.5, lz: 0, size: 0.15, colorIdx: 2 },
      { lx: 0.7, ly: -0.15, lz: 0, size: 0.22, colorIdx: 0 },
      { lx: 1.1, ly: 0.2, lz: 0, size: 0.14, colorIdx: 3 },
      { lx: -0.9, ly: 0.15, lz: 0, size: 0.12, colorIdx: 2 },
      { lx: 0.3, ly: 0.75, lz: 0, size: 0.20, colorIdx: 3 },
      { lx: -0.2, ly: 0.8, lz: 0, size: 0.10, colorIdx: 4 },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[5,6],[2,7],[1,8],[8,9],[3,4]],
  },
  // Medium branching molecule
  {
    atoms: [
      { lx: 0, ly: 0, lz: 0, size: 0.16, colorIdx: 1 },
      { lx: 0.4, ly: 0.3, lz: 0, size: 0.12, colorIdx: 0 },
      { lx: -0.35, ly: 0.25, lz: 0, size: 0.14, colorIdx: 2 },
      { lx: -0.3, ly: -0.35, lz: 0, size: 0.10, colorIdx: 0 },
      { lx: 0.35, ly: -0.25, lz: 0, size: 0.12, colorIdx: 3 },
      { lx: 0.7, ly: 0.1, lz: 0, size: 0.08, colorIdx: 4 },
      { lx: -0.6, ly: -0.15, lz: 0, size: 0.08, colorIdx: 1 },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[3,6]],
  },
  // Small compact molecule
  {
    atoms: [
      { lx: 0, ly: 0, lz: 0, size: 0.12, colorIdx: 0 },
      { lx: 0.3, ly: 0.2, lz: 0, size: 0.08, colorIdx: 2 },
      { lx: -0.25, ly: 0.2, lz: 0, size: 0.08, colorIdx: 1 },
      { lx: 0, ly: -0.3, lz: 0, size: 0.10, colorIdx: 3 },
      { lx: 0.3, ly: -0.15, lz: 0, size: 0.06, colorIdx: 4 },
    ],
    bonds: [[0,1],[0,2],[0,3],[3,4]],
  },
  // Tiny satellite
  {
    atoms: [
      { lx: 0, ly: 0, lz: 0, size: 0.10, colorIdx: 5 },
      { lx: 0.25, ly: 0.15, lz: 0, size: 0.06, colorIdx: 0 },
      { lx: -0.2, ly: 0.18, lz: 0, size: 0.06, colorIdx: 2 },
      { lx: -0.15, ly: -0.2, lz: 0, size: 0.05, colorIdx: 1 },
    ],
    bonds: [[0,1],[0,2],[0,3]],
  },
];

// ─── Molecule instances placed in world ────────────────────────────────────────

interface MolInstance {
  cx: number; cy: number; cz: number;
  scale: number;
  templateIdx: number;
  phase: number;
  orbitSpeed: number;
  orbitRadius: number;
  rotSpeed: number;
}

const MOLECULE_INSTANCES: MolInstance[] = [
  // Large ones (scale reduced 80%)
  { cx: 2.5, cy: 1.5, cz: -1, scale: 0.56, templateIdx: 0, phase: 0, orbitSpeed: 0.04, orbitRadius: 0.3, rotSpeed: 0.02 },
  { cx: -4, cy: -2, cz: -2, scale: 0.40, templateIdx: 0, phase: 2.1, orbitSpeed: 0.05, orbitRadius: 0.25, rotSpeed: -0.015 },
  // Medium
  { cx: -2, cy: 3.5, cz: -1.5, scale: 0.36, templateIdx: 1, phase: 1.2, orbitSpeed: 0.06, orbitRadius: 0.35, rotSpeed: 0.025 },
  { cx: 5, cy: -1, cz: -0.5, scale: 0.32, templateIdx: 1, phase: 3.5, orbitSpeed: 0.05, orbitRadius: 0.3, rotSpeed: -0.02 },
  { cx: -5.5, cy: 1, cz: -2, scale: 0.28, templateIdx: 2, phase: 0.8, orbitSpeed: 0.07, orbitRadius: 0.2, rotSpeed: 0.03 },
  // Small
  { cx: 6, cy: 3, cz: -1, scale: 0.20, templateIdx: 2, phase: 4.2, orbitSpeed: 0.08, orbitRadius: 0.4, rotSpeed: -0.03 },
  { cx: -6, cy: -3.5, cz: -1, scale: 0.18, templateIdx: 3, phase: 1.8, orbitSpeed: 0.09, orbitRadius: 0.35, rotSpeed: 0.04 },
  { cx: 3, cy: -4, cz: -2, scale: 0.22, templateIdx: 3, phase: 5.0, orbitSpeed: 0.07, orbitRadius: 0.3, rotSpeed: -0.025 },
  { cx: -3, cy: -5, cz: -1.5, scale: 0.16, templateIdx: 3, phase: 2.5, orbitSpeed: 0.1, orbitRadius: 0.25, rotSpeed: 0.035 },
  { cx: 7, cy: 0, cz: -2, scale: 0.14, templateIdx: 3, phase: 3.8, orbitSpeed: 0.08, orbitRadius: 0.3, rotSpeed: -0.04 },
];

// Count total atoms and bonds
let TOTAL_ATOMS = 0;
let TOTAL_BONDS = 0;
for (const inst of MOLECULE_INSTANCES) {
  const t = clusterTemplates[inst.templateIdx];
  TOTAL_ATOMS += t.atoms.length;
  TOTAL_BONDS += t.bonds.length;
}

const CURSOR_RADIUS = 4;
const CURSOR_REPEL = 1.8;

// ─── MolecularClusters component ───────────────────────────────────────────────

const MolecularClusters = () => {
  const sphereRef = useRef<THREE.InstancedMesh>(null);
  const bondRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentOpacity = useRef(0.7);

  // Per-atom displacement for cursor interaction
  const displacements = useMemo(() =>
    Array.from({ length: TOTAL_ATOMS }, () => ({ dx: 0, dy: 0, vx: 0, vy: 0 })), []);

  useFrame(({ clock }) => {
    const sphereMesh = sphereRef.current;
    const bondMesh = bondRef.current;
    const glowMesh = glowRef.current;
    if (!sphereMesh || !bondMesh || !glowMesh) return;

    const t = clock.elapsedTime;
    const { stage, mouseX, mouseY } = scroll;
    const speedMult = stageSpeed[stage] ?? 1;

    const targetOp = stageOpacity[stage] ?? 0.5;
    currentOpacity.current += (targetOp - currentOpacity.current) * 0.04;
    (sphereMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current;
    (bondMesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity.current * 0.85;
    (glowMesh.material as THREE.MeshBasicMaterial).opacity = currentOpacity.current * 0.15;

    const cursorX = mouseX * 8;
    const cursorY = mouseY * 6;

    let atomIdx = 0;
    let bondIdx = 0;
    const atomWorldPositions: THREE.Vector3[] = [];

    for (const inst of MOLECULE_INSTANCES) {
      const template = clusterTemplates[inst.templateIdx];
      const st = t * inst.orbitSpeed * speedMult;

      // Cluster center with gentle orbit
      const cx = inst.cx + Math.sin(st + inst.phase) * inst.orbitRadius;
      const cy = inst.cy + Math.cos(st * 0.7 + inst.phase) * inst.orbitRadius;
      const cz = inst.cz;
      const rot = st * inst.rotSpeed;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      // Place atoms
      const clusterAtomStart = atomIdx;
      for (const atom of template.atoms) {
        // Rotate local position
        const rx = atom.lx * cosR - atom.ly * sinR;
        const ry = atom.lx * sinR + atom.ly * cosR;

        const baseX = cx + rx * inst.scale;
        const baseY = cy + ry * inst.scale;

        // Cursor repulsion per atom
        const d = displacements[atomIdx];
        const adx = (baseX + d.dx) - cursorX;
        const ady = (baseY + d.dy) - cursorY;
        const adist = Math.sqrt(adx * adx + ady * ady);

        if (adist < CURSOR_RADIUS && adist > 0.01) {
          const force = (1 - adist / CURSOR_RADIUS) * CURSOR_REPEL;
          d.vx += (adx / adist) * force * 0.025;
          d.vy += (ady / adist) * force * 0.025;
        }

        // Spring back
        d.vx += -d.dx * 0.012;
        d.vy += -d.dy * 0.012;
        d.vx *= 0.93;
        d.vy *= 0.93;
        d.dx += d.vx;
        d.dy += d.vy;

        const wx = baseX + d.dx;
        const wy = baseY + d.dy;
        const wz = cz + atom.lz * inst.scale;

        atomWorldPositions.push(new THREE.Vector3(wx, wy, wz));

        const s = atom.size * inst.scale;
        dummy.position.set(wx, wy, wz);
        dummy.scale.setScalar(s);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        sphereMesh.setMatrixAt(atomIdx, dummy.matrix);

        // Color from palette
        sphereMesh.setColorAt(atomIdx, nodeColors[atom.colorIdx]);
        atomIdx++;
      }

      // Place bonds
      for (const [a, b] of template.bonds) {
        const p0 = atomWorldPositions[clusterAtomStart + a];
        const p1 = atomWorldPositions[clusterAtomStart + b];

        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        const mz = (p0.z + p1.z) / 2;
        const len = p0.distanceTo(p1);

        const thickness = 0.035 * inst.scale;
        dummy.position.set(mx, my, mz);
        dummy.scale.set(thickness, len, thickness);
        dummy.lookAt(p1.x, p1.y, p1.z);
        dummy.rotateX(Math.PI / 2);
        dummy.updateMatrix();
        bondMesh.setMatrixAt(bondIdx, dummy.matrix);

        // Bond color: blend between the two atom colors
        const cIdx = Math.min(template.atoms[a].colorIdx, 2);
        bondMesh.setColorAt(bondIdx, bondColors[cIdx]);

        // Glow layer
        dummy.scale.set(thickness * 3, len, thickness * 3);
        dummy.updateMatrix();
        glowMesh.setMatrixAt(bondIdx, dummy.matrix);

        bondIdx++;
      }
    }

    sphereMesh.instanceMatrix.needsUpdate = true;
    bondMesh.instanceMatrix.needsUpdate = true;
    glowMesh.instanceMatrix.needsUpdate = true;
    if (sphereMesh.instanceColor) sphereMesh.instanceColor.needsUpdate = true;
    if (bondMesh.instanceColor) bondMesh.instanceColor.needsUpdate = true;
  });

  return (
    <>
      {/* Solid spheres */}
      <instancedMesh ref={sphereRef} args={[undefined, undefined, TOTAL_ATOMS]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          transparent
          opacity={0.7}
          roughness={0.35}
          metalness={0.1}
          depthWrite={false}
        />
      </instancedMesh>
      {/* Thick bonds */}
      <instancedMesh ref={bondRef} args={[undefined, undefined, TOTAL_BONDS]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial
          transparent
          opacity={0.65}
          roughness={0.3}
          metalness={0.1}
          depthWrite={false}
        />
      </instancedMesh>
      {/* Bond glow */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, TOTAL_BONDS]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshBasicMaterial
          transparent
          opacity={0.1}
          depthWrite={false}
          color={new THREE.Color(0.25, 0.45, 0.65)}
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
    <ambientLight intensity={0.7} />
    <directionalLight position={[8, 10, 5]} intensity={0.9} color="#ffffff" />
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
      <MolecularClusters />
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
