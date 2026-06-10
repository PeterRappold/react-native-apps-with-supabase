import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { kineticTheme } from './kineticTheme';

export interface KineticButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export function KineticButton({ label, onPress, variant = 'primary', loading = false, disabled = false }: KineticButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed
      ]}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? kineticTheme.colors.onPrimary : kineticTheme.colors.onBackground} /> : null}
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.primaryLabel,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel,
          loading && styles.loadingLabel
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: kineticTheme.radius.lg,
    paddingHorizontal: kineticTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%'
  },
  primary: {
    backgroundColor: kineticTheme.colors.primary
  },
  secondary: {
    backgroundColor: kineticTheme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: kineticTheme.colors.outlineVariant
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: kineticTheme.colors.outlineVariant
  },
  disabled: {
    opacity: 0.6
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  label: {
    fontSize: kineticTheme.typography.bodySM.fontSize,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  primaryLabel: {
    color: kineticTheme.colors.onPrimary
  },
  secondaryLabel: {
    color: kineticTheme.colors.onSurface
  },
  ghostLabel: {
    color: kineticTheme.colors.onSurfaceVariant
  },
  loadingLabel: {
    opacity: 0.8
  }
});