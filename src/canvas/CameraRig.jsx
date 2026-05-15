import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);
  const targetY = useRef(0);

  useFrame((s, delta) => {
    // Yield full control to OrbitControls when orbit mode is active
    if (snap.orbitEnabled) return;

    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }

    easing.damp3(s.camera.position, targetPosition, 0.25, delta);

    // Use state rotation (controlled by slider/buttons)
    targetY.current = snap.modelRotationY;

    if (group.current) {
      // smooth rotation towards target
      easing.dampE(
        group.current.rotation,
        [s.pointer.y / 10, targetY.current, 0],
        0.25,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;

