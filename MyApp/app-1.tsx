import React from 'react';
import { ThemeProvider } from './src/theme';
import { LoginScreen }   from './src/screens/LoginScreen';

export default function App() {
  return (
    <ThemeProvider>
      <LoginScreen />
    </ThemeProvider>
  );
}
