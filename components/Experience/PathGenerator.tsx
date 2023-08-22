import React from 'react'
import * as THREE from 'three'

export default class PathGenerator {
  targets: { [key: string]: THREE.Vector3 };

  constructor(instances: any) {
    this.targets = {};

    for (let instance of instances) {
      let vector = new THREE.Vector3(instance.positionX, instance.positionY, instance.positionZ);
      this.targets[instance.key] = vector;
    }
  }

  createPath(pointA: THREE.Vector3 | string, pointB: THREE.Vector3 | string): THREE.CatmullRomCurve3 {

    let path = new THREE.CatmullRomCurve3;
    let startPoint: THREE.Vector3;
    let endPoint: THREE.Vector3;

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

  getSiblingAxis(siblingSecuence: { orderedSiblings: any[], isLoop: boolean }): THREE.CatmullRomCurve3 {
    let vectors: THREE.Vector3[] = [];

    // Extract positions of each sibling and add to the vectors array
    for (let sibling of siblingSecuence.orderedSiblings) {
      let vector = this.targets[sibling];
      if (vector) {
        vectors.push(vector);
      }
    }

    // Check if vectors have only one item and if so, add it again to have two identical points
    if (vectors.length === 1) {
      vectors.push(vectors[0].clone());
    }

    // Create a CatmullRomCurve3 using the vectors and the isLoop value
    let path = new THREE.CatmullRomCurve3(vectors, siblingSecuence.isLoop);

    return path;
  }

}
