import React from 'react'
import * as THREE from 'three'

export function isPathEquivalent(pathA : THREE.CatmullRomCurve3, pathB : THREE.CatmullRomCurve3) : boolean {
    const pointsA = pathA.points;
    const pointsB = pathB.points;

    if(pointsA.length !== pointsB.length) {
        return false;
    }

    return pointsA.every(pointA => 
        pointsB.some(pointB => 
            pointA.x === pointB.x && 
            pointA.y === pointB.y && 
            pointA.z === pointB.z
        )
    ) && pointsB.every(pointB => 
        pointsA.some(pointA => 
            pointA.x === pointB.x && 
            pointA.y === pointB.y && 
            pointA.z === pointB.z
        )
    );
}

export function calculateSiblingPosition(instancePosition: THREE.Vector3, axis?: THREE.CatmullRomCurve3) {
  // If the axis parameter is not provided, return 0
  if (!axis || axis.points.length < 2 || !instancePosition) {
    return 0;
}
  const numSamples = 100

  let closestDistanceSquared = Infinity;
  let closestT = 0;

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const samplePoint = axis.getPoint(t);
    const distanceSquared = instancePosition.distanceToSquared(samplePoint);

    if (distanceSquared < closestDistanceSquared) {
      closestDistanceSquared = distanceSquared;
      closestT = t;
    }
  }

  return closestT;
}

export function invertPath(path: THREE.CatmullRomCurve3): THREE.CatmullRomCurve3 {
  const invertedPoints = [...path.points].reverse();
  return new THREE.CatmullRomCurve3(invertedPoints);
}



