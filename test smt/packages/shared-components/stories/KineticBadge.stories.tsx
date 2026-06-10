import type { Meta, StoryObj } from '@storybook/react';

import { KineticBadge } from '../src/KineticBadge';

const meta: Meta<typeof KineticBadge> = {
  title: 'Workout/Atoms/KineticBadge',
  component: KineticBadge,
  args: {
    label: 'Intermediate',
    tone: 'default'
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof KineticBadge>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    label: 'Beginner',
    tone: 'success'
  }
};

export const Warning: Story = {
  args: {
    label: 'Intermediate',
    tone: 'warning'
  }
};

export const Danger: Story = {
  args: {
    label: 'Advanced',
    tone: 'danger'
  }
};
