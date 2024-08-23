import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Controls(camera : any, target : any, renderer : any, data : any) {

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.40;
    controls.enablePan = false;
    controls.target = target?.position;
    controls.maxDistance = data[0]?.maxDistance ?? 28;
    controls.minDistance = data[0]?.minDistance ?? 18;
    controls.maxAzimuthAngle = data[0]?.maxAzimuthAngle ?? 0;
    controls.minAzimuthAngle = data[0]?.minAzimuthAngle ?? -1.60;
    controls.maxPolarAngle = Math.PI/data[0]?.maxPolarAngle ?? Math.PI/2.40;
    controls.minPolarAngle = Math.PI/data[0]?.minPolarAngle ?? Math.PI/3.10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

  return (
    controls
  )
}