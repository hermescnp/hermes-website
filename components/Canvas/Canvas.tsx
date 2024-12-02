"use client"
import React, { useRef, MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SceneModel from './SceneModel'

const CanvasComponent = () => {

    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <OrbitControls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <SceneModel />
        </Canvas>
    );
};

export default CanvasComponent;
