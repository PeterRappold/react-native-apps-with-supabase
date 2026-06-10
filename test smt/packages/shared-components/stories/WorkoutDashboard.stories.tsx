import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutDashboard } from '../src/WorkoutDashboard';

const meta: Meta<typeof WorkoutDashboard> = {
  title: 'Workout/Organisms/WorkoutDashboard',
  component: WorkoutDashboard,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof WorkoutDashboard>;

export const Default: Story = {};

export const EmptyState: Story = {
  args: {
    workouts: []
  }
};
