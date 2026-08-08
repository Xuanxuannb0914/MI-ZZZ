export const glass = {
  light: {
    background: 'rgb(18 35 62 / 58%)',
    border: 'rgb(151 211 255 / 16%)',
    blur: '14px',
    saturation: '115%',
  },
  medium: {
    background: 'rgb(14 28 52 / 76%)',
    border: 'rgb(151 211 255 / 24%)',
    blur: '22px',
    saturation: '130%',
  },
  strong: {
    background: 'rgb(12 24 46 / 90%)',
    border: 'rgb(151 211 255 / 34%)',
    blur: '30px',
    saturation: '145%',
  },
} as const;

export type GlassStrength = keyof typeof glass;
