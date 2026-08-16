import { motion, useMotionValue, useSpring } from 'framer-motion';
import { type PointerEvent as ReactPointerEvent, type PropsWithChildren, useRef } from 'react';

/**
 * 磁吸交互：指针进入后元素被轻微吸引向光标（参考创意站点按钮手感）。
 * 仅对 `pointer: fine` 生效；reduced-motion 时退化为无位移。
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: PropsWithChildren<{ readonly strength?: number; readonly className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 20, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 20, mass: 0.4 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  );
}