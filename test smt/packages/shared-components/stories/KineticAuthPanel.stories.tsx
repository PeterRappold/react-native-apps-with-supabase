import type { Meta, StoryObj } from '@storybook/react';

import { KineticAuthPanel } from '../src/KineticAuthPanel';

const meta: Meta<typeof KineticAuthPanel> = {
  title: 'Workout/Organisms/AuthPanel',
  component: KineticAuthPanel,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof KineticAuthPanel>;

export const Login: Story = {
  args: {
    initialMode: 'login'
  }
};

export const Register: Story = {
  args: {
    initialMode: 'register'
  }
};

export const ErrorState: Story = {
  args: {
    initialMode: 'login',
    errorText: 'Login nicht gefunden. Bitte registrieren oder Daten pruefen.'
  }
};
