import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { adminPrototype, appPrototype } from '@workout/app-prototype';
import { KineticAuthPanel, WorkoutCard } from '@workout/shared-components';

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

interface StoredSession {
  name: string;
  email: string;
}

function deriveDisplayName(email: string): string {
  const localPart = email.split('@')[0]?.trim() || 'User';
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const DEFAULT_ADMIN_USER: StoredUser = {
  name: 'Admin',
  email: 'admin@admin.at',
  password: 'admin user'
};

const AUTH_USERS_KEY = 'workout-admin-users';
const AUTH_SESSION_KEY = 'workout-admin-session';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
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

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());

  const setPathname = (newPath: string) => {
    setPathnameState(newPath);
    updatePathname(newPath);
  };
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [authMessage, setAuthMessage] = useState('');
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgefuehrt.');

  const healthEndpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:4000';
    return `${supabaseUrl}/functions/v1/client-connection-check`;
  }, []);

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
    const nextUsers = [DEFAULT_ADMIN_USER, ...storedUsers.filter((user) => user.email !== DEFAULT_ADMIN_USER.email)];

    setUsers(nextUsers);
    safeWriteJson(AUTH_USERS_KEY, nextUsers);
    setSession(safeReadJson<StoredSession | null>(AUTH_SESSION_KEY, null));
  }, []);

  useEffect(() => {
    if (!session && pathname !== '/health' && pathname !== '/auth') {
      setPathname('/auth');
    }

    if (session && pathname === '/auth') {
      setPathname('/dashboard');
    }
  }, [pathname, session]);

  function signOut() {
    safeWriteJson(AUTH_SESSION_KEY, null);
    setSession(null);
    setAuthMessage('');
    setPathname('/auth');
  }

  function handleLogin(payload: { email: string; password: string }) {
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
    setPathname('/dashboard');
  }

  function handleRegister(payload: { name: string; email: string; password: string }) {
    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const password = (payload.password || '').trim();

    // Accept any input; use defaults when missing
    const finalName = name || deriveDisplayName(email || '');
    const finalEmail = email || '';
    const finalPassword = password || '';

    const nextUser: StoredUser = { name: finalName, email: finalEmail, password: finalPassword };
    const nextUsers = [...users.filter((user) => user.email !== finalEmail), nextUser];
    const nextSession: StoredSession = { name: nextUser.name, email: nextUser.email };

    safeWriteJson(AUTH_USERS_KEY, nextUsers);
    safeWriteJson(AUTH_SESSION_KEY, nextSession);

    setUsers(nextUsers);
    setSession(nextSession);
    setAuthMessage('Registrierung erfolgreich. Du bist jetzt angemeldet.');
    setPathname('/dashboard');
  }

  async function runHealthCheck() {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Admin-App konfigurieren.');
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

  const isHealthPage = pathname === '/health';
  const isDashboardPage = pathname === '/dashboard';
  const isSignedIn = Boolean(session);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardShell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneHeader}>
              <View>
                <Text style={styles.brandKicker}>Workout Admin</Text>
                <Text style={styles.phoneTitle}>{isSignedIn ? `Hallo, ${session?.name}` : 'Mobile Web Experience'}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{isSignedIn ? 'SIGNED IN' : 'GUEST'}</Text>
              </View>
            </View>

            {!isSignedIn ? (
              <View style={styles.authCard}>
                <View style={styles.prototypeCard}>
                  <Text style={styles.prototypeLabel}>Design Source</Text>
                  <Text style={styles.prototypeTitle}>{adminPrototype.name}</Text>
                  <Text style={styles.prototypeText}>Visuelle Vorlage (Referenz, nicht Teil der Live-App).</Text>
                </View>
                <KineticAuthPanel
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  errorText={authMessage || undefined}
                  adminHint={{ email: DEFAULT_ADMIN_USER.email, password: DEFAULT_ADMIN_USER.password }}
                />
              </View>
            ) : (
              <>
                <View style={styles.navigationRow}>
                  <Pressable
                    onPress={() => setPathname('/dashboard')}
                    style={[styles.navButton, isDashboardPage && !isHealthPage && styles.navButtonActive]}
                  >
                    <Text style={[styles.navButtonText, isDashboardPage && !isHealthPage && styles.navButtonTextActive]}>Dashboard</Text>
                  </Pressable>
                  <Pressable onPress={() => setPathname('/health')} style={[styles.navButton, isHealthPage && styles.navButtonActive]}>
                    <Text style={[styles.navButtonText, isHealthPage && styles.navButtonTextActive]}>Health</Text>
                  </Pressable>
                  <Pressable onPress={signOut} style={styles.navButtonGhost}>
                    <Text style={styles.navButtonGhostText}>Logout</Text>
                  </Pressable>
                </View>

                {!isHealthPage ? (
                  <>
                    <View style={styles.heroCard}>
                      <Text style={styles.heroLabel}>Prototype-driven</Text>
                      <Text style={styles.heroTitle}>{adminPrototype.headline}</Text>
                      <Text style={styles.heroText}>{adminPrototype.subheadline}</Text>
                    </View>

                    <Text style={styles.prototypeHint}>{adminPrototype.prototypeNote}</Text>

                    <View style={styles.stageRow}>
                      {appPrototype.stages.map((stage) => (
                        <View key={stage.id} style={styles.stageCard}>
                          <Text style={styles.stageTitle}>{stage.title}</Text>
                          <Text style={styles.stageText}>{stage.description}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.grid}>
                      {adminPrototype.workouts.map((workout) => (
                        <WorkoutCard
                          key={workout.id}
                          title={workout.title}
                          durationInMinutes={workout.durationInMinutes}
                          difficulty={workout.difficulty}
                        />
                      ))}
                    </View>

                    <Text style={styles.prototypeHint}>{adminPrototype.nextStep}</Text>
                  </>
                ) : (
                  <View style={styles.healthCard}>
                    <Text style={styles.heading}>Health Page</Text>
                    <Text style={styles.subheading}>Prueft die Erreichbarkeit der Supabase Edge Function vom Admin-Client.</Text>
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
                    <Pressable onPress={runHealthCheck} style={styles.healthButton}>
                      <Text style={styles.healthButtonText}>Health-Check ausfuehren</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  keyboardShell: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: 'rgba(250, 204, 21, 0.12)'
  },
  backgroundGlowBottom: {
    position: 'absolute',
    right: -120,
    bottom: -120,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(56, 189, 248, 0.14)'
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 36,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 18
    },
    elevation: 12,
    padding: 18,
    gap: 18
  },
  phoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  phoneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  brandKicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#64748b',
    fontWeight: '800'
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e2e8f0'
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.9
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  navButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff'
  },
  navButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a'
  },
  navButtonGhost: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff1f2'
  },
  navButtonText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13
  },
  navButtonTextActive: {
    color: '#ffffff'
  },
  navButtonGhostText: {
    color: '#9f1239',
    fontWeight: '700',
    fontSize: 13
  },
  authCard: {
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  prototypeCard: {
    gap: 8,
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  prototypeLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#b45309',
    fontWeight: '800'
  },
  prototypeTitle: {
    color: '#0f172a',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800'
  },
  prototypeText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22
  },
  heroCard: {
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10
    }
  },
  heroLabel: {
    color: '#fde68a',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    fontWeight: '800'
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800'
  },
  heroText: {
    color: '#cbd5e1',
    lineHeight: 22,
    fontSize: 14
  },
  stageRow: {
    gap: 12
  },
  stageCard: {
    gap: 6,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  stageTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800'
  },
  stageText: {
    color: '#475569',
    lineHeight: 20,
    fontSize: 14
  },
  prototypeHint: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20
  },
  grid: {
    gap: 16,
    width: '100%'
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a'
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569'
  },
  healthCard: {
    gap: 14,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6b7280',
    fontWeight: '700'
  },
  endpointText: {
    fontSize: 14,
    color: '#111827'
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
    color: '#374151',
    backgroundColor: '#e5e7eb',
    fontWeight: '700'
  },
  statusHealthy: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  statusUnhealthy: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  statusLoading: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  healthMessage: {
    fontSize: 14,
    color: '#1f2937'
  },
  healthButton: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start'
  },
  healthButtonText: {
    color: '#ecfeff',
    fontWeight: '700'
  }
});
