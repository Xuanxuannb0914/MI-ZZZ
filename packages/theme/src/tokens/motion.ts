export const motion = {
  duration: {
    instant: '0ms',
    fast: '160ms',
    normal: '220ms',
    slow: '320ms',
    route: '360ms',
    loading: '1800ms',
    ambient: '4800ms',
  },
  easing: {
    enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  durationSeconds: {
    fast: 0.16,
    normal: 0.22,
    slow: 0.32,
    route: 0.36,
    loading: 1.8,
    ambient: 4.8,
  },
  distance: {
    pressed: '1px',
    hover: '2px',
    raised: '3px',
  },
  delays: {
    tooltip: 400,
  },
} as const;
