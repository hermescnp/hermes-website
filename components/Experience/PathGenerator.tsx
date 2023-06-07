import React from 'react'
import * as THREE from 'three';

export function createPath(pointA: THREE.Vector3 | string , pointB: THREE.Vector3 | string ): THREE.CatmullRomCurve3 {

  let path = new THREE.CatmullRomCurve3;
  let startPoint : THREE.Vector3;
  let endPoint : THREE.Vector3;

  const targets: { [key: string]: THREE.Vector3 } = {
    general: new THREE.Vector3(0.0, 2.0, 0.0),
    studio: new THREE.Vector3(2.5, 1.2, 1.5),
    lobby: new THREE.Vector3(-1.9, 1.0, 1.20),
    awards: new THREE.Vector3(0.25, 1.0, 2.25),
    library: new THREE.Vector3(-0.5, 0.9, -2.0),
    stairs: new THREE.Vector3(-2.5, 2.2, -2.0),
    rooftop: new THREE.Vector3(0.0, 4.0, -0.3)
  };

  if (pointA instanceof THREE.Vector3) {
    startPoint = pointA;
  } else {
    startPoint = targets[pointA];
  }
  if (pointB instanceof THREE.Vector3) {
    endPoint = pointB;
  } else {
    endPoint = targets[pointB];
  }

  path = new THREE.CatmullRomCurve3([
    startPoint,
    endPoint
  ], false);

  return (
    path
  )
}

