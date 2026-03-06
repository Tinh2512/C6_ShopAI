import React from 'react';
import { ThemeProvider }     from './src/theme';
import { ProductListScreen } from './src/screens/ProductListScreen';

export default function App() {
  return (
    <ThemeProvider>
      <ProductListScreen />
    </ThemeProvider>
  );
}