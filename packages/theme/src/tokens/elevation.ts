export const elevation = {
  base: 0,
  raised: 1,
  floating: 2,
  sticky: 100,
  dropdown: 300,
  popover: 400,
  overlay: 600,
  dialog: 700,
  toast: 800,
} as const;

export type ElevationToken = keyof typeof elevation;
