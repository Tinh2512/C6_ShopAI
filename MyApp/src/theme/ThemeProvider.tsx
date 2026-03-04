import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './tokens';

// ─────────────────────────────────────────────
// Theme shape
// ─────────────────────────────────────────────
export interface Theme {
  dark: boolean;

  colors: {
    // Surfaces
    background:       string;
    surface:          string;
    surfaceVariant:   string;
    // Brand
    primary:          string;
    primaryLight:     string;
    primaryDark:      string;
    secondary:        string;
    // Text
    textPrimary:      string;
    textSecondary:    string;
    textDisabled:     string;
    textInverse:      string;
    // Border
    border:           string;
    borderFocus:      string;
    // Semantic
    success:          string;
    successLight:     string;
    error:            string;
    errorLight:       string;
    warning:          string;
    warningLight:     string;
    info:             string;
    infoLight:        string;
    // Overlay
    overlay:          string;
  };

  typography:    typeof typography;
  spacing:       typeof spacing;
  borderRadius:  typeof borderRadius;
  shadows:       typeof shadows;
}

// ─────────────────────────────────────────────
// Light theme
// ─────────────────────────────────────────────
const lightTheme: Theme = {
  dark: false,
  colors: {
    background:      colors.neutral[50],
    surface:         colors.neutral[0],
    surfaceVariant:  colors.neutral[100],

    primary:         colors.primary[600],
    primaryLight:    colors.primary[100],
    primaryDark:     colors.primary[800],
    secondary:       colors.secondary[600],

    textPrimary:     colors.neutral[900],
    textSecondary:   colors.neutral[500],
    textDisabled:    colors.neutral[300],
    textInverse:     colors.neutral[0],

    border:          colors.neutral[200],
    borderFocus:     colors.primary[500],

    success:         colors.success.main,
    successLight:    colors.success.light,
    error:           colors.error.main,
    errorLight:      colors.error.light,
    warning:         colors.warning.main,
    warningLight:    colors.warning.light,
    info:            colors.info.main,
    infoLight:       colors.info.light,

    overlay:         'rgba(0,0,0,0.4)',
  },
  typography,
  spacing,
  borderRadius,
  shadows,
};

// ─────────────────────────────────────────────
// Dark theme
// ─────────────────────────────────────────────
const darkTheme: Theme = {
  dark: true,
  colors: {
    background:      colors.neutral[950],
    surface:         colors.neutral[900],
    surfaceVariant:  colors.neutral[800],

    primary:         colors.primary[400],
    primaryLight:    colors.primary[900],
    primaryDark:     colors.primary[300],
    secondary:       colors.secondary[400],

    textPrimary:     colors.neutral[50],
    textSecondary:   colors.neutral[400],
    textDisabled:    colors.neutral[700],
    textInverse:     colors.neutral[900],

    border:          colors.neutral[700],
    borderFocus:     colors.primary[400],

    success:         colors.success.main,
    successLight:    '#14532d',
    error:           colors.error.main,
    errorLight:      '#7f1d1d',
    warning:         colors.warning.main,
    warningLight:    '#713f12',
    info:            colors.info.main,
    infoLight:       '#1e3a8a',

    overlay:         'rgba(0,0,0,0.6)',
  },
  typography,
  spacing,
  borderRadius,
  shadows,
};

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const isDark = override ? override === 'dark' : systemScheme === 'dark';
  const theme  = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setOverride(prev =>
    prev === null ? (isDark ? 'light' : 'dark') : prev === 'dark' ? 'light' : 'dark'
  );

  const value = useMemo(() => ({ theme, toggleTheme, isDark }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
