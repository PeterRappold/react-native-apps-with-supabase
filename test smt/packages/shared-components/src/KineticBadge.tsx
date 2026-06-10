import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from './kineticTheme';

export interface KineticBadgeProps {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export function KineticBadge({ label, tone = 'default' }: KineticBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        tone === 'success' && styles.success,
        tone === 'warning' && styles.warning,
        tone === 'danger' && styles.danger
      ]}
    >
      <Text
        style={[
          styles.label,
          tone === 'success' && styles.successLabel,
          tone === 'warning' && styles.warningLabel,
          tone === 'danger' && styles.dangerLabel
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: kineticTheme.radius.pill,
    borderWidth: 1,
    borderColor: kineticTheme.colors.outlineVariant,
    backgroundColor: kineticTheme.colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  label: {
    color: kineticTheme.colors.onSurface,
    fontSize: 12,
    fontWeight: '800'
  },
  success: {
    backgroundColor: '#153b24',
    borderColor: '#2f7d4a'
  },
  warning: {
    backgroundColor: '#443814',
    borderColor: '#a18120'
  },
  danger: {
    backgroundColor: '#4a211c',
    borderColor: '#b05246'
  },
  successLabel: {
    color: '#9af2b3'
  },
  warningLabel: {
    color: '#ffe08a'
  },
  dangerLabel: {
    color: kineticTheme.colors.error
  }
});
