import type { Preview } from '@storybook/react';
import '@game-guide-hub/theme/styles.css';

const preview: Preview = {
  parameters: {
    a11y: {
      element: '#storybook-root',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0B0D12' },
        { name: 'light', value: '#F4F6F9' },
      ],
    },
    controls: {
      expanded: true,
    },
  },
};

export default preview;
