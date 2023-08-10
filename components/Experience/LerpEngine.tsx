import React from 'react'
import * as THREE from 'three';

export class LerpEngine {
    current: number;
    target: number;
    ease: number;

    constructor() {
        this.current = 0;
        this.target = 0;
        this.ease = 0.05;
    }

    reset = () => {
        this.current = 0;
        this.target = 0;
        this.ease = 0.05;
    }
}

export function lerpControls(prevControls : any, nextControls : any, lerpFactor : number, isDescending : boolean) {

let currentControls = {
  maxDistance: 0,
  minDistance: 0,
  maxAzimuthAngle: 0,
  minAzimuthAngle: 0,
  maxPolarAngle: 0,
  minPolarAngle: 0,
};

  if (isDescending) {
    currentControls.maxDistance = THREE.MathUtils.lerp(prevControls.maxDistance, nextControls.maxDistance, lerpFactor);
    currentControls.minDistance = THREE.MathUtils.lerp(prevControls.minDistance, nextControls.minDistance, lerpFactor);
    currentControls.maxAzimuthAngle = THREE.MathUtils.lerp(prevControls.maxAzimuthAngle, nextControls.maxAzimuthAngle, lerpFactor);
    currentControls.minAzimuthAngle = THREE.MathUtils.lerp(prevControls.minAzimuthAngle, nextControls.minAzimuthAngle, lerpFactor);
    currentControls.maxPolarAngle = THREE.MathUtils.lerp(prevControls.maxPolarAngle, nextControls.maxPolarAngle, lerpFactor);
    currentControls.minPolarAngle = THREE.MathUtils.lerp(prevControls.minPolarAngle, nextControls.minPolarAngle, lerpFactor);
} else {
  currentControls.maxDistance = THREE.MathUtils.lerp(nextControls.maxDistance, prevControls.maxDistance, lerpFactor);
  currentControls.minDistance = THREE.MathUtils.lerp(nextControls.minDistance, prevControls.minDistance, lerpFactor);
  currentControls.maxAzimuthAngle = THREE.MathUtils.lerp(nextControls.maxAzimuthAngle, prevControls.maxAzimuthAngle, lerpFactor);
  currentControls.minAzimuthAngle = THREE.MathUtils.lerp(nextControls.minAzimuthAngle, prevControls.minAzimuthAngle, lerpFactor);
  currentControls.maxPolarAngle = THREE.MathUtils.lerp(nextControls.maxPolarAngle, prevControls.maxPolarAngle, lerpFactor);
  currentControls.minPolarAngle = THREE.MathUtils.lerp(nextControls.minPolarAngle, prevControls.minPolarAngle, lerpFactor);
}

return currentControls;
}
