export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  },
  scale: {
    display: { fontSize: '32px', lineHeight: '40px', fontWeight: 650 },
    title1: { fontSize: '24px', lineHeight: '32px', fontWeight: 650 },
    title2: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
    title3: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 },
    bodyLarge: { fontSize: '16px', lineHeight: '26px', fontWeight: 400 },
    body: { fontSize: '14px', lineHeight: '22px', fontWeight: 400 },
    label: { fontSize: '13px', lineHeight: '18px', fontWeight: 550 },
    caption: { fontSize: '12px', lineHeight: '18px', fontWeight: 450 },
    code: { fontSize: '13px', lineHeight: '20px', fontWeight: 450 },
  },
} as const;
