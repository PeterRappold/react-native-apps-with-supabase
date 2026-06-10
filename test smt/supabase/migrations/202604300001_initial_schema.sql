create schema if not exists api;

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  duration_in_minutes integer not null check (duration_in_minutes > 0),
  created_at timestamptz not null default now()
);

create or replace function api.create_workout(
  workout_title text,
  workout_difficulty text,
  workout_duration_in_minutes integer
)
returns public.workouts
language plpgsql
security definer
as $$
declare
  created_workout public.workouts;
begin
  if workout_title is null or length(trim(workout_title)) = 0 then
    raise exception 'Workout title must not be empty';
  end if;

  if workout_duration_in_minutes is null or workout_duration_in_minutes <= 0 then
    raise exception 'Workout duration must be greater than zero';
  end if;

  insert into public.workouts (title, difficulty, duration_in_minutes)
  values (trim(workout_title), workout_difficulty, workout_duration_in_minutes)
  returning * into created_workout;

  return created_workout;
end;
$$;