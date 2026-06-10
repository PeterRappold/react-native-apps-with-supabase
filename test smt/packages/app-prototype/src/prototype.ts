import type { WorkoutSummary } from '@workout/shared-types';

export interface PrototypeStage {
  id: string;
  title: string;
  description: string;
}

export interface AppPrototypeSnapshot {
  name: string;
  headline: string;
  subheadline: string;
  prototypeNote: string;
  nextStep: string;
  workouts: WorkoutSummary[];
}

export interface AppPrototypeManifest {
  stages: PrototypeStage[];
  workoutApp: AppPrototypeSnapshot;
  adminApp: AppPrototypeSnapshot;
}

const workoutPrototypeWorkouts: WorkoutSummary[] = [
  {
    id: 'prototype-strength-001',
    title: 'Prototype Strength Flow',
    durationInMinutes: 35,
    difficulty: 'Beginner'
  },
  {
    id: 'prototype-cardio-002',
    title: 'Prototype Cardio Check',
    durationInMinutes: 25,
    difficulty: 'Intermediate'
  },
  {
    id: 'prototype-mobility-003',
    title: 'Prototype Mobility Review',
    durationInMinutes: 15,
    difficulty: 'Beginner'
  }
];

const adminPrototypeWorkouts: WorkoutSummary[] = [
  {
    id: 'admin-prototype-001',
    title: 'Admin Content Check',
    durationInMinutes: 30,
    difficulty: 'Beginner'
  },
  {
    id: 'admin-prototype-002',
    title: 'Plan Review Flow',
    durationInMinutes: 55,
    difficulty: 'Advanced'
  }
];

export const appPrototype: AppPrototypeManifest = {
  stages: [
    {
      id: 'prototype',
      title: 'Prototype',
      description: 'Ich baue zuerst eine schnelle Vorschau mit den wichtigsten Screens und Inhalten.'
    },
    {
      id: 'implementation',
      title: 'Implementation',
      description: 'Danach werden die echten React-Native-Komponenten und der App-Flow darauf aufgebaut.'
    },
    {
      id: 'storybook',
      title: 'Storybook',
      description: 'Jede Komponente bekommt eine Story und kann dort visuell geprüft werden.'
    }
  ],
  workoutApp: {
    name: 'Workout App',
    headline: 'Prototyp für Trainingsplaene, Sessions und Fortschritt.',
    subheadline: 'Die App orientiert sich zuerst am Prototypen und wird danach auf echte Daten und UI-Regeln erweitert.',
    prototypeNote: 'Der Workout-Flow hängt direkt an diesem Prototypen, damit Inhalte und Screens aus einer gemeinsamen Quelle kommen.',
    nextStep: 'Als Nächstes werden echte Datenquellen angebunden und die Screens weiter ausgearbeitet.',
    workouts: workoutPrototypeWorkouts
  },
  adminApp: {
    name: 'Workout Admin',
    headline: 'Prototyp für Login, Registrierung und Admin-Übersicht.',
    subheadline: 'Die Admin-App wird aus dem Prototypen heraus aufgebaut und übernimmt die Inhalte später in die echte Web-App.',
    prototypeNote: 'Dieser Prototyp bestimmt den ersten Flow für Auth, Dashboard und Health-Checks.',
    nextStep: 'Als Nächstes werden die Admin-Workflows mit echten Funktionen und Edge-Checks verbunden.',
    workouts: adminPrototypeWorkouts
  }
};

export const workoutPrototype = appPrototype.workoutApp;
export const adminPrototype = appPrototype.adminApp;
