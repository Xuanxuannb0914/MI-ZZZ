export * from './tokens';

export const themeModes = ['dark', 'light', 'high-contrast'] as const;
export type ThemeMode = (typeof themeModes)[number];

export const themeStorageKey = 'ggh-theme-mode';
