import React, { useEffect} from 'react'
import * as THREE from 'three'

export default function Renderer3d(scW : number, scH : number) {

  // SET 3D RENDERER

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        logarithmicDepthBuffer: true,
        alpha: true
    })

    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(scW, scH);
    renderer.setPixelRatio(window.devicePixelRatio);

  return (
    renderer
  )
}
