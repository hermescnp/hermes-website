"use client"
import { useState, useRef, useCallback } from "react"
import { useExperienceContext } from "@/context/ExperienceContext"
import { ThreeEvent } from "@react-three/fiber"

export interface ZoneData {
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

export default function useSceneHandlers() {
  const { pushToHistory, setPlaceHover, getPrevHistoryItem } = useExperienceContext()
  
  // Add position tracking
  const clickStartPos = useRef({ x: 0, y: 0 })
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const longClickTimer = useRef<NodeJS.Timeout | null>(null)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const doubleClickThreshold = 300  // ms for detecting double-click
  const longClickThreshold = 500    // ms for detecting long-click
  const hoverDelay = 200            // ms delay for hover
  const dragThreshold = 5 // pixels of movement to consider it a drag

  const onZonePointerDown = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    // Store initial click position
    clickStartPos.current = { x: e.clientX, y: e.clientY }

    // Start long click timer
    longClickTimer.current = setTimeout(() => {
      setPlaceHover({ key:'', name: '' });
    }, longClickThreshold)
  }, [longClickThreshold, setPlaceHover])

  const onZonePointerUp = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    if (longClickTimer.current) {
      clearTimeout(longClickTimer.current)
      longClickTimer.current = null
    }
    // After a short delay, mark this as no longer a long-click.
    setTimeout(() => {

    }, 100)
  }, [])

  const onZoneClick = useCallback((zone: ZoneData, e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()

      // Calculate movement distance
      const deltaX = Math.abs(e.clientX - clickStartPos.current.x)
      const deltaY = Math.abs(e.clientY - clickStartPos.current.y)
      const isDrag = deltaX > dragThreshold || deltaY > dragThreshold

      // If it was a drag, don't process as a click
      if (isDrag) {
        return
      }

      if (clickTimer.current) {
        // This is a double click
        clearTimeout(clickTimer.current)
        clickTimer.current = null
      } else {
        // This is a single click
        clickTimer.current = setTimeout(() => {
          pushToHistory(zone.key)
          setPlaceHover({ key:'', name: '' });
          clickTimer.current = null
        }, doubleClickThreshold)
      }
    },
    [pushToHistory, getPrevHistoryItem, setPlaceHover]
  )

  const onZoneHover = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    // Clear any pending hover timeout
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
    }
    // Start new hover timeout
    hoverTimer.current = setTimeout(() => {
      setPlaceHover({
        key: zone.key,
        name: zone.name,
      })
    }, hoverDelay)
  }, [setPlaceHover, hoverDelay])
  
  const onZonePointerOut = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    // Clear hover timer if exists
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    setPlaceHover({ key:'', name: '' })
  }, [setPlaceHover])
  
  return {
    onZonePointerDown,
    onZonePointerUp,
    onZoneClick,
    onZoneHover,
    onZonePointerOut,
  }
}
