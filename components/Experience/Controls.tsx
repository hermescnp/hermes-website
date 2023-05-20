import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Controls(camera : any, target : any, renderer : any) {

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.40;
    controls.enablePan = true;
    controls.minAzimuthAngle = -1.7;
    controls.maxAzimuthAngle = 0.1;
    controls.minPolarAngle = Math.PI/4;
    controls.maxPolarAngle = Math.PI/2;
    controls.target = target;

  return (
    controls
  )
}
