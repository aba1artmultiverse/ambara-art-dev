import { Suspense, lazy } from 'react';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';

// Lazy-load Dither so it doesn't block on initial render
const Dither = lazy(() => import('./components/Dither'));

function App() {
  return (
    <>
      {/* Dither animated background — its own isolated Canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Suspense fallback={<div style={{ background: '#030008', position: 'fixed', inset: 0 }} />}>
          <Dither
            waveColor={[0.18, 0.04, 0.35]}
            waveSpeed={0.04}
            waveFrequency={2.8}
            waveAmplitude={0.28}
            colorNum={14}
            pixelSize={3}
            enableMouseInteraction={true}
            mouseRadius={0.28}
          />
        </Suspense>
      </div>

      <main className="app" style={{ position: 'relative', zIndex: 1 }}>
        <Home />
        <Canvas />
        <Customizer />
      </main>
    </>
  );
}

export default App;
