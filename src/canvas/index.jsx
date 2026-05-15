import { Canvas } from '@react-three/fiber';
import { Center, Environment, Preload, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { Suspense } from 'react';
import Shirt from './Shirt';
import HoodieInner from './Hoodie';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import state from '../store';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: 'high-performance' }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      {/* Bright neutral lighting so shirt colour is clearly visible */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[0, 3, 5]}  intensity={2.0} castShadow />
      <directionalLight position={[-3, 2, 2]} intensity={0.8} />
      <directionalLight position={[3, -1, 2]} intensity={0.5} />
      <hemisphereLight skyColor="#ffffff" groundColor="#888888" intensity={0.8} />

      {/* OrbitControls: free exploration mode — drag to orbit, scroll/pinch to zoom */}
      <OrbitControls
        enabled={snap.orbitEnabled}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        minDistance={1.2}
        maxDistance={6}
        enablePan={false}
        touches={{
          ONE: 1, /* ROTATE */
          TWO: 512, /* DOLLY_PAN — pinch zoom */
        }}
      />

      <CameraRig>
        <Backdrop />
        <Center>
          <Suspense fallback={null}>
            {snap.activeMerch === 'hoodie' ? <HoodieInner /> : <Shirt />}
          </Suspense>
        </Center>
      </CameraRig>

      <Preload all />
    </Canvas>
  );
};

export default CanvasModel;
