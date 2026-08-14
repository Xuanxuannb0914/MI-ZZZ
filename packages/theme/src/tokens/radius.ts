export const radius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  control: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export type RadiusToken = keyof typeof radius;
