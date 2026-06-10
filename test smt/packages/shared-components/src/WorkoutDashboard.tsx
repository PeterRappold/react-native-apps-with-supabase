import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutSummary } from '@workout/shared-types';

import { KineticBadge } from './KineticBadge';
import { WorkoutCard } from './WorkoutCard';
import { kineticTheme } from './kineticTheme';

export interface WorkoutDashboardProps {
  title?: string;
  subtitle?: string;
  workouts?: WorkoutSummary[];
  emptyText?: string;
}

const defaultWorkouts: WorkoutSummary[] = [
  {
    id: 'strength-001',
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate'
  },
  {
    id: 'core-002',
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner'
  },
  {
    id: 'conditioning-003',
    title: 'Athlete Conditioning',
    durationInMinutes: 60,
    difficulty: 'Advanced'
  }
];

export function WorkoutDashboard({
  title = 'Workout Dashboard',
  subtitle = 'Trainingsplaene, Dauer und Schwierigkeit auf einen Blick.',
  workouts = defaultWorkouts,
  emptyText = 'Noch keine Workouts geplant.'
}: WorkoutDashboardProps) {
  return (
    <View style={styles.dashboard}>
      <View style={styles.header}>
        <KineticBadge label={`${workouts.length} Workouts`} tone={workouts.length > 0 ? 'success' : 'warning'} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {workouts.length > 0 ? (
        <View style={styles.list}>
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              title={workout.title}
              durationInMinutes={workout.durationInMinutes}
              difficulty={workout.difficulty}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Leerer Plan</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    width: '100%',
    maxWidth: 460,
    gap: 18,
    borderRadius: kineticTheme.radius.xl,
    borderWidth: 1,
    borderColor: kineticTheme.colors.surfaceVariant,
    backgroundColor: kineticTheme.colors.background,
    padding: 22
  },
  header: {
    gap: 10
  },
  title: {
    color: kineticTheme.colors.onBackground,
    fontSize: kineticTheme.typography.headlineLG.fontSize,
    lineHeight: kineticTheme.typography.headlineLG.lineHeight,
    fontWeight: '800'
  },
  subtitle: {
    color: kineticTheme.colors.onSurfaceVariant,
    fontSize: kineticTheme.typography.bodySM.fontSize,
    lineHeight: kineticTheme.typography.bodySM.lineHeight
  },
  list: {
    gap: 12
  },
  emptyState: {
    gap: 8,
    borderRadius: kineticTheme.radius.lg,
    borderWidth: 1,
    borderColor: kineticTheme.colors.outlineVariant,
    backgroundColor: kineticTheme.colors.surfaceContainerLow,
    padding: 18
  },
  emptyTitle: {
    color: kineticTheme.colors.onSurface,
    fontSize: kineticTheme.typography.titleMD.fontSize,
    lineHeight: kineticTheme.typography.titleMD.lineHeight,
    fontWeight: '800'
  },
  emptyText: {
    color: kineticTheme.colors.onSurfaceVariant,
    fontSize: kineticTheme.typography.bodySM.fontSize,
    lineHeight: kineticTheme.typography.bodySM.lineHeight
  }
});
