insert into public.workouts (title, difficulty, duration_in_minutes)
values
  ('Starter Session', 'Beginner', 20),
  ('Conditioning Block', 'Intermediate', 35)
on conflict do nothing;