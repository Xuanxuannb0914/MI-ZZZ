import { useEffect, useRef } from 'react';
import { scenePalette } from './scene-tokens';

const PARTICLE_COUNT = 220;
const MAX_DPR = 1.25;
const CONNECTION_DISTANCE = 120;
const CAMERA_DEPTH = 680;

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  tint: number;
}

interface BackgroundSceneProps {
  readonly className?: string;
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    x: ((index * 97) % 997) / 997 - 0.5,
    y: ((index * 193) % 991) / 991 - 0.5,
    z: ((index * 53) % 1000) / 1000,
    size: 0.5 + ((index * 17) % 12) / 10,
    alpha: 0.18 + ((index * 29) % 55) / 100,
    tint: index % 7 === 0 ? 1 : index % 11 === 0 ? 2 : 0,
  }));
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): { width: number; height: number } {
  const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return undefined;

    const particles = createParticles();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 预计算「亮点」索引：连接线只需绘制含亮点的点对，避免每帧 O(n²) 全量距离扫描。
    const tintedIndices = particles.flatMap((particle, index) =>
      particle.tint !== 0 ? [index] : [],
    );
    const tinted = particles.map((particle) => particle.tint !== 0);
    let viewport = resizeCanvas(canvas, context);
    let animationFrame = 0;
    let isDisposed = false;
    let isPaused = document.hidden;
    let pointerX = 0;
    let pointerY = 0;

    const handleResize = () => {
      viewport = resizeCanvas(canvas, context);
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    };
    const scheduleFrame = () => {
      if (!isDisposed && !isPaused && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };
    const render = (time: number) => {
      animationFrame = 0;
      if (isDisposed || isPaused) return;
      const seconds = time / 1000;
      const { width, height } = viewport;
      const centerX = width * 0.62 + pointerX * 18;
      const centerY = height * 0.37 + pointerY * 12;

      context.fillStyle = scenePalette.canvasCss;
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        Math.max(width, height) * 0.72,
      );
      glow.addColorStop(0, `rgba(${scenePalette.primaryRgb}, 0.18)`);
      glow.addColorStop(0.42, `rgba(${scenePalette.secondaryRgb}, 0.08)`);
      glow.addColorStop(1, `rgba(${scenePalette.primaryRgb}, 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const projected = particles.map((particle) => {
        const drift = reducedMotion ? 0 : Math.sin(seconds * 0.16 + particle.z * 8) * 0.014;
        const depth = (particle.z + drift + 1) % 1;
        const scale = CAMERA_DEPTH / (CAMERA_DEPTH + depth * 420);
        return {
          x: width / 2 + (particle.x * width * 1.55 + pointerX * depth * -30) * scale,
          y: height / 2 + (particle.y * height * 1.45 + pointerY * depth * -24) * scale,
          size: particle.size * scale,
          alpha: particle.alpha * (1 - depth * 0.45),
          tint: particle.tint,
        };
      });

      const isVisible = (index: number) => {
        const particle = projected[index];
        if (!particle) return false;
        return (
          particle.x >= -20 &&
          particle.x <= width + 20 &&
          particle.y >= -20 &&
          particle.y <= height + 20
        );
      };

      if (!reducedMotion && tintedIndices.length > 1) {
        // 仅遍历「亮点」到其他粒子的点对，连接线数量由亮点数决定，大幅降低每帧距离计算。
        for (const tintedIndex of tintedIndices) {
          if (!isVisible(tintedIndex)) continue;
          const source = projected[tintedIndex];
          if (!source) continue;
          const tintA = tinted[tintedIndex];
          for (let nextIndex = 0; nextIndex < projected.length; nextIndex += 1) {
            if (nextIndex === tintedIndex) continue;
            if (!tintA && !tinted[nextIndex]) continue;
            const next = projected[nextIndex];
            if (!next) continue;
            const distance = Math.hypot(source.x - next.x, source.y - next.y);
            if (distance < CONNECTION_DISTANCE) {
              context.strokeStyle = `rgba(${scenePalette.primaryRgb}, ${Math.max(0, 0.08 - distance / 1800)})`;
              context.lineWidth = 0.5;
              context.beginPath();
              context.moveTo(source.x, source.y);
              context.lineTo(next.x, next.y);
              context.stroke();
            }
          }
        }
      }

      for (let index = 0; index < projected.length; index += 1) {
        const particle = projected[index];
        if (!particle) continue;
        if (
          particle.x < -20 ||
          particle.x > width + 20 ||
          particle.y < -20 ||
          particle.y > height + 20
        )
          continue;
        const color =
          particle.tint === 1
            ? scenePalette.accentRgb
            : particle.tint === 2
              ? scenePalette.secondaryRgb
              : scenePalette.primaryRgb;
        context.fillStyle = `rgba(${color}, ${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.save();
      context.translate(centerX, centerY);
      context.rotate(reducedMotion ? 0 : seconds * 0.025);
      [150, 226, 308].forEach((radius, index) => {
        context.strokeStyle = `rgba(${index === 1 ? scenePalette.secondaryRgb : scenePalette.primaryRgb}, ${0.12 - index * 0.025})`;
        context.lineWidth = 1;
        context.setLineDash([2 + index * 2, 15 + index * 4]);
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
      });
      context.restore();

      scheduleFrame();
    };
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) scheduleFrame();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    scheduleFrame();

    return () => {
      isDisposed = true;
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
