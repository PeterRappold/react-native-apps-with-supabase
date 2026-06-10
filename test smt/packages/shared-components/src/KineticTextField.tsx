import { StyleSheet, Text, TextInput, View } from 'react-native';

import { kineticTheme } from './kineticTheme';

export interface KineticTextFieldProps {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function KineticTextField({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  errorText,
  secureTextEntry = false,
  disabled = false,
  keyboardType = 'default',
  autoCapitalize = 'none'
}: KineticTextFieldProps) {
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={kineticTheme.colors.onSurfaceVariant}
        style={[styles.input, hasError && styles.inputError, disabled && styles.inputDisabled]}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      {!errorText && helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%'
  },
  label: {
    color: kineticTheme.colors.primaryDim,
    fontSize: kineticTheme.typography.bodySM.fontSize,
    fontWeight: '700'
  },
  input: {
    minHeight: 42,
    borderRadius: kineticTheme.radius.lg,
    paddingHorizontal: kineticTheme.spacing.md,
    paddingVertical: kineticTheme.spacing.sm,
    backgroundColor: kineticTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: kineticTheme.colors.surfaceVariant,
    color: kineticTheme.colors.onSurface,
    fontSize: kineticTheme.typography.bodyBase.fontSize,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4
    }
  },
  inputError: {
    borderColor: '#ffae9d',
    shadowOpacity: 0.12
  },
  inputDisabled: {
    opacity: 0.6
  },
  helperText: {
    color: kineticTheme.colors.onSurfaceVariant,
    fontSize: 12
  },
  errorText: {
    color: '#ffad9b',
    fontSize: 12,
    marginTop: 2
  }
});