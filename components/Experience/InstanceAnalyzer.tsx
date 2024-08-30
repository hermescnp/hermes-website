import React from 'react'
import * as THREE from 'three';

function findParentKey(data: any, key: string) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
            return data[i].parentKey;
        }
    }
    return null;
}

export function calculateInstanceLevel(instanceKey: string, data: any) {
    let instanceLevel = 0;
    let currentKey = instanceKey;

    while (true) {
        const currentInstance = data.find((item: any) => item.key === currentKey);

        if (currentInstance === undefined || currentInstance.parentKey === 'root') {
            instanceLevel++;
            break;
        } else {
            currentKey = currentInstance.parentKey;
            instanceLevel++;
        }
    }

    return instanceLevel;
}

type SiblingSequence = {
    orderedSiblings: string[],
    isLoop: boolean
}

type OrientationType = "vertical" | "horizontal" | "default";

export function calculateSiblingSequence(instanceKey: string, orientation: OrientationType, data: any[], previousInstanceKey?: string): SiblingSequence {
    const instanceData = data.find(item => item.key === instanceKey);
    if (!instanceData) {
        return { orderedSiblings: [], isLoop: false }; // instanceKey not found in data
    }

    const siblings = data.filter(item => item.parentKey === instanceData.parentKey);

    // Construct the dynamic property name based on orientation
    const nearestSiblingProperty = orientation === "vertical" ? "nearestVerticalSibling" : "nearestHorizontalSibling";

    let chain: string[] = [instanceKey];
    const seenKeys = new Set<string>();

    // Traverse before the instanceKey
    let currentInstanceKey = instanceData[nearestSiblingProperty];
    while (currentInstanceKey !== "root") {
        const currentInstance = siblings.find(item => item.key === currentInstanceKey);
        if (!currentInstance || seenKeys.has(currentInstance.key)) {
            // Detect a loop or missing link
            return { orderedSiblings: chain, isLoop: true };
        }
        
        // If previousInstanceKey is provided, ensure the currentInstance matches the provided key
        if (previousInstanceKey && currentInstanceKey === instanceKey && currentInstance[nearestSiblingProperty] !== previousInstanceKey) {
            break;
        }
        
        chain = [currentInstance.key, ...chain];
        seenKeys.add(currentInstance.key);
        currentInstanceKey = currentInstance[nearestSiblingProperty];
    }

    // Reset seenKeys for forward traversal
    seenKeys.clear();
    seenKeys.add(instanceKey);

    // Traverse after the instanceKey
    currentInstanceKey = instanceKey;
    let currentInstance = instanceData;
    while (currentInstance) {
        currentInstance = siblings.find(item => item[nearestSiblingProperty] === currentInstanceKey);
        if (currentInstance) {
            if (seenKeys.has(currentInstance.key)) {
                // Detect a loop
                return { orderedSiblings: chain, isLoop: true };
            }
            chain.push(currentInstance.key);
            seenKeys.add(currentInstance.key);
            currentInstanceKey = currentInstance.key;
        }
    }

    return {
        orderedSiblings: chain,
        isLoop: false
    };
}

export function getInstancePosition(instanceKey: string, data: any[]): THREE.Vector3 {
    const position = new THREE.Vector3();

    // Search for an item with a matching key.
    const item = data.find(d => d.key === instanceKey);

    // If an item is found, set the position values.
    if (item) {
        position.set(item.positionX, item.positionY, item.positionZ);
    }

    return position;
}

export function getCurrentInstance(historyArray: string[]): string {
    if (historyArray.length > 0) {
        return historyArray[historyArray.length - 1];
    }
    return ('main');
}

export function isInstanceDescendant(current: string, previous: string, data: any) {
    let parentKey = findParentKey(data, current);

    while (parentKey !== null) {
        if (parentKey === previous) {
            return true;
        }

        parentKey = findParentKey(data, parentKey);
    }

    return false;
}

export function isInstanceSibling(current: string, previous: string, data: any) {
    let currentParentKey = findParentKey(data, current);
    let previousParentKey = findParentKey(data, previous);

    return currentParentKey === previousParentKey;
}

export function calculateNearestWayTo(current: string, previous: string, data: any): OrientationType | null {
    // Calculate sibling sequences for the previous instance.
    const verticalSequence = calculateSiblingSequence(previous, "vertical", data);
    const horizontalSequence = calculateSiblingSequence(previous, "horizontal", data);

    const verticalIndex = verticalSequence.orderedSiblings.indexOf(current);
    const horizontalIndex = horizontalSequence.orderedSiblings.indexOf(current);

    // If the current instance isn't in either sequence, return default.
    if (verticalIndex === -1 && horizontalIndex === -1) {
        return "default";
    }

    // If the current instance is only in one of the sequences, return that orientation.
    if (verticalIndex === -1) {
        return "horizontal";
    }
    if (horizontalIndex === -1) {
        return "vertical";
    }

    // Calculate distances in both sequences.
    const distanceInVertical = Math.abs(verticalIndex - verticalSequence.orderedSiblings.indexOf(previous));
    const distanceInHorizontal = Math.abs(horizontalIndex - horizontalSequence.orderedSiblings.indexOf(previous));

    // Return the orientation with the shortest distance.
    if (distanceInVertical <= distanceInHorizontal) {
        return "vertical";
    }
    return "horizontal";
}


export function isUniqueChildInstance(instanceKey: string, data: any): boolean {
    // Find the parent key of the instance
    const parentKey = findParentKey(data, instanceKey);

    if (parentKey === null) {
        return false;  // If no parent is found, it's not a unique child.
    }

    // Filter the data to get children of the parent
    const childrenOfParent = data.filter((item: any) => item.parentKey === parentKey);

    // If the parent has only one child (our instance), return true
    return childrenOfParent.length === 1;
}

