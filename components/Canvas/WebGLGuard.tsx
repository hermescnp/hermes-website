"use client"
import React from "react"

export const WEBGL_UNAVAILABLE = "The 3D office could not start (WebGL unavailable)"

export const canCreateWebGL = (): boolean => {
  try {
    const probe = document.createElement("canvas")
    const gl = (probe.getContext("webgl2") ?? probe.getContext("webgl")) as WebGLRenderingContext | null
    if (!gl) return false
    // Free the probe right away; browsers cap how many contexts a page may hold.
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  } catch {
    return false
  }
}

type WebGLBoundaryProps = {
  onError: (error: Error) => void
  children: React.ReactNode
}

export class WebGLBoundary extends React.Component<WebGLBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
