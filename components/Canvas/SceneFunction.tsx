"use client"
import React, { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import * as THREE from "three"

import SceneModel from "./SceneModel"
import Camera from "../Experience/Camera_R3F"
import Background_R3F from "../Experience/Background_R3F"

type SceneProps = {
  data: any[]
}

export default function Scene({ data }: SceneProps) {

  const orbitRef = useRef<OrbitControlsImpl>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const [distances, setDistances] = useState({
    min: data[0]?.minDistance,
    max: data[0]?.maxDistance,
  })

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    // Check on mount:
    handleResize()
    // Listen for resize events:
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isPortrait) {
      setDistances({
        min: data[0]?.minDistance * 2,
        max: data[0]?.maxDistance * 2,
      })
    } else {
      setDistances({
        min: data[0]?.minDistance,
        max: data[0]?.maxDistance,
      })
    }
  }, [isPortrait, data])

  const position = new THREE.Vector3(-13.0, 7.0, 13.0)
  const generalTarget = new THREE.Vector3(
    data[0]?.positionX,
    data[0]?.positionY,
    data[0]?.positionZ
  )

  const aspect =
    typeof window !== "undefined"
      ? window.innerWidth / window.innerHeight
      : 1

  useFrame(() => {
    if (!orbitRef.current) return
    const controls = orbitRef.current

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
        maxDistance={distances.max}
        minDistance={distances.min}
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
