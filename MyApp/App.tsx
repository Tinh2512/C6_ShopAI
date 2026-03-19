import React from 'react';
import { ThemeProvider }  from './src/theme';
import { RootNavigator }  from './src/navigation/RootNavigator';
import { Toast }          from './src/components/base/Toast';

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
      <Toast />
    </ThemeProvider>
  );
}
