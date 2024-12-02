import React, { useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceContext } from '@/context/ExperienceContext';

type GLTFResult = {
  scene: THREE.Group;
};

const SceneModel: React.FC = () => {
  // Access the ExperienceContext for loading state updates
  const { setLoadingState, setLoadingProgress } = useExperienceContext();

  // Monitor loading progress
  const { active, progress, loaded, total } = useProgress();

  // Report loading progress to context
  useEffect(() => {
    if (active) {
      setLoadingState('Loading office assets...');
    }
    setLoadingProgress(progress);

    if (loaded === total) {
      setLoadingState('Office loaded');
    }
  }, [active, progress, loaded, total, setLoadingState, setLoadingProgress]);

  // Load the GLTF model
  const { scene } = useGLTF('/models/virtual-office-room.glb') as GLTFResult;

  // Load the alpha texture
  const alphaTexture = useTexture('/textures/Follaje_Diffuse-Alpha.png');

  // Access the Three.js scene
  const { scene: threeScene } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Apply custom materials and logic here
        if (mesh.name === 'Object_17') {
          mesh.material = new THREE.MeshPhongMaterial({
            map: alphaTexture,
          });
          const material = mesh.material as THREE.MeshPhongMaterial;
          material.transparent = true;
          material.alphaTest = 0.5;
        }
      }
    });

    // Add the model to the Three.js scene
    threeScene.add(scene);

    // Cleanup on unmount
    return () => {
      threeScene.remove(scene);
    };
  }, [scene, alphaTexture, threeScene]);

  return null; // Model is added directly to the scene
};

export default SceneModel;
