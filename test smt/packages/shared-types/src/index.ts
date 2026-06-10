export type WorkoutDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface WorkoutSummary {
  id: string;
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
}