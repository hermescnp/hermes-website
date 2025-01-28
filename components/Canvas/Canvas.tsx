// Canvas.tsx
"use client"
import React from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { useExperienceContext } from "@/context/ExperienceContext"
import Scene from "./SceneFunction"
import Camera from "../Experience/Camera_R3F"

export default function CanvasComponent() {
    const { spaceData } = useExperienceContext()
    const position = new THREE.Vector3(-13.0, 7.0, 13.0)
    const generalTarget = new THREE.Vector3(
        spaceData[0]?.positionX,
        spaceData[0]?.positionY,
        spaceData[0]?.positionZ
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
            }}
            onCreated={({ scene }) => {
                const color = new THREE.Color(0x1e2332)
                scene.fog = new THREE.Fog(color, 50, 70)
                scene.background = null
            }}
        >
            <Camera
                position={position}
                target={generalTarget}
                aspect={window.innerWidth / window.innerHeight}
            />

            <ambientLight color="#ffe175" intensity={0.2} />

            <Scene data={spaceData} />
        </Canvas>
    )
}
