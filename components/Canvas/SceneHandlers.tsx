"use client"
import { useState, useRef, useCallback } from "react"
import { useExperienceContext } from "@/context/ExperienceContext"
import { ThreeEvent } from "@react-three/fiber"

export interface ZoneData {
  key: string
  parentKey: string
  width: number
  height: number
  depth: number
  positionX: number
  positionY: number
  positionZ: number
}

export default function useSceneHandlers() {
  const { pushToHistory, placehover, setPlaceHover } = useExperienceContext()

  // Tracks if the mouse is currently pressed and whether a "long click" has occurred
  const [isMousePressed, setIsMousePressed] = useState(false)
  const [isLongClick, setIsLongClick] = useState(false)
  
  // Timers and thresholds
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const longClickTimer = useRef<NodeJS.Timeout | null>(null)
  const doubleClickThreshold = 300  // ms for detecting double-click
  const longClickThreshold = 500    // ms for detecting long-click

  // We use this clickCount to help detect single vs. double clicks
  const [clickCount, setClickCount] = useState(0)

  const onZonePointerDown = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsMousePressed(true)
    setIsLongClick(false)

    // Start long click timer
    longClickTimer.current = setTimeout(() => {
      setIsLongClick(true)
      setPlaceHover({ name: '', isSibling: false });
    }, longClickThreshold)
  }, [longClickThreshold])

  const onZonePointerUp = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsMousePressed(false)

    if (longClickTimer.current) {
      clearTimeout(longClickTimer.current)
      longClickTimer.current = null
    }
    // After a short delay, mark this as no longer a long-click.
    setTimeout(() => {
      setIsLongClick(false)
    }, 100)
  }, [])

  const onZoneClick = useCallback((zone: ZoneData, e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      
      // If mouse is pressed or we are in a long click, we skip the single/double click logic
      if (isMousePressed || isLongClick) return

      setClickCount(prevClickCount => {
        const newCount = prevClickCount + 1

        if (newCount === 1) {
          // Schedule a timer to detect a possible second click
          clickTimer.current = setTimeout(() => {
            // If no second click arrives, it's a single click
            pushToHistory(zone.key)
            setClickCount(0) // Reset
          }, doubleClickThreshold)
        } else if (newCount === 2) {
          // Double click detected
          if (clickTimer.current) {
            clearTimeout(clickTimer.current)
            clickTimer.current = null
          }
          // Push the parentKey to history on double click
          if (zone.parentKey !== "root") {
            pushToHistory(zone.parentKey)
          }
          return 0 // Reset clickCount
        }

        return newCount
      })
    },
    [isMousePressed, isLongClick, pushToHistory]
  )

  const onZoneHover = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    setPlaceHover(prev => {
        if (prev.name !== zone.key || prev.isSibling !== false) {
          return { name: zone.key, isSibling: false }
        }
        return prev
      })
  }, [setPlaceHover])
  
  const onZonePointerOut = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    setPlaceHover({ name: '', isSibling: false })
  }, [])
  
  return {
    onZonePointerDown,
    onZonePointerUp,
    onZoneClick,
    onZoneHover,
    onZonePointerOut,
  }
}
