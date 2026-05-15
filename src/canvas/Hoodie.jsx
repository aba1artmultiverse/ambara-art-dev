import { useEffect, useMemo } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame, useThree } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import state from '../store';

// Pre-load so it's ready
useGLTF.preload('/hoodie.glb');

const HoodieInner = () => {
  const snap = useSnapshot(state);
  const { gl } = useThree();
  const gltf = useGLTF('/hoodie.glb');

  // Always call hooks at top level
  const logoTexture = useTexture(snap.logoDecal);

  useEffect(() => {
    if (logoTexture && gl?.capabilities) {
      logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture, gl]);

  // Find first mesh and material
  const { mesh, mat } = useMemo(() => {
    const meshKey = Object.keys(gltf.nodes).find(k => gltf.nodes[k].isMesh);
    if (!meshKey) return { mesh: null, mat: null };
    const m = gltf.nodes[meshKey];
    const matKey = Object.keys(gltf.materials)[0];
    // Clone material so we can mutate it
    const material = gltf.materials[matKey]
      ? gltf.materials[matKey].clone()
      : new THREE.MeshStandardMaterial({ color: snap.color });
    material.roughness = 0.85;
    return { mesh: m, mat: material };
  }, [gltf]);

  useFrame((_s, delta) => {
    if (mat?.color) easing.dampC(mat.color, snap.color, 0.25, delta);
  });

  if (!mesh || !mat) return null;

  return (
    <group>
      <mesh castShadow geometry={mesh.geometry} material={mat} dispose={null}>
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

export default HoodieInner;
