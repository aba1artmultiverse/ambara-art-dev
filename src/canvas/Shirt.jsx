import { useEffect } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame, useThree } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';

// Pre-load
useGLTF.preload('/shirt_baked.glb');

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const { gl } = useThree();

  // Always load both textures (no conditional hooks)
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture  = useTexture(snap.fullDecal);

  useEffect(() => {
    if (logoTexture && gl?.capabilities) {
      logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture, gl]);

  useEffect(() => {
    if (fullTexture && gl?.capabilities) {
      fullTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      fullTexture.needsUpdate = true;
    }
  }, [fullTexture, gl]);

  useFrame((_s, delta) => {
    if (materials?.lambert1?.color) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    }
    // Keep emissive dark so shirt colour is visible, not dim
    if (materials?.lambert1) {
      materials.lambert1.roughness = 0.8;
      materials.lambert1.envMapIntensity = 0.4;
    }
  });

  return (
    <group>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} map={fullTexture} />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={snap.logoPosition}
            rotation={[0, 0, 0]}
            scale={snap.logoScale}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
