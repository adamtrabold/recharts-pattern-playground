import React from 'react';
import { PaletteProvider } from '../context/PaletteContext';
import Header from './Header';
import PaletteEditor from './PaletteEditor';
import ChartGrid from './ChartGrid';
import ChartSettings from './ChartSettings';

function AppContent() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="wrap dashboard">
        <PaletteEditor />
        <ChartGrid />
      </main>
    </>
  );
}

export function App() {
  return (
    <PaletteProvider>
      <AppContent />
    </PaletteProvider>
  );
}

export default App;
