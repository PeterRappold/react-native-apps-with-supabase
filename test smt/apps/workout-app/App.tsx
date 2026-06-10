import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { appPrototype, workoutPrototype } from '@workout/app-prototype';
import { KineticAuthPanel, WorkoutCard, WorkoutDashboard } from '@workout/shared-components';

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';
type WorkoutRoute = 'dashboard' | 'plan' | 'health' | 'profile' | 'auth';

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

interface StoredSession {
  name: string;
  email: string;
}

interface WorkoutProgress {
  completed: string[];
  selectedWorkoutId: string | null;
}

const AUTH_USERS_KEY = 'workout-app-users';
const AUTH_SESSION_KEY = 'workout-app-session';
const WORKOUT_PROGRESS_KEY = 'workout-app-progress';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

function deriveDisplayName(email: string): string {
  const localPart = email.split('@')[0]?.trim() || 'Athlet';
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function safeReadJson<T>(key: string, fallback: T): T {
  const maybeWindow = globalThis as { window?: { localStorage?: Storage } };

  try {
    const rawValue = maybeWindow.window?.localStorage?.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown): void {
  const maybeWindow = globalThis as { window?: { localStorage?: Storage } };

  try {
    maybeWindow.window?.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // ignore environments without localStorage
  }
}

function updatePathname(pathname: string): void {
  const maybeWindow = globalThis as {
    window?: {
      history?: { pushState: (data: unknown, title: string, url?: string | URL | null) => void };
    };
  };

  if (!maybeWindow.window?.history?.pushState) {
    return;
  }

  maybeWindow.window.history.pushState({}, '', pathname);
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [authMessage, setAuthMessage] = useState('');
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgefuehrt.');
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<string[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const healthEndpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return null;
    }

    return `${supabaseUrl}/functions/v1/client-connection-check`;
  }, []);

  const workouts = workoutPrototype.workouts;
  const completedCount = completedWorkoutIds.length;
  const progressPercent = workouts.length > 0 ? Math.round((completedCount / workouts.length) * 100) : 0;
  const nextWorkout = workouts.find((workout) => !completedWorkoutIds.includes(workout.id)) ?? workouts[0];

  useEffect(() => {
    const maybeWindow = globalThis as {
      window?: {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    };

    const syncPath = () => setPathnameState(getCurrentPathname());

    maybeWindow.window?.addEventListener?.('popstate', syncPath);

    return () => {
      maybeWindow.window?.removeEventListener?.('popstate', syncPath);
    };
  }, []);

  useEffect(() => {
    const storedUsers = safeReadJson<StoredUser[]>(AUTH_USERS_KEY, []);
    const storedSession = safeReadJson<StoredSession | null>(AUTH_SESSION_KEY, null);
    const storedProgress = safeReadJson<WorkoutProgress>(WORKOUT_PROGRESS_KEY, { completed: [], selectedWorkoutId: null });

    setUsers(storedUsers);
    setSession(storedSession);
    setCompletedWorkoutIds(storedProgress.completed);
    setSelectedWorkoutId(storedProgress.selectedWorkoutId ?? workouts[0]?.id ?? null);
  }, [workouts]);

  useEffect(() => {
    const isPublicPage = pathname === '/auth' || pathname === '/health';

    if (!session && !isPublicPage) {
      setPathnameState('/auth');
      updatePathname('/auth');
    }
  }, [pathname, session]);

  useEffect(() => {
    safeWriteJson(WORKOUT_PROGRESS_KEY, {
      completed: completedWorkoutIds,
      selectedWorkoutId
    });
  }, [completedWorkoutIds, selectedWorkoutId]);

  function navigateTo(nextPathname: WorkoutRoute): void {
    setPathnameState(`/${nextPathname}`);
    updatePathname(`/${nextPathname}`);
  }

  function signOut(): void {
    safeWriteJson(AUTH_SESSION_KEY, null);
    setSession(null);
    setAuthMessage('');
    navigateTo('auth');
  }

  function handleLogin(payload: { email: string; password: string }): void {
    const email = (payload.email || '').trim().toLowerCase();
    const password = (payload.password || '').trim();

    // Accept any input (including empty). If no matching user, derive a display name.
    const matchedUser = users.find((user) => user.email === email);
    const nextSession: StoredSession = {
      name: matchedUser?.name ?? deriveDisplayName(email || ''),
      email: matchedUser?.email ?? email
    };

    safeWriteJson(AUTH_SESSION_KEY, nextSession);
    setSession(nextSession);
    setAuthMessage('Login erfolgreich.');
    navigateTo('dashboard');
  }

  function handleRegister(payload: { name: string; email: string; password: string }): void {
    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const password = (payload.password || '').trim();

    // Accept any input (including empty). Use sensible defaults when fields are missing.
    const finalName = name || deriveDisplayName(email || '');
    const finalEmail = email || '';
    const finalPassword = password || '';

    const nextUser: StoredUser = { name: finalName, email: finalEmail, password: finalPassword };
    const nextUsers = [...users.filter((user) => user.email !== finalEmail), nextUser];
    const nextSession: StoredSession = { name: finalName, email: finalEmail };

    safeWriteJson(AUTH_USERS_KEY, nextUsers);
    safeWriteJson(AUTH_SESSION_KEY, nextSession);

    setUsers(nextUsers);
    setSession(nextSession);
    setAuthMessage('Registrierung erfolgreich.');
    navigateTo('dashboard');
  }

  function toggleWorkoutCompletion(workoutId: string): void {
    setSelectedWorkoutId(workoutId);
    setCompletedWorkoutIds((currentCompletedIds) => {
      if (currentCompletedIds.includes(workoutId)) {
        return currentCompletedIds.filter((id) => id !== workoutId);
      }

      return [...currentCompletedIds, workoutId];
    });
  }

  async function runHealthCheck(): Promise<void> {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Workout-App konfigurieren.');
      return;
    }

    try {
      setHealthStatus('loading');
      setHealthMessage('Verbindung wird geprueft...');

      const response = await fetch(healthEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok || !payload.ok) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload.error ?? 'Health-Check fehlgeschlagen.');
        return;
      }

      setHealthStatus('healthy');
      setHealthMessage(payload.message ?? 'Verbindung zur Edge Function ist gesund.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('Verbindung konnte nicht hergestellt werden.');
    }
  }

  const activeRoute: WorkoutRoute = pathname === '/plan' || pathname === '/health' || pathname === '/profile' || pathname === '/auth' ? (pathname.slice(1) as WorkoutRoute) : 'dashboard';
  const isSignedIn = Boolean(session);
  const selectedWorkout = workouts.find((workout) => workout.id === selectedWorkoutId) ?? nextWorkout ?? workouts[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.brand}>Workout App</Text>
              <Text style={styles.title}>{isSignedIn ? `Hallo, ${session?.name}` : 'Train smart. Look sharp.'}</Text>
              <Text style={styles.subtitle}>Die App ist wieder funktional, sportlich und auf echte Nutzung ausgelegt.</Text>
            </View>

            <View style={styles.topBarMeta}>
              <Text style={styles.metaLabel}>{isSignedIn ? 'SIGNED IN' : 'GUEST MODE'}</Text>
              <Text style={styles.metaValue}>{isSignedIn ? session?.email : 'Login bereit'}</Text>
            </View>
          </View>

          {isSignedIn ? (
            <View style={styles.navigationRow}>
              <Pressable onPress={() => navigateTo('dashboard')} style={[styles.navButton, activeRoute === 'dashboard' && styles.navButtonActive]}>
                <Text style={[styles.navButtonText, activeRoute === 'dashboard' && styles.navButtonTextActive]}>Dashboard</Text>
              </Pressable>
              <Pressable onPress={() => navigateTo('plan')} style={[styles.navButton, activeRoute === 'plan' && styles.navButtonActive]}>
                <Text style={[styles.navButtonText, activeRoute === 'plan' && styles.navButtonTextActive]}>Plan</Text>
              </Pressable>
              <Pressable onPress={() => navigateTo('health')} style={[styles.navButton, activeRoute === 'health' && styles.navButtonActive]}>
                <Text style={[styles.navButtonText, activeRoute === 'health' && styles.navButtonTextActive]}>Health</Text>
              </Pressable>
              <Pressable onPress={() => navigateTo('profile')} style={[styles.navButton, activeRoute === 'profile' && styles.navButtonActive]}>
                <Text style={[styles.navButtonText, activeRoute === 'profile' && styles.navButtonTextActive]}>Profil</Text>
              </Pressable>
            </View>
          ) : null}

          {!isSignedIn ? (
            <View style={styles.authLayout}>
              <View style={styles.heroCard}>
                <Text style={styles.heroLabel}>Full-Fitness Experience</Text>
                <Text style={styles.heroTitle}>{workoutPrototype.headline}</Text>
                <Text style={styles.heroText}>Visuelle Vorlage als Referenz; die App zeigt das finale Design.</Text>

                <View style={styles.heroStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{workouts.length}</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{appPrototype.stages.length}</Text>
                    <Text style={styles.statLabel}>Phasen</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{progressPercent}%</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                  </View>
                </View>
              </View>

              <View style={styles.authCard}>
                <KineticAuthPanel
                  initialMode="login"
                  title="Workout Login"
                  subtitle="Melde dich an oder registriere dich mit beliebigen nicht-leeren Werten."
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  errorText={authMessage || undefined}
                />
              </View>
            </View>
          ) : (
            <>
              {activeRoute === 'dashboard' ? (
                <View style={styles.dashboardGrid}>
                  <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>Today</Text>
                    <Text style={styles.heroTitle}>{workoutPrototype.name}</Text>
                    <Text style={styles.heroText}>{workoutPrototype.headline}</Text>

                    <View style={styles.heroStats}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{progressPercent}%</Text>
                        <Text style={styles.statLabel}>Erledigt</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{completedCount}</Text>
                        <Text style={styles.statLabel}>Abgehakt</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{nextWorkout?.durationInMinutes ?? 0}m</Text>
                        <Text style={styles.statLabel}>Nächste Einheit</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.sectionLabel}>Aktueller Fokus</Text>
                    <Text style={styles.sectionTitle}>{selectedWorkout?.title ?? 'Kein Workout gewählt'}</Text>
                    <Text style={styles.sectionText}>
                      {selectedWorkout
                        ? `Dauer ${selectedWorkout.durationInMinutes} Minuten · Level ${selectedWorkout.difficulty}`
                        : 'Wähle ein Workout aus dem Plan.'}
                    </Text>
                    <Pressable onPress={() => navigateTo('plan')} style={styles.primaryAction}>
                      <Text style={styles.primaryActionText}>Plan öffnen</Text>
                    </Pressable>
                  </View>

                  <WorkoutDashboard workouts={workouts} />

                  <View style={styles.stageGrid}>
                    {appPrototype.stages.map((stage) => (
                      <View key={stage.id} style={styles.stageCard}>
                        <Text style={styles.stageTitle}>{stage.title}</Text>
                        <Text style={styles.stageText}>{stage.description}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {activeRoute === 'plan' ? (
                <View style={styles.planLayout}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.sectionLabel}>Trainingsplan</Text>
                    <Text style={styles.sectionTitle}>Deine Sessions</Text>
                    <Text style={styles.sectionText}>
                      Tippe auf ein Workout, um es als erledigt zu markieren oder neu auszuwählen.
                    </Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{completedCount} von {workouts.length} Workouts erledigt</Text>
                  </View>

                  <View style={styles.workoutList}>
                    {workouts.map((workout) => {
                      const isCompleted = completedWorkoutIds.includes(workout.id);
                      const isSelected = selectedWorkoutId === workout.id;

                      return (
                        <View key={workout.id} style={[styles.workoutRow, isSelected && styles.workoutRowSelected]}>
                          <WorkoutCard
                            title={workout.title}
                            durationInMinutes={workout.durationInMinutes}
                            difficulty={workout.difficulty}
                            onPress={() => toggleWorkoutCompletion(workout.id)}
                          />
                          <View style={styles.rowFooter}>
                            <Text style={styles.rowFooterText}>{isCompleted ? 'Erledigt' : 'Bereit zum Start'}</Text>
                            <Pressable onPress={() => setSelectedWorkoutId(workout.id)} style={styles.secondaryAction}>
                              <Text style={styles.secondaryActionText}>{isSelected ? 'Ausgewählt' : 'Auswählen'}</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {activeRoute === 'health' ? (
                <View style={styles.healthCard}>
                  <Text style={styles.sectionLabel}>System Check</Text>
                  <Text style={styles.sectionTitle}>Health Page</Text>
                  <Text style={styles.sectionText}>Prueft die Erreichbarkeit der Supabase Edge Function vom Workout-Client.</Text>
                  <Text style={styles.label}>Endpoint</Text>
                  <Text style={styles.endpointText}>{healthEndpoint ?? 'Nicht konfiguriert'}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.label}>Status</Text>
                    <Text
                      style={[
                        styles.statusPill,
                        healthStatus === 'healthy' && styles.statusHealthy,
                        healthStatus === 'unhealthy' && styles.statusUnhealthy,
                        healthStatus === 'loading' && styles.statusLoading
                      ]}
                    >
                      {healthStatus.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.healthMessage}>{healthMessage}</Text>
                  <Pressable onPress={runHealthCheck} style={styles.primaryAction}>
                    <Text style={styles.primaryActionText}>Health-Check ausfuehren</Text>
                  </Pressable>
                </View>
              ) : null}

              {activeRoute === 'profile' ? (
                <View style={styles.profileLayout}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.sectionLabel}>Profil</Text>
                    <Text style={styles.sectionTitle}>{session?.name}</Text>
                    <Text style={styles.sectionText}>{session?.email}</Text>
                    <Text style={styles.label}>Gespeicherte User</Text>
                    <Text style={styles.sectionText}>{users.length}</Text>
                    <Pressable onPress={signOut} style={styles.secondaryAction}>
                      <Text style={styles.secondaryActionText}>Abmelden</Text>
                    </Pressable>
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.sectionLabel}>Konzept</Text>
                    <Text style={styles.sectionTitle}>Design First</Text>
                    <Text style={styles.sectionText}>Design-getriebener Entwicklungsansatz: vom visuellen Entwurf zur fertigen App.</Text>
                  </View>
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111f'
  },
  backgroundOrbTop: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: 'rgba(34, 197, 94, 0.18)'
  },
  backgroundOrbBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(59, 130, 246, 0.16)'
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 32
  },
  shell: {
    gap: 18,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center'
  },
  topBar: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)'
  },
  brand: {
    color: '#7dd3fc',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 11,
    fontWeight: '800'
  },
  title: {
    marginTop: 6,
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 6,
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 760
  },
  topBarMeta: {
    alignItems: 'flex-start',
    gap: 6
  },
  metaLabel: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1
  },
  metaValue: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700'
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  navButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)'
  },
  navButtonActive: {
    backgroundColor: '#e2e8f0',
    borderColor: '#e2e8f0'
  },
  navButtonText: {
    color: '#cbd5e1',
    fontWeight: '700'
  },
  navButtonTextActive: {
    color: '#0f172a'
  },
  authLayout: {
    gap: 18,
    flexDirection: 'column'
  },
  dashboardGrid: {
    gap: 18
  },
  planLayout: {
    gap: 18
  },
  profileLayout: {
    gap: 18,
    flexDirection: 'column'
  },
  heroCard: {
    gap: 12,
    padding: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)'
  },
  heroLabel: {
    color: '#fbbf24',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 11,
    fontWeight: '800'
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900'
  },
  heroText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 760
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6
  },
  statCard: {
    minWidth: 120,
    flexGrow: 1,
    gap: 4,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(30, 41, 59, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900'
  },
  statLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700'
  },
  authCard: {
    borderRadius: 28,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)'
  },
  summaryCard: {
    gap: 10,
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)'
  },
  sectionLabel: {
    color: '#7dd3fc',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    fontWeight: '800'
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900'
  },
  sectionText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21
  },
  primaryAction: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#22c55e'
  },
  primaryActionText: {
    color: '#052e16',
    fontWeight: '900'
  },
  secondaryAction: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.14)'
  },
  secondaryActionText: {
    color: '#e2e8f0',
    fontWeight: '800'
  },
  stageGrid: {
    gap: 12,
    flexDirection: 'column'
  },
  stageCard: {
    gap: 6,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)'
  },
  stageTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900'
  },
  stageText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20
  },
  workoutList: {
    gap: 14
  },
  workoutRow: {
    gap: 10
  },
  workoutRowSelected: {
    transform: [{ scale: 1 }]
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4
  },
  rowFooterText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700'
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22c55e'
  },
  progressText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700'
  },
  healthCard: {
    gap: 14,
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)'
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#94a3b8',
    fontWeight: '800'
  },
  endpointText: {
    fontSize: 14,
    color: '#f8fafc'
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#e2e8f0',
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    fontWeight: '800'
  },
  statusHealthy: {
    backgroundColor: 'rgba(34, 197, 94, 0.22)',
    color: '#86efac'
  },
  statusUnhealthy: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5'
  },
  statusLoading: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#fcd34d'
  },
  healthMessage: {
    fontSize: 14,
    color: '#e2e8f0'
  }
});