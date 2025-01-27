"use client"
import React from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { useExperienceContext } from "@/context/ExperienceContext"
import Scene from "./SceneFunction" // <--- Import your separate Scene component

export default function CanvasComponent() {
    // Access your context here if you want
    const { spaceData } = useExperienceContext()

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
            }}
            onCreated={({ scene }) => {
                const color = new THREE.Color(0x1e2332)
                scene.fog = new THREE.Fog(color, 50, 70)
                scene.background = null
            }}
        >
            <ambientLight color="#ffe175" intensity={0.2} />
            <Scene data={spaceData} />
        </Canvas>
    )
}
