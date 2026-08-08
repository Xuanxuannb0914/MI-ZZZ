import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const workspaceRoot = resolve(import.meta.dirname, '..');
const removableDirectories = [
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
  'storybook-static',
  '.turbo',
  '.vite',
];

const workspaceDirectories = [
  'apps/api',
  'apps/desktop',
  'apps/storybook',
  'apps/worker',
  'packages/api-client',
  'packages/config',
  'packages/hooks',
  'packages/icons',
  'packages/theme',
  'packages/types',
  'packages/ui',
  'packages/utils',
];

await Promise.all(
  [
    ...removableDirectories.map((directory) => resolve(workspaceRoot, directory)),
    ...workspaceDirectories.flatMap((workspace) =>
      removableDirectories.map((directory) => resolve(workspaceRoot, workspace, directory)),
    ),
  ].map((directory) => rm(directory, { recursive: true, force: true })),
);
