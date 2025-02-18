/* import React from 'react'
import * as THREE from 'three'
import { calculateInstanceLevel, calculateSiblingSequence, getInstancePosition, isInstanceDescendant, isInstanceSibling, calculateNearestWayTo, isUniqueChildInstance } from './InstanceAnalyzer'
import { isPathEquivalent, calculateSiblingPosition } from './PathAnalyzer'
import InstanceControls from './InstanceControls'

type InstanceAxisType = {
    verticalPath: THREE.CatmullRomCurve3 | null,
    horizontalPath: THREE.CatmullRomCurve3 | null
}

type TravelingDataType = {
    navigationAxis: string | null,
    isNavDescending: boolean;
    travelingPath: THREE.CatmullRomCurve3 | null,
    destinationSiblingAxis: InstanceAxisType,
    destinationInstanceSiblingPosition: THREE.Vector2,
    originControls: any,
    destinationControls: any,
    originInstanceLevel: number,
    destinationInstanceLevel: number
}

export function getTravelingData(fromInstance: string, toInstance: string, data: any[], pathGenerator: any): TravelingDataType {

    const originlevel = calculateInstanceLevel(toInstance, data);
    const destinationlevel = calculateInstanceLevel(toInstance, data);
    let verticalSiblingPath = null;
    let horizontalSiblingPath = null;
    let isNavDescending = false;
    const movementAxis = calculateNearestWayTo(toInstance, fromInstance, data);
    let destinationSiblingPosition;

    if (isInstanceDescendant(toInstance, fromInstance, data)) {
        isNavDescending = true;
    }

    const travelingPath = isNavDescending ? pathGenerator.createPath(fromInstance, toInstance) : pathGenerator.createPath(toInstance, fromInstance);

    if (isUniqueChildInstance(toInstance, data)) {
        destinationSiblingPosition = new THREE.Vector2(0, 0);
    } else {
        const verticalSiblingSecuence = calculateSiblingSequence(toInstance, 'vertical', data);
        const horizontalSiblingSecuence = calculateSiblingSequence(toInstance, 'horizontal', data);
        verticalSiblingPath = pathGenerator.getSiblingAxis(verticalSiblingSecuence);
        horizontalSiblingPath = pathGenerator.getSiblingAxis(horizontalSiblingSecuence);

        const newVerticalSiblingPosition = calculateSiblingPosition(getInstancePosition(toInstance, data), verticalSiblingPath);
        const newHorizontalSiblingPosition = calculateSiblingPosition(getInstancePosition(toInstance, data), horizontalSiblingPath);

        destinationSiblingPosition = new THREE.Vector2(newVerticalSiblingPosition, newHorizontalSiblingPosition);
    }

    return {
        navigationAxis: movementAxis,
        isNavDescending: isNavDescending,
        travelingPath: travelingPath,
        destinationSiblingAxis: {
            verticalPath: verticalSiblingPath,
            horizontalPath: horizontalSiblingPath
        },
        destinationInstanceSiblingPosition: destinationSiblingPosition,
        originControls: InstanceControls(fromInstance, data),
        destinationControls: InstanceControls(toInstance, data),
        originInstanceLevel: originlevel,
        destinationInstanceLevel: destinationlevel
    };
}

export function getDefaultTravelingData(data: any): TravelingDataType {

    let startPoint = new THREE.Vector3(0, 0, 0);
    let endPoint = new THREE.Vector3(0, 0, 0);

    const path = new THREE.CatmullRomCurve3([
        startPoint,
        endPoint
    ], false);

    const instanceControls = {
        "maxDistance": 20.00,
        "minDistance": 20.00,
        "maxAzimuthAngle": 0.00,
        "minAzimuthAngle": -1.60,
        "maxPolarAngle": 2.40,
        "minPolarAngle": 3.10,
    }

    return {
        navigationAxis: 'default',
        isNavDescending: true,
        travelingPath: path,
        destinationSiblingAxis: {
            verticalPath: null,
            horizontalPath: null
        },
        destinationInstanceSiblingPosition: new THREE.Vector2(0, 0),
        originControls: instanceControls,
        destinationControls: instanceControls,
        originInstanceLevel: 0,
        destinationInstanceLevel: 1
    };
}
 */