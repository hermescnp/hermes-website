import React from 'react'
import * as THREE from 'three'
import { calculateInstanceLevel, calculateSiblingSequence, getInstancePosition, isInstanceDescendant, isInstanceSibling, calculateNearestWayTo, isUniqueChildInstance } from './InstanceAnalyzer'
import { isPathEquivalent, calculateSiblingPosition } from './PathAnalyzer'
import InstanceControls from './InstanceControls'

type InstanceAxisType = {
    verticalPath: THREE.CatmullRomCurve3,
    horizontalPath: THREE.CatmullRomCurve3
}

type TravelingDataType = {
    navigationAxis: string | null,
    isNavDescending: boolean;
    travelingPath: THREE.CatmullRomCurve3,
    destinationSiblingAxis: InstanceAxisType,
    destinationInstanceSiblingPosition: THREE.Vector2,
    originControls: any,
    destinationControls: any,
    originInstanceLevel: number,
    destinationInstanceLevel: number
}

export default function getTravelingData(fromInstance: string, toInstance: string, data: any[], pathGenerator: any): TravelingDataType {

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
