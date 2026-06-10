import type { Meta, StoryObj } from '@storybook/react';

import { KineticTextField } from '../src/KineticTextField';

const meta: Meta<typeof KineticTextField> = {
  title: 'Workout/Atoms/KineticTextField',
  component: KineticTextField,
  args: {
    label: 'Passwort',
    value: '123',
    placeholder: '"name@example.com"',
    errorText: undefined,
    helperText: undefined,
    secureTextEntry: true
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof KineticTextField>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: {
    label: 'E-Mail',
    value: 'admin@admin.at',
    helperText: 'Wir senden dir keinen Spam.',
    secureTextEntry: false,
    keyboardType: 'email-address'
  }
};

export const ErrorState: Story = {
  args: {
    errorText: 'Passwort muss mindestens 8 Zeichen haben.'
  }
};

export const Disabled: Story = {
  args: {
    value: 'gesperrt',
    disabled: true
  }
};

export const EmailField: Story = {
  args: {
    label: 'E-Mail',
    value: 'test@example.com',
    keyboardType: 'email-address'
  }
};
