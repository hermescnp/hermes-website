import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const HologramEffect: React.FC = () => {
  const { nodes, materials } = useGLTF('/models/VR-Headset.glb');

  // Create a ref for the VR-Headset group.
  const headsetRef = useRef<THREE.Group>(null);

  const gradientTexture = useMemo(() => {
    // Create a canvas with extra height to accommodate a vertical gradient.
    const canvas = document.createElement('canvas');
    canvas.width = 512;  // Width for one horizontal cycle
    canvas.height = 256; // Height for a smooth vertical gradient
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 1. Draw the horizontal mosaic gradient over the entire canvas.
      const horizGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      horizGradient.addColorStop(0, 'lightblue');      
      horizGradient.addColorStop(0.33, '#68DBFF');        
      horizGradient.addColorStop(0.66, 'rgba(200,200,255,0)');   
      horizGradient.addColorStop(1, 'lightblue');        
      ctx.fillStyle = horizGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Create a vertical gradient mask:
      ctx.globalCompositeOperation = 'destination-in';
      const vertGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      vertGradient.addColorStop(0, 'rgba(255,255,255,1)');
      vertGradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = vertGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(8, 1);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Animate the texture offset, rotation, and levitation.
  useFrame((state, delta) => {
    // Animate the texture offset.
    gradientTexture.offset.x += delta * 0.3;

    if (headsetRef.current) {
      // Smoothly rotate around the Y axis.
      headsetRef.current.rotation.y += delta * 0.3; // Adjust rotation speed as needed

      // Smoothly levitate up and down using a sine wave.
      // The sine function uses elapsedTime to ensure continuous movement.
      const amplitude = 0.05; // Adjust amplitude for vertical range
      const frequency = 1;   // Adjust frequency for speed of levitation
      const baseY = 1.1;     // The initial Y position
      headsetRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * frequency) * amplitude;
    }
  });

  return (
    <group dispose={null}>
      {/* Attach the ref to the VR-Headset group */}
      <group ref={headsetRef} name="VR-Headset" position={[-1.89, 1.1, 1.22]}>
        <mesh
          geometry={(nodes['vr-head-display'] as THREE.Mesh).geometry}
          material={materials['Material']}
          position={[-0.15, 0, 0]}
        />
        <mesh
          geometry={(nodes['vr-head-strap'] as THREE.Mesh).geometry}
          material={materials['Material.040']}
          position={[0.05, 0, 0]}
        />
      </group>
      <mesh
        geometry={(nodes['Hologram_effect'] as THREE.Mesh).geometry}
        position={[-1.89, 0.71, 1.22]}
        scale={0.37}
      >
        <meshBasicMaterial
          side={THREE.DoubleSide}
          map={gradientTexture}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

export default HologramEffect;
