import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useMemo } from 'react';

const SPRING_CONFIG = { stiffness: 160, damping: 24, mass: 0.7 } as const;

export function useHomeParallax() {
  const pointerX = useSpring(useMotionValue(0), SPRING_CONFIG);
  const pointerY = useSpring(useMotionValue(0), SPRING_CONFIG);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [1.2, -1.2]);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-1.2, 1.2]);
  const style = useMemo(
    () => ({ rotateX, rotateY, transformPerspective: 1400 }),
    [rotateX, rotateY],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return { style, handlePointerMove, handlePointerLeave };
}
