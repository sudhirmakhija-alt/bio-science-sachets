import { useEffect, useRef } from "react";

interface MolecularRingProps {
  color: string;
  size?: number;
  speed?: number;
  nodeCount?: number;
}

const MolecularRing = ({ color, size = 280, speed = 0.3, nodeCount = 6 }: MolecularRingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const { r, g, b } = hexToRgb(color);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.4;

    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      angleOffset: (i / nodeCount) * Math.PI * 2,
      radiusVar: 0.9 + Math.random() * 0.2,
      size: 1.5 + Math.random() * 1.5,
    }));

    const animate = (timestamp: number) => {
      const t = timestamp / 1000;
      ctx.clearRect(0, 0, size, size);

      const positions = nodes.map((n) => {
        const angle = n.angleOffset + t * speed;
        const rad = radius * n.radiusVar;
        return {
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
          size: n.size,
        };
      });

      // Draw connections
      for (let i = 0; i < positions.length; i++) {
        const next = positions[(i + 1) % positions.length];
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw nodes
      for (const p of positions) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [color, size, speed, nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: size, height: size }}
    />
  );
};

export default MolecularRing;
