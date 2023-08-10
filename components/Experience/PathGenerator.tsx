import React from 'react'
import * as THREE from 'three'

export default class PathGenerator {
  targets: { [key: string]: THREE.Vector3 };

  constructor(instances : any) {
    this.targets = {};

    for(let instance of instances) {
      let vector = new THREE.Vector3(instance.positionX, instance.positionY, instance.positionZ);
      this.targets[instance.key] = vector;
    }
    this.targets['intro'] = new THREE.Vector3(-50.0, 0.0, 0.0)
  }

  createPath(pointA: THREE.Vector3 | string , pointB: THREE.Vector3 | string ): THREE.CatmullRomCurve3 {

    let path = new THREE.CatmullRomCurve3;
    let startPoint : THREE.Vector3;
    let endPoint : THREE.Vector3;
  
    if (pointA instanceof THREE.Vector3) {
      startPoint = pointA;
    } else {
      startPoint = this.targets[pointA];
    }
    if (pointB instanceof THREE.Vector3) {
      endPoint = pointB;
    } else {
      endPoint = this.targets[pointB];
    }
  
    path = new THREE.CatmullRomCurve3([
      startPoint,
      endPoint
    ], false);
  
    return (
      path
    )
  }
}
