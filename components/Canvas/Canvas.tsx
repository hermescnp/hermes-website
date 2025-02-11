// Canvas.tsx
"use client"
import React, { useCallback, useRef, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { useExperienceContext } from "@/context/ExperienceContext"
import Scene from "./SceneFunction"
import Camera from "../Experience/Camera_R3F"

export default function CanvasComponent() {
    const { spaceData, pushToHistory, getLastHistoryItem, history, setPlaceHover } = useExperienceContext()
    const [currentInstance, setCurrentInstance] = useState<string>('main')

    // UPDATE CURRENT INSTANCE
    useEffect(() => {
        setCurrentInstance(getLastHistoryItem());
    }, [history])

    // Define camera position and target
    const position = new THREE.Vector3(-13.0, 7.0, 13.0)
    const generalTarget = new THREE.Vector3(
        spaceData[0]?.positionX || 0,
        spaceData[0]?.positionY || 0,
        spaceData[0]?.positionZ || 0
    )

    // **Updated Handler for Double-Click Events**
    const handleDoubleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { // Changed to HTMLDivElement
            e.preventDefault() // Prevent any default browser behavior
            // Navigate to the main instance
            pushToHistory('main')
            // Clear the placehover
            setPlaceHover({ key:'', name: '', isChild: false, isParent: false });
        },
        [pushToHistory]
    )

    return (
        <Canvas
            style={{ width: "100vw", height: "100vh" }}
            gl={{
                antialias: true,
                toneMapping: THREE.LinearToneMapping,
                toneMappingExposure: 1.0,
                shadowMapEnabled: false,
                shadowMapType: THREE.PCFSoftShadowMap,
                preserveDrawingBuffer: false,
                powerPreference: "high-performance",
                logarithmicDepthBuffer: true,
            }}
            onCreated={({ scene }) => {
                const color = new THREE.Color(0x1e2332)
                scene.fog = new THREE.Fog(color, 50, 70)
                scene.background = null
            }}
            onDoubleClick={handleDoubleClick}
        >
            <Camera
                position={position}
                target={generalTarget}
                aspect={window.innerWidth / window.innerHeight}
            />
            <ambientLight color="#ffe175" intensity={0.2} />
            <Scene data={spaceData} currentInstance={currentInstance} />
        </Canvas>
    )
}
