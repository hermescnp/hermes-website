"use client"
import React from "react"
import { ThreeEvent } from "@react-three/fiber"

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
  // any other zone properties
}

type ZonePointerHandler = (zone: ZoneData, event: ThreeEvent<PointerEvent>) => void
type ZoneMouseHandler = (zone: ZoneData, event: ThreeEvent<MouseEvent>) => void

interface ZonesProps {
  data: ZoneData[]
  onZonePointerDown?: ZonePointerHandler
  onZonePointerUp?: ZonePointerHandler
  onZoneClick?: ZoneMouseHandler
  onZoneHover?: ZonePointerHandler
  onZonePointerOut?: ZonePointerHandler
  currentInstance: string
}

export function Zones({
  data,
  onZonePointerDown,
  onZonePointerUp,
  onZoneClick,
  onZoneHover,
  onZonePointerOut,
  currentInstance,
}: ZonesProps) {

  return (
    <>
      {data.map((zone) => {
        // 2. Decide if it's a child or (by elimination) a sibling
        const isChild = zone.parentKey === currentInstance

        return (
          <mesh
            key={zone.key}
            position={[zone.positionX, zone.positionY, zone.positionZ]}
            // 3. Store a single boolean flag for child-vs-sibling
            userData={{ isChild }}
            onPointerDown={(e) => {
              e.stopPropagation()
              onZonePointerDown?.(zone, e)
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              onZonePointerUp?.(zone, e)
            }}
            onClick={(e) => {
              e.stopPropagation()
              onZoneClick?.(zone, e)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onZoneHover?.(zone, e)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              onZonePointerOut?.(zone, e)
            }}
          >
            <boxGeometry args={[zone.width, zone.height, zone.depth]} />
            <meshBasicMaterial
              color={0x00aaff}
              transparent={true}
              opacity={0.5}
              visible={false}
            />
          </mesh>
        )
      })}
    </>
  )
}
