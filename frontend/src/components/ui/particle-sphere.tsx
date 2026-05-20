'use client';

import { useEffect, useRef } from 'react';

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const particleCount = 2400;
    const particles: { theta: number; phi: number; size: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        size: 0.6 + Math.random() * 1.2,
        speed: 0.15 + Math.random() * 0.35,
      });
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;
      const radius = Math.min(w, h) * 0.38;

      time += 0.003;

      for (const p of particles) {
        const t = p.theta + time * p.speed;
        const wave = Math.sin(p.phi * 3 + time * 2) * 0.12;
        const r = radius * (1 + wave);

        const x = cx + r * Math.sin(p.phi) * Math.cos(t);
        const y = cy + r * Math.cos(p.phi);
        const z = r * Math.sin(p.phi) * Math.sin(t);

        const depthFactor = (z + radius) / (2 * radius);
        const alpha = 0.06 + depthFactor * 0.3;
        const size = p.size * (0.4 + depthFactor * 0.6);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="particle-sphere-canvas"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
