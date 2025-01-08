"use client"
import React from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SceneModel from './SceneModel'
import Camera from '../Experience/Camera_R3F'
import * as THREE from 'three';
import Background_R3F from '../Experience/Background_R3F';

const CanvasComponent = () => {
    const position = new THREE.Vector3(0, 0, 5);
    const target = new THREE.Vector3(0, 0, 0);
    const aspect = window.innerWidth / window.innerHeight;

    return (
        <Canvas
            style={{ width: '100vw', height: '100vh' }}
            gl={{
                antialias: true,
                toneMapping: THREE.LinearToneMapping,
                toneMappingExposure: 1.0,
                shadowMapEnabled: false,
                shadowMapType: THREE.PCFSoftShadowMap,
                preserveDrawingBuffer: false
            }}
            onCreated={({ scene }) => {
                const color = new THREE.Color(0x1e2332);
                scene.fog = new THREE.Fog(color, 50, 70);
                scene.background = null;
            }}
        >
            <ambientLight color="#ffe175" intensity={0.2} />
            <Background_R3F />
            <Camera position={position} target={target} aspect={aspect} />
            <OrbitControls />
            <SceneModel />
        </Canvas>
    );
};

export default CanvasComponent;
