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
  const { pushToHistory, placehover, setPlaceHover } = useExperienceContext()

  // Tracks if the mouse is currently pressed and whether a "long click" has occurred
  const [isMousePressed, setIsMousePressed] = useState(false)
  const [isLongClick, setIsLongClick] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  
  // Add position tracking
  const clickStartPos = useRef({ x: 0, y: 0 })
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const longClickTimer = useRef<NodeJS.Timeout | null>(null)
  const doubleClickThreshold = 300  // ms for detecting double-click
  const longClickThreshold = 500    // ms for detecting long-click
  const dragThreshold = 5 // pixels of movement to consider it a drag

  const onZonePointerDown = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsMousePressed(true)
    setIsLongClick(false)
    
    // Store initial click position
    clickStartPos.current = { x: e.clientX, y: e.clientY }

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

      // Calculate movement distance
      const deltaX = Math.abs(e.clientX - clickStartPos.current.x)
      const deltaY = Math.abs(e.clientY - clickStartPos.current.y)
      const isDrag = deltaX > dragThreshold || deltaY > dragThreshold

      // If it was a drag, don't process as a click
      if (isDrag) {
        setClickCount(0)
        return
      }

      if (clickTimer.current) {
        // This is a double click
        clearTimeout(clickTimer.current)
        clickTimer.current = null
        setClickCount(0)
        
        // Navigate to parent on double click
        if (zone.parentKey !== "root") {
          pushToHistory(zone.parentKey)
        }
      } else {
        // This is a single click
        setClickCount(prev => prev + 1)
        clickTimer.current = setTimeout(() => {
          pushToHistory(zone.key)
          clickTimer.current = null
          setClickCount(0)
        }, doubleClickThreshold)
      }
    },
    [isMousePressed, isLongClick, pushToHistory]
  )

  const onZoneHover = useCallback((zone: ZoneData, e: ThreeEvent<PointerEvent>) => {
    setPlaceHover(prev => {
        if (prev.name !== zone.key || prev.isSibling !== false) {
          return { name: zone.name, isSibling: false }
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
