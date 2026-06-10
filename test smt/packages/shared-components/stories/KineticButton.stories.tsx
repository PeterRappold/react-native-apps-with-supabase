import type { Meta, StoryObj } from '@storybook/react';

import { KineticButton } from '../src/KineticButton';

const meta: Meta<typeof KineticButton> = {
  title: 'Workout/Atoms/KineticButton',
  component: KineticButton,
  args: {
    label: 'Anmelden'
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof KineticButton>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Abbrechen',
    variant: 'secondary'
  }
};

export const Ghost: Story = {
  args: {
    label: 'Mehr Optionen',
    variant: 'ghost'
  }
};

export const Loading: Story = {
  args: {
    label: 'Lade...',
    loading: true
  }
};
