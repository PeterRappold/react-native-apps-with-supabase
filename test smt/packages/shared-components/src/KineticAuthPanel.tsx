import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { KineticButton } from './KineticButton';
import { KineticTextField } from './KineticTextField';
import { kineticTheme } from './kineticTheme';

export interface KineticAuthPanelProps {
  title?: string;
  subtitle?: string;
  initialMode?: 'login' | 'register';
  onLogin?: (payload: { email: string; password: string }) => void;
  onRegister?: (payload: { name: string; email: string; password: string }) => void;
  errorText?: string;
  loading?: boolean;
  adminHint?: {
    email: string;
    password: string;
  };
}

export function KineticAuthPanel({
  title = 'Anmelden oder registrieren',
  subtitle = 'Diese Web-Oberflaeche fuehlt sich wie die mobile App an: kompakt, zentriert und mit demselben Login-/Registry-Flow.',
  initialMode = 'login',
  onLogin,
  onRegister,
  errorText,
  loading = false,
  adminHint = {
    email: 'admin@admin.at',
    password: 'admin user'
  }
}: KineticAuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const buttonLabel = mode === 'login' ? 'Anmelden' : 'Registrieren';

  const canSubmit = useMemo(() => {
    // allow submitting even with empty fields to facilitate testing/prototyping
    return !loading;
  }, [loading]);

  function submit() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    if (mode === 'register') {
      if (onRegister) {
        onRegister({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });
        return;
      }

      // fallback: write to localStorage and create session so web prototype can use it
      try {
        const maybeWindow = globalThis as any;
        const usersRaw = maybeWindow?.window?.localStorage?.getItem('workout-app-users') ?? '[]';
        const users = JSON.parse(usersRaw || '[]');
        const nextUsers = users.filter((u: any) => u.email !== trimmedEmail).concat([{ name: trimmedName, email: trimmedEmail, password: trimmedPassword }]);
        maybeWindow?.window?.localStorage?.setItem('workout-app-users', JSON.stringify(nextUsers));
        maybeWindow?.window?.localStorage?.setItem('workout-app-session', JSON.stringify({ name: trimmedName, email: trimmedEmail }));
        if (maybeWindow?.window) {
          try { maybeWindow.window.location.href = '/dashboard'; } catch (e) {}
        }
      } catch (e) {
        // ignore fallback errors
      }

      return;
    }

    if (onLogin) {
      onLogin({ email: trimmedEmail, password: trimmedPassword });
      return;
    }

    // fallback login: accept any input (even empty). Create a sensible default session.
    try {
      const maybeWindow = globalThis as any;
      const nameFromEmail = (trimmedEmail.split('@')[0] || 'Athlet').replace(/[._-]/g, ' ').split(' ').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      const sessionEmail = trimmedEmail || '';
      maybeWindow?.window?.localStorage?.setItem('workout-app-session', JSON.stringify({ name: nameFromEmail, email: sessionEmail }));
      if (maybeWindow?.window) {
        try { maybeWindow.window.location.href = '/dashboard'; } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Workout Admin</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.segmentRow}>
        <Pressable onPress={() => setMode('login')} style={[styles.segmentButton, mode === 'login' && styles.segmentButtonActive]}>
          <Text style={[styles.segmentButtonText, mode === 'login' && styles.segmentButtonTextActive]}>Anmelden</Text>
        </Pressable>
        <Pressable onPress={() => setMode('register')} style={[styles.segmentButton, mode === 'register' && styles.segmentButtonActive]}>
          <Text style={[styles.segmentButtonText, mode === 'register' && styles.segmentButtonTextActive]}>Registrieren</Text>
        </Pressable>
      </View>

      {mode === 'register' ? (
        <KineticTextField label="Name" value={name} onChangeText={setName} placeholder="Max Mustermann" autoCapitalize="words" />
      ) : null}

      <KineticTextField label="E-Mail" value={email} onChangeText={setEmail} placeholder="name@beispiel.de" keyboardType="email-address" />

      <KineticTextField label="Passwort" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry errorText={errorText} />

      <KineticButton label={buttonLabel} onPress={submit} loading={loading} disabled={!canSubmit} />

      <View style={styles.adminHintBox}>
        <Text style={styles.adminHintTitle}>Vorgegebener Admin-Account</Text>
        <Text style={styles.adminHintText}>{adminHint.email}</Text>
        <Text style={styles.adminHintText}>{adminHint.password}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 16,
    backgroundColor: kineticTheme.colors.background,
    borderRadius: kineticTheme.radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: kineticTheme.colors.surfaceVariant,
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center'
  },
  header: {
    gap: 8
  },
  kicker: {
    color: kineticTheme.colors.primaryDim,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    fontWeight: '800'
  },
  title: {
    color: kineticTheme.colors.onBackground,
    fontSize: kineticTheme.typography.headlineLG.fontSize,
    lineHeight: kineticTheme.typography.headlineLG.lineHeight,
    fontWeight: '800'
  },
  subtitle: {
    color: kineticTheme.colors.onSurfaceVariant,
    lineHeight: 22,
    fontSize: kineticTheme.typography.bodySM.fontSize
  },
  adminHintBox: {
    gap: 4,
    borderRadius: kineticTheme.radius.lg,
    borderWidth: 1,
    borderColor: kineticTheme.colors.surfaceVariant,
    backgroundColor: kineticTheme.colors.surfaceContainerLow,
    padding: 14
  },
  adminHintTitle: {
    color: kineticTheme.colors.primaryDim,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontWeight: '800'
  },
  adminHintText: {
    color: kineticTheme.colors.onSurface,
    fontSize: 13,
    fontWeight: '700'
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 6,
    borderRadius: kineticTheme.radius.lg,
    backgroundColor: kineticTheme.colors.surfaceContainerLow
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: kineticTheme.radius.md,
    paddingVertical: 12
  },
  segmentButtonActive: {
    backgroundColor: kineticTheme.colors.surfaceContainerHigh
  },
  segmentButtonText: {
    color: kineticTheme.colors.onSurfaceVariant,
    fontWeight: '800'
  },
  segmentButtonTextActive: {
    color: kineticTheme.colors.onSurface
  }
});