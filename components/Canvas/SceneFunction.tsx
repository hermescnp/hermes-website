"use client"
import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import * as THREE from "three"

import SceneModel from "./SceneModel"
import Camera from "../Experience/Camera_R3F"
import Background_R3F from "../Experience/Background_R3F"

type SceneProps = {
  data: any[] // Adjust the type based on your actual data structure
}

export default function Scene({ data }: SceneProps) {
  /**
   * Because <Scene> is rendered inside <Canvas>,
   * we can safely use R3F hooks here (like useFrame).
   */
  const orbitRef = useRef<OrbitControlsImpl>(null)

  // Example camera position & target
  const position = new THREE.Vector3(-13.0, 7.0, 13.0)
  const generalTarget = new THREE.Vector3(
    data[0]?.positionX,
    data[0]?.positionY,
    data[0]?.positionZ
  )

  // If you want the camera aspect ratio, get it from window or from useThree() if needed
  const aspect =
    typeof window !== "undefined"
      ? window.innerWidth / window.innerHeight
      : 1

  useFrame(() => {
    if (!orbitRef.current) return
    const controls = orbitRef.current

    // Example custom auto-rotate logic
    const angle = controls.getAzimuthalAngle()
    const epsilon = 0.01

    if (angle <= data[0]?.minAzimuthAngle + epsilon) {
      controls.autoRotateSpeed = -Math.abs(controls.autoRotateSpeed)
    } else if (angle >= data[0]?.maxAzimuthAngle - epsilon) {
      controls.autoRotateSpeed = Math.abs(controls.autoRotateSpeed)
    }
  })

  return (
    <>
      <Camera position={position} target={generalTarget} aspect={aspect} />
      <OrbitControls
        ref={orbitRef}
        target={generalTarget}
        autoRotate
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.08}
        enableZoom
        zoomSpeed={0.5}
        enableRotate
        rotateSpeed={0.4}
        enablePan={false}
        maxDistance={data[0]?.maxDistance}
        minDistance={data[0]?.minDistance}
        maxAzimuthAngle={data[0]?.maxAzimuthAngle}
        minAzimuthAngle={data[0]?.minAzimuthAngle}
        maxPolarAngle={Math.PI / data[0]?.maxPolarAngle}
        minPolarAngle={Math.PI / data[0]?.minPolarAngle}
      />
      <Background_R3F />
      <SceneModel />
    </>
  )
}
