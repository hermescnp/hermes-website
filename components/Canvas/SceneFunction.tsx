"use client"
import React, { useRef, useState, useEffect, useMemo, use } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { Zones } from "../Experience/Zonification"
import { useExperienceContext } from "@/context/ExperienceContext"
import useSceneHandlers from "./SceneHandlers"
import * as THREE from "three"
import SceneModel from "./SceneModel"
import Background_R3F from "../Experience/Background_R3F"
import bloomEffect from '../../public/assets/PNG/bloom-effect.png'
import { isInstanceSibling } from "@/components/Experience/InstanceAnalyzer"
import '../../styles/Canvas.css'

type ZoneData = {
  key: string
  name: string
  parentKey: string
  width: number
  height: number
  depth: number
  positionX: number
  positionY: number
  positionZ: number
}

type SceneProps = {
  data: any[],
  currentInstance: string
}

function isZoneSelectable(zoneKey: string, currentInstance: string, data: ZoneData[]) {
  if (zoneKey === currentInstance) return false
  const zone = data.find((z) => z.key === zoneKey)
  if (!zone) return false

  // Is it a sibling? (Same parent as current instance)
  const isSibling = isInstanceSibling(zoneKey, currentInstance, data)
  // Is it a direct child of the current instance?
  const isChild = zone.parentKey === currentInstance

  return isSibling || isChild
}

export default function Scene({ data, currentInstance }: SceneProps) {

  const { onZonePointerDown, onZonePointerUp, onZoneClick, onZoneHover, onZonePointerOut } = useSceneHandlers()
  const orbitRef = useRef<OrbitControlsImpl>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const desiredInstance = useRef({
    target: new THREE.Vector3(
      data[0].positionX,
      data[0].positionY,
      data[0].positionZ
    ),
    minDistance: data[0].minDistance,
    maxDistance: data[0].maxDistance,
    minAzimuthAngle: data[0].minAzimuthAngle,
    maxAzimuthAngle: data[0].maxAzimuthAngle,
    minPolarAngle: data[0].minPolarAngle,
    maxPolarAngle: data[0].maxPolarAngle
  })
  const originalDistances = useRef({ minDistance: data[0].minDistance, maxDistance: data[0].maxDistance })

  // CALL INSTANCE TRAVELER
  useEffect(() => {
    const found = data.find((item) => item.key === currentInstance)
    if (!found) return

    desiredInstance.current.target.set(
      found.positionX,
      found.positionY,
      found.positionZ
    )
    desiredInstance.current.minDistance = found.minDistance
    desiredInstance.current.maxDistance = found.maxDistance
    desiredInstance.current.minAzimuthAngle = found.minAzimuthAngle
    desiredInstance.current.maxAzimuthAngle = found.maxAzimuthAngle
    desiredInstance.current.minPolarAngle = found.minPolarAngle
    desiredInstance.current.maxPolarAngle = found.maxPolarAngle
    originalDistances.current.minDistance = found.minDistance
    originalDistances.current.maxDistance = found.maxDistance
  }, [currentInstance, data])

  useFrame(() => {
    if (!orbitRef.current) return
    const controls = orbitRef.current
    const lerpFactor = 0.05

    // Lerp target vector
    controls.target.lerp(desiredInstance.current.target, lerpFactor)

    controls.minDistance = THREE.MathUtils.lerp(
      controls.minDistance,
      desiredInstance.current.minDistance,
      lerpFactor
    )
    controls.maxDistance = THREE.MathUtils.lerp(
      controls.maxDistance,
      desiredInstance.current.maxDistance,
      lerpFactor
    )
    controls.minAzimuthAngle = THREE.MathUtils.lerp(
      controls.minAzimuthAngle,
      desiredInstance.current.minAzimuthAngle,
      lerpFactor
    )
    controls.maxAzimuthAngle = THREE.MathUtils.lerp(
      controls.maxAzimuthAngle,
      desiredInstance.current.maxAzimuthAngle,
      lerpFactor
    )
    controls.minPolarAngle = THREE.MathUtils.lerp(
      controls.minPolarAngle,
      Math.PI / desiredInstance.current.minPolarAngle,
      lerpFactor
    )
    controls.maxPolarAngle = THREE.MathUtils.lerp(
      controls.maxPolarAngle,
      Math.PI / desiredInstance.current.maxPolarAngle,
      lerpFactor
    )
    controls.update()
  })

  // HANDLE RESIZE
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

  // AUTO ROTATE
  useFrame(() => {
    if (!orbitRef.current) return
    const controls = orbitRef.current

    const angle = controls.getAzimuthalAngle()
    const epsilon = 0.01

    if (angle <= controls.minAzimuthAngle + epsilon) {
      controls.autoRotateSpeed = -Math.abs(controls.autoRotateSpeed)
    } else if (angle >= controls.maxAzimuthAngle - epsilon) {
      controls.autoRotateSpeed = Math.abs(controls.autoRotateSpeed)
    }
  })

  const filteredZones = data.filter((zone) =>
    isZoneSelectable(zone.key, currentInstance, data)
  )

  //HANDLE RESPONSIVENESS
  useEffect(() => {
    const { minDistance, maxDistance } = originalDistances.current
    if (isPortrait) {
      desiredInstance.current.minDistance = minDistance * 2
      desiredInstance.current.maxDistance = maxDistance * 2
    } else {
      desiredInstance.current.minDistance = minDistance
      desiredInstance.current.maxDistance = maxDistance
    }
  }, [isPortrait])

  return (
    <group>
      <OrbitControls
        ref={orbitRef}
        autoRotate
        autoRotateSpeed={0.1}
        enableDamping
        dampingFactor={0.08}
        enableZoom
        zoomSpeed={0.5}
        enableRotate
        rotateSpeed={0.4}
        enablePan={false}
        maxDistance={28}
        minDistance={18}
        maxAzimuthAngle={ 0}
        minAzimuthAngle={-1.60}
        maxPolarAngle={Math.PI/2.40}
        minPolarAngle={Math.PI/3.10}
      />
      <Background_R3F />
      <SceneModel />

      {/* 2D Overlays in 3D space */}
      <Html center position={[1.63, 4.55, -0.59]} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
        <img src={bloomEffect.src} style={{ width: "150px", opacity: 0.7 }} />
      </Html>
      <Html center position={[0.67, 3.91, -2.62]} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
        <img src={bloomEffect.src} style={{ width: "150px", opacity: 0.7 }} />
      </Html>
      <Html center position={[0.51, 4.18, -1.29]} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
        <img src={bloomEffect.src} style={{ width: "150px", opacity: 0.7 }} />
      </Html>

      <Zones
        data={filteredZones}
        onZonePointerDown={onZonePointerDown}
        onZonePointerUp={onZonePointerUp}
        onZoneClick={onZoneClick}
        onZoneHover={onZoneHover}
        onZonePointerOut={onZonePointerOut}
        currentInstance={currentInstance}
      />
    </group>
  )
}
