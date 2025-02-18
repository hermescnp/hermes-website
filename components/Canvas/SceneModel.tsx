import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, useTexture, useProgress, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceContext } from '@/context/ExperienceContext';

type GLTFResult = {
  scene: THREE.Group;
};

const SceneModel: React.FC = () => {
  // Experience context for loading state updates
  const { setLoadingState, setLoadingProgress } = useExperienceContext();

  // Monitor loading progress
  const { active, progress, loaded, total } = useProgress();

  useEffect(() => {
    if (active) setLoadingState('Loading office assets...');
    setLoadingProgress(progress);
    if (loaded === total) setLoadingState('Office loaded');
  }, [active, progress, loaded, total, setLoadingState, setLoadingProgress]);

  // Load the GLTF model
  const { scene } = useGLTF('/models/virtual-office-room.glb') as GLTFResult;

  // Load the alpha texture for Object_17
  const alphaTexture = useTexture('/textures/Follaje_Diffuse-Alpha.png');
  // Load the video texture for Object_777_2
  const videoTexture = useVideoTexture('/textures/prane_video_fragment.mp4', {
    muted: true,
    loop: true,
    autoplay: true,
    crossOrigin: 'anonymous'
  });
  // Load the video texture for Object_28_2
  const videoTexture2 = useVideoTexture('/textures/LED-live-recording-sign.mp4', {
    muted: true,
    loop: true,
    autoplay: true,
    crossOrigin: 'anonymous'
  });

  // Configure the videoTexture.
  useEffect(() => {
    if (videoTexture) {
      videoTexture.flipY = false;
      videoTexture.minFilter = THREE.NearestFilter;
      videoTexture.magFilter = THREE.NearestFilter;
      videoTexture.generateMipmaps = false;
    }
  }, [videoTexture]);

  // Configure the videoTexture2.
  useEffect(() => {
    if (videoTexture2) {
      videoTexture2.flipY = false;
      videoTexture2.minFilter = THREE.NearestFilter;
      videoTexture2.magFilter = THREE.NearestFilter;
      videoTexture2.generateMipmaps = false;
    }
  }, [videoTexture2]);

  // Access the Three.js scene
  const { scene: threeScene } = useThree();

  useEffect(() => {
    // Traverse the GLTF scene and assign materials accordingly.
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Apply the alpha texture to Object_17.
        if (mesh.name === 'Object_17') {
          mesh.material = new THREE.MeshPhongMaterial({
            map: alphaTexture,
          });
          const material = mesh.material as THREE.MeshPhongMaterial;
          material.transparent = true;
          material.alphaTest = 0.5;
        }

        // Apply the video texture to child of Object_777_2.
        if (mesh.name === 'Object_777_2') {
          mesh.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
          });
        }

        // Apply the video texture to child of Object_28_2.
        if (mesh.name === 'Object_28_2') {
          mesh.material = new THREE.MeshBasicMaterial({
            map: videoTexture2,
          });
        }
      }
    });

    // Add the model to the Three.js scene.
    threeScene.add(scene);

    // Cleanup on unmount.
    return () => {
      threeScene.remove(scene);
    };
  }, [scene, alphaTexture, videoTexture, videoTexture2, threeScene]);

  return null;
};

export default SceneModel;
