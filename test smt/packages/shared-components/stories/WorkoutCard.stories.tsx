import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutCard } from '../src';

const meta: Meta<typeof WorkoutCard> = {
  title: 'Workout/Molecules/WorkoutCard',
  component: WorkoutCard,
  args: {
    title: 'Full Body Session',
    durationInMinutes: 40,
    difficulty: 'Intermediate'
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof WorkoutCard>;

export const Default: Story = {};

export const Beginner: Story = {
  args: {
    title: 'Mobility Warmup',
    durationInMinutes: 15,
    difficulty: 'Beginner'
  }
};

export const Advanced: Story = {
  args: {
    title: 'Athlete Conditioning',
    durationInMinutes: 60,
    difficulty: 'Advanced'
  }
};
