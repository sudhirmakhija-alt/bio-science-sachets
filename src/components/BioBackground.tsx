import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "./ScrollContext";
import * as THREE from "three";

const PARTICLE_COUNT = 120;

/** Color palette mapped to scroll stages */
const stageColors: Record<string, [number, number, number]> = {
  hero: [0.008, 0.522, 0.78],      // Marine Blue
  xray: [0.45, 0.45, 0.48],        // Neutral Grey
  origin: [0.85, 0.65, 0.3],       // Warm Amber
  dosing: [0.008, 0.522, 0.78],    // Marine Blue
  science: [0.086, 0.639, 0.290],  // Earth Green
  products: [0.45, 0.45, 0.48],    // Neutral Grey
};

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/** Instanced micro-spheres with fluid dynamics */
const MicroSpheres = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollState = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetColor = useRef(new THREE.Color());
  const currentColor = useRef(new THREE.Color(0.008, 0.522, 0.78));

  // Generate initial particle positions & velocities
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 10 - 2,
      vx: (Math.random() - 0.5) * 0.005,
      vy: (Math.random() - 0.5) * 0.005,
      vz: (Math.random() - 0.5) * 0.003,
      scale: 0.03 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const { progress, stage, velocity, mouseX, mouseY } = scrollState;

    // Smooth color transition
    const tc = stageColors[stage] || stageColors.hero;
    targetColor.current.setRGB(tc[0], tc[1], tc[2]);
    currentColor.current.lerp(targetColor.current, 0.03);

    // Velocity-based compression factor (fluid dynamics)
    const compression = 1 - Math.min(velocity * 0.008, 0.4);
    // Stage-specific behavior
    const isStable = stage === "xray"; // particles slow/halt
    const speedMult = isStable ? 0.1 : 1;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Base orbital motion
      const t = time * p.speed * speedMult;
      const ox = Math.sin(t + p.phase) * 0.3;
      const oy = Math.cos(t * 0.7 + p.phase) * 0.2;

      // Mouse parallax
      const mx = mouseX * 0.5 * (1 + p.z * 0.1);
      const my = mouseY * 0.5 * (1 + p.z * 0.1);

      // Scroll-driven Z compression
      const sz = p.z * compression;

      dummy.position.set(
        p.x + ox + mx,
        p.y + oy + my,
        sz
      );

      // Scale based on depth and scroll
      const depthFade = Math.max(0.3, 1 - Math.abs(p.z) * 0.08);
      const s = p.scale * depthFade * (0.8 + compression * 0.4);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Per-instance color with slight variation
      const colorVar = 0.85 + p.scale * 1.2;
      const instanceColor = new THREE.Color(
        currentColor.current.r * colorVar,
        currentColor.current.g * colorVar,
        currentColor.current.b * colorVar
      );
      meshRef.current.setColorAt(i, instanceColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        transparent
        opacity={0.35}
        roughness={0.7}
        metalness={0.1}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/** Crystalline structures (larger, slower, rarer) */
const CrystallineStructures = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollState = useScrollState();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 20;

  const crystals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 8 - 3,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      scale: 0.06 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const { mouseX, mouseY, stage } = scrollState;
    const isStable = stage === "xray";

    for (let i = 0; i < count; i++) {
      const c = crystals[i];
      const t = time * (isStable ? 0.05 : 0.15);

      dummy.position.set(
        c.x + mouseX * 0.3,
        c.y + mouseY * 0.3 + Math.sin(t + c.phase) * 0.15,
        c.z
      );
      dummy.rotation.set(t * c.rotSpeed, t * c.rotSpeed * 0.7, t * c.rotSpeed * 0.5);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        transparent
        opacity={0.15}
        roughness={0.3}
        metalness={0.4}
        color="#8899aa"
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/** Ambient 3-point studio lighting */
const StudioLighting = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#aabbcc" />
      <pointLight position={[0, -8, 3]} intensity={0.2} color="#eeddcc" />
    </>
  );
};

/** The full 3D background canvas */
const BioBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <StudioLighting />
        <MicroSpheres />
        <CrystallineStructures />
      </Canvas>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
};

export default BioBackground;
