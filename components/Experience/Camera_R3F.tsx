import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function Camera({ position, target, aspect }: { position: THREE.Vector3, target: THREE.Vector3, aspect: number }) {
  const { set, camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = new THREE.PerspectiveCamera(
      25,
      aspect,
      0.01,
      1000
    );

    perspectiveCamera.position.copy(position);
    perspectiveCamera.lookAt(target);
    perspectiveCamera.updateProjectionMatrix();

    set({ camera: perspectiveCamera });
  }, []);

  useEffect(() => {
    camera.lookAt(target);
  }, [target]);

  useEffect(() => {
    (camera as THREE.PerspectiveCamera).aspect = aspect;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [aspect])

  return null;
}
