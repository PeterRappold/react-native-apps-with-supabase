export const kineticColors = {
  background: '#141408',
  surfaceContainerLow: '#1d1c10',
  surfaceContainer: '#212013',
  surfaceContainerHigh: '#2b2b1d',
  surfaceVariant: '#363527',
  surfaceBright: '#3b3a2b',
  outline: '#949277',
  outlineVariant: '#494832',
  onBackground: '#e6e3ce',
  onSurface: '#e6e3ce',
  onSurfaceVariant: '#cbc8ab',
  primary: '#ede900',
  primaryDim: '#d0cc00',
  onPrimary: '#1d1d00',
  secondary: '#a4c9ff',
  tertiary: '#99f1f3',
  error: '#ffb4ab'
} as const;

export const kineticSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  containerMargin: 24,
  inlineGap: 16,
  stackGap: 24,
  cardPadding: 16
} as const;

export const kineticRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999
} as const;

export const kineticTypography = {
  displayXL: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.64
  },
  headlineLG: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.24
  },
  titleMD: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700' as const
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const
  },
  bodySM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const
  },
  labelCaps: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const
  }
} as const;

export const kineticTheme = {
  colors: kineticColors,
  spacing: kineticSpacing,
  radius: kineticRadius,
  typography: kineticTypography
} as const;

export type KineticTheme = typeof kineticTheme;