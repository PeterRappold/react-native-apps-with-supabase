export function formatWorkoutDuration(durationInMinutes: number): string {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} min`;
  }

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}