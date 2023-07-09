import React from 'react'
import { Vector3 } from 'three';
import * as THREE from 'three'

export default function Camera(position: Vector3, target: Vector3, aspect: number) {

    const camera = new THREE.PerspectiveCamera(
        25,
        aspect,
        0.01,
        1000
        );
    
    camera.position.copy(position);
    camera.lookAt(target);

  return (
    camera
  )
}
