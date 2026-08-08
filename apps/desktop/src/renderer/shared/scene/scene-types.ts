export const sceneTypes = ['landing', 'background', 'particles', 'light', 'future-event'] as const;

export type SceneType = (typeof sceneTypes)[number];

export interface SceneLayerProps {
  readonly className?: string;
  readonly paused?: boolean;
  readonly intensity?: 'subtle' | 'standard' | 'cinematic';
}
