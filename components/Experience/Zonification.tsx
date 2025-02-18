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
  nearestTopSibling?: string | null
  nearestRightSibling?: string | null
  nearestForwardSibling?: string | null
  nearestBottomSibling?: string | null
  nearestLeftSibling?: string | null
  nearestBackwardSibling?: string | null
}

type ZonePointerHandler = (zone: ZoneData, event: ThreeEvent<PointerEvent>) => void
type ZoneMouseHandler = (zone: ZoneData, event: ThreeEvent<MouseEvent>) => void

interface ZonesProps {
  data: ZoneData[]
  currentInstance: string
  onZonePointerDown?: ZonePointerHandler
  onZonePointerUp?: ZonePointerHandler
  onZoneClick?: ZoneMouseHandler
  onZoneHover?: ZonePointerHandler
  onZonePointerLeave?: ZonePointerHandler
}

export function Zones({
  data,
  currentInstance,
  onZonePointerDown,
  onZonePointerUp,
  onZoneClick,
  onZoneHover,
  onZonePointerLeave,
}: ZonesProps) {
  // Compute sibling keys from the current instance
  const currentZone = data.find((z) => z.key === currentInstance)
  const siblingKeys = currentZone
    ? [
        currentZone.nearestTopSibling,
        currentZone.nearestRightSibling,
        currentZone.nearestForwardSibling,
        currentZone.nearestBottomSibling,
        currentZone.nearestLeftSibling,
        currentZone.nearestBackwardSibling,
      ].filter((key): key is string => key !== null && key !== undefined)
    : []
    
  return (
    <>
      {data.map((zone) => {
        const isInteractive = zone.parentKey === currentInstance || siblingKeys.includes(zone.key)
        return (
          <mesh
            key={zone.key}
            position={[zone.positionX, zone.positionY, zone.positionZ]}
            userData={{ key: zone.key, name: zone.name }}
            onPointerDown={isInteractive ? (e) => { e.stopPropagation(); onZonePointerDown?.(zone, e) } : undefined}
            onPointerUp={isInteractive ? (e) => { e.stopPropagation(); onZonePointerUp?.(zone, e) } : undefined}
            onClick={isInteractive ? (e) => { e.stopPropagation(); onZoneClick?.(zone, e) } : undefined}
            onPointerEnter={isInteractive ? (e) => { e.stopPropagation(); onZoneHover?.(zone, e) } : undefined}
            onPointerLeave={isInteractive ? (e) => { e.stopPropagation(); onZonePointerLeave?.(zone, e) } : undefined}
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
