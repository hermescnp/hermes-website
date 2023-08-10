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

function findParentKey(data : any, key : string) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return data[i].parentKey;
      }
    }
    return null;
  }
  
export function isInstanceDescendant(current : string, previous : string, data : any) {
    let parentKey = findParentKey(data, current);
  
    while (parentKey !== null) {
      if (parentKey === previous) {
        return true;
      }
  
      parentKey = findParentKey(data, parentKey);
    }
  
    return false;
  }
  
  export function isInstanceSibling(current : string, previous : string, data : any) {
    let currentParentKey = findParentKey(data, current);
    let previousParentKey = findParentKey(data, previous);
    
    return currentParentKey === previousParentKey;
  }
  