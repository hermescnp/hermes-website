import React from "react"
import { MeshProps, ThreeEvent } from "@react-three/fiber"
import { isInstanceSibling } from "@/components/Experience/InstanceAnalyzer"
import * as THREE from "three"

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
  const filteredData = data.filter((zone) =>
    isZoneSelectable(zone.key, currentInstance, data)
  )

  return (
    <>
      {filteredData.map((zone) => (
        <mesh
          key={zone.key}
          position={[zone.positionX, zone.positionY, zone.positionZ]}
          // You can store parentKey in userData or handle it however you like:
          userData={{ parentKey: zone.parentKey }}
          // Pass pointer handlers
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
      ))}
    </>
  )
}

function isZoneSelectable(zoneKey: string, currentInstance: string, data: ZoneData[]) {
  const zone = data.find((z) => z.key === zoneKey)
  if (!zone) return false

  // Is it a sibling? (Same parent as current instance)
  const isSibling = isInstanceSibling(zoneKey, currentInstance, data)
  // Is it a direct child of the current instance?
  const isChild = zone.parentKey === currentInstance

  return isSibling || isChild
}