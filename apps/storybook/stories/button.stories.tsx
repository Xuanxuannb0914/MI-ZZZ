import { Button } from '@game-guide-hub/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: {
    children: 'Continue',
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { isLoading: true },
};
