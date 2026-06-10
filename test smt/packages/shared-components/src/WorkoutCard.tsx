import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';

import { KineticBadge } from './KineticBadge';
import { kineticTheme } from './kineticTheme';

export interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  onPress?: () => void;
}

export function WorkoutCard({ title, durationInMinutes, difficulty, onPress }: WorkoutCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <KineticBadge label={difficulty} tone={difficultyTone[difficulty]} />
      </View>
      <Text style={styles.meta}>{formatWorkoutDuration(durationInMinutes)}</Text>
    </Pressable>
  );
}

const difficultyTone: Record<WorkoutDifficulty, 'success' | 'warning' | 'danger'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger'
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: kineticTheme.colors.surfaceContainerLow,
    borderColor: kineticTheme.colors.surfaceVariant,
    borderRadius: kineticTheme.radius.lg,
    borderWidth: 1,
    padding: kineticTheme.spacing.md,
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  title: {
    flex: 1,
    color: kineticTheme.colors.onSurface,
    fontSize: kineticTheme.typography.titleMD.fontSize,
    fontWeight: '800'
  },
  meta: {
    color: kineticTheme.colors.onSurfaceVariant,
    fontSize: kineticTheme.typography.bodySM.fontSize
  }
});
