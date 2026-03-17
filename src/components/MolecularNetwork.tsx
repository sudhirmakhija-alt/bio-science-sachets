import { useEffect, useRef, useCallback } from "react";
import { useScrollState } from "./ScrollContext";

// ─── Color palettes per stage ──────────────────────────────────────────────────

interface StageColors {
  node: string;
  line: string;
  nodeOpacity: number;
  lineOpacity: number;
  glowNode: string;
  glowOpacity: number;
}

const STAGE_COLORS: Record<string, StageColors> = {
  hero:     { node: "#d0d4dc", line: "#d0d4dc", nodeOpacity: 0.6,  lineOpacity: 0.15, glowNode: "#c0c4cc", glowOpacity: 0.25 },
  xray:     { node: "#d0d4dc", line: "#d0d4dc", nodeOpacity: 0.5,  lineOpacity: 0.12, glowNode: "#c0c4cc", glowOpacity: 0.20 },
  origin:   { node: "#d0d4dc", line: "#d0d4dc", nodeOpacity: 0.4,  lineOpacity: 0.10, glowNode: "#c0c4cc", glowOpacity: 0.15 },
  organ:    { node: "#f2c4b8", line: "#f2c4b8", nodeOpacity: 0.55, lineOpacity: 0.20, glowNode: "#e8a090", glowOpacity: 0.30 },
  gut:      { node: "#b8e8c0", line: "#b8e8c0", nodeOpacity: 0.55, lineOpacity: 0.20, glowNode: "#80d090", glowOpacity: 0.30 },
  omega:    { node: "#b8d4f2", line: "#b8d4f2", nodeOpacity: 0.55, lineOpacity: 0.20, glowNode: "#90b8e0", glowOpacity: 0.30 },
  dosing:   { node: "#d0d4dc", line: "#d0d4dc", nodeOpacity: 0.5,  lineOpacity: 0.15, glowNode: "#c0c4cc", glowOpacity: 0.20 },
  science:  { node: "#7ec8a0", line: "#7ec8a0", nodeOpacity: 0.7,  lineOpacity: 0.30, glowNode: "#5cb880", glowOpacity: 0.40 },
  products: { node: "#d0d4dc", line: "#d0d4dc", nodeOpacity: 0.5,  lineOpacity: 0.15, glowNode: "#c0c4cc", glowOpacity: 0.20 },
};

// ─── Node interface ────────────────────────────────────────────────────────────

interface MolNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isGlow: boolean;
  label: string | null;
  life: number;
  maxLife: number;
  opacity: number;
  pulsePhase: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const MAX_NODES = 40;
const CONNECT_DIST = 120;
const DISCONNECT_DIST = 160;
const MIN_SPEED = 0.2;
const MAX_SPEED = 0.5;
const SPAWN_INTERVAL_MIN = 4000;
const SPAWN_INTERVAL_MAX = 6000;
const TEMP_NODE_LIFE_MIN = 12;
const TEMP_NODE_LIFE_MAX = 15;
const LABELS = ["EPA", "DHA", "GLM", "MSM", "CFU"];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const lerpColor = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return {
    r: Math.round(ca.r + (cb.r - ca.r) * t),
    g: Math.round(ca.g + (cb.g - ca.g) * t),
    b: Math.round(ca.b + (cb.b - ca.b) * t),
  };
};

const createNode = (w: number, h: number, isPermanent: boolean, labelIdx: number): MolNode => {
  const isGlow = Math.random() < 1 / 6;
  const radius = isGlow ? rand(5, 6) : rand(2, 4);

  if (isPermanent) {
    return {
      x: rand(0, w), y: rand(0, h),
      vx: rand(-MAX_SPEED, MAX_SPEED) || MIN_SPEED,
      vy: rand(-MAX_SPEED, MAX_SPEED) || MIN_SPEED,
      radius, isGlow,
      label: labelIdx >= 0 && labelIdx < LABELS.length ? LABELS[labelIdx] : null,
      life: 0, maxLife: 0, opacity: 1,
      pulsePhase: rand(0, Math.PI * 2),
    };
  }

  // Spawn at random edge
  const edge = Math.floor(rand(0, 4));
  let x: number, y: number;
  if (edge === 0) { x = 0; y = rand(0, h); }
  else if (edge === 1) { x = w; y = rand(0, h); }
  else if (edge === 2) { x = rand(0, w); y = 0; }
  else { x = rand(0, w); y = h; }

  const cx = w / 2 + rand(-w * 0.3, w * 0.3);
  const cy = h / 2 + rand(-h * 0.3, h * 0.3);
  const dx = cx - x;
  const dy = cy - y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = rand(MIN_SPEED, MAX_SPEED);
  const life = rand(TEMP_NODE_LIFE_MIN, TEMP_NODE_LIFE_MAX);

  return {
    x, y,
    vx: (dx / dist) * speed, vy: (dy / dist) * speed,
    radius, isGlow, label: null,
    life, maxLife: life, opacity: 0,
    pulsePhase: rand(0, Math.PI * 2),
  };
};

// ─── Component ─────────────────────────────────────────────────────────────────

const MolecularNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<MolNode[]>([]);
  const lastSpawnRef = useRef(0);
  const nextSpawnDelayRef = useRef(rand(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX));
  const animRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Color interpolation state stored in refs to avoid effect restarts
  const currentColorsRef = useRef({ ...STAGE_COLORS.hero });
  const targetColorsRef = useRef(STAGE_COLORS.hero);
  const prevColorsRef = useRef(STAGE_COLORS.hero);
  const colorTRef = useRef(1);

  // Store stage in a ref, updated via scroll context
  const stageRef = useRef("hero");
  const scroll = useScrollState();

  // Sync stage to ref without causing effect restart
  useEffect(() => {
    stageRef.current = scroll.stage;
  }, [scroll.stage]);

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: MolNode[] = [];
    let labelCount = 0;
    for (let i = 0; i < 25; i++) {
      const labelIdx = labelCount < 3 && Math.random() < 0.15 ? labelCount++ : -1;
      nodes.push(createNode(w, h, true, labelIdx));
    }
    while (labelCount < 3) {
      const idx = Math.floor(rand(0, nodes.length));
      if (!nodes[idx].label) {
        nodes[idx].label = LABELS[labelCount];
        nodes[idx].isGlow = true;
        nodes[idx].radius = rand(5, 6);
        labelCount++;
      }
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) {
        initNodes(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = (timestamp: number) => {
      const dt = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 16.67, 3) : 1;
      lastTimeRef.current = timestamp;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const nodes = nodesRef.current;

      // ── Color interpolation using refs ──
      const stageKey = stageRef.current;
      const newTarget = STAGE_COLORS[stageKey] ?? STAGE_COLORS.hero;
      if (newTarget !== targetColorsRef.current) {
        // Snapshot current interpolated colors as the new "previous"
        prevColorsRef.current = { ...currentColorsRef.current };
        targetColorsRef.current = newTarget;
        colorTRef.current = 0;
      }
      colorTRef.current = Math.min(1, colorTRef.current + 0.02 * dt);
      const ct = colorTRef.current;
      const prev = prevColorsRef.current;
      const tgt = targetColorsRef.current;

      const nodeColor = lerpColor(prev.node, tgt.node, ct);
      const lineColor = lerpColor(prev.line, tgt.line, ct);
      const glowColor = lerpColor(prev.glowNode, tgt.glowNode, ct);
      const nodeOp = prev.nodeOpacity + (tgt.nodeOpacity - prev.nodeOpacity) * ct;
      const lineOp = prev.lineOpacity + (tgt.lineOpacity - prev.lineOpacity) * ct;
      const glowOp = prev.glowOpacity + (tgt.glowOpacity - prev.glowOpacity) * ct;

      // Store current interpolated state
      currentColorsRef.current = {
        node: tgt.node, line: tgt.line, glowNode: tgt.glowNode,
        nodeOpacity: nodeOp, lineOpacity: lineOp, glowOpacity: glowOp,
      };

      // ── Spawn temp nodes ──
      if (timestamp - lastSpawnRef.current > nextSpawnDelayRef.current && nodes.length < MAX_NODES) {
        nodes.push(createNode(w, h, false, -1));
        lastSpawnRef.current = timestamp;
        nextSpawnDelayRef.current = rand(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX);
      }

      // ── Update nodes ──
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        if (n.life === 0) {
          if (n.x < -20) { n.x = -20; n.vx = Math.abs(n.vx); }
          if (n.x > w + 20) { n.x = w + 20; n.vx = -Math.abs(n.vx); }
          if (n.y < -20) { n.y = -20; n.vy = Math.abs(n.vy); }
          if (n.y > h + 20) { n.y = h + 20; n.vy = -Math.abs(n.vy); }
        }

        if (n.maxLife > 0) {
          n.life -= dt / 60;
          const elapsed = n.maxLife - n.life;
          if (elapsed < 2) n.opacity = Math.min(1, elapsed / 2);
          else if (n.life < 3) n.opacity = Math.max(0, n.life / 3);
          else n.opacity = 1;
          if (n.life <= 0) { nodes.splice(i, 1); continue; }
        }
      }

      // ── Clear & draw ──
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < DISCONNECT_DIST) {
            let alpha = lineOp;
            if (dist > CONNECT_DIST) {
              alpha *= 1 - (dist - CONNECT_DIST) / (DISCONNECT_DIST - CONNECT_DIST);
            }
            alpha *= a.opacity * b.opacity;
            if (alpha > 0.005) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${lineColor.r},${lineColor.g},${lineColor.b},${alpha})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }

      // Nodes
      const time = timestamp / 1000;
      for (const n of nodes) {
        const alpha = nodeOp * n.opacity;
        if (alpha < 0.01) continue;

        let r = n.radius;

        if (n.isGlow) {
          const pulse = 1 + 0.2 * Math.sin(time * (Math.PI * 2 / 3) + n.pulsePhase);
          r *= pulse;

          const gradient = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r * 3);
          gradient.addColorStop(0, `rgba(${glowColor.r},${glowColor.g},${glowColor.b},${glowOp * n.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${glowColor.r},${glowColor.g},${glowColor.b},0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor.r},${nodeColor.g},${nodeColor.b},${alpha})`;
        ctx.fill();

        if (n.label) {
          ctx.font = "500 9px 'Inter', sans-serif";
          ctx.fillStyle = `rgba(${nodeColor.r},${nodeColor.g},${nodeColor.b},${alpha * 0.35})`;
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - r - 6);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default MolecularNetwork;
