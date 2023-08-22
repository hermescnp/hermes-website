import React from 'react'
import * as THREE from 'three';

function findParentKey(data : any, key : string) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return data[i].parentKey;
      }
    }
    return null;
  }

export function calculateInstanceLevel(instanceKey : string, data : any) {
    let instanceLevel = 0;
    let currentKey = instanceKey;

    while (true) {
        const currentInstance = data.find((item : any) => item.key === currentKey);

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

type SiblingSecuence = {
    orderedSiblings: string[],
    isLoop: boolean
}

type OrientationType = "vertical" | "horizontal";

export function calculateSiblingSecuence(instanceKey: string, orientation: OrientationType, data: any[]): SiblingSecuence {
    const instanceParentKey = data.find(item => item.key === instanceKey)?.parentKey;
    const siblings = data.filter(item => item.parentKey === instanceParentKey);
    
    // Construct the dynamic property name based on orientation
    const nearestSiblingProperty = orientation === "vertical" ? "nearestVerticalSibling" : "nearestHorizontalSibling";

    let currentInstance = siblings.find(item => item[nearestSiblingProperty] === "root");

    if (!currentInstance) {
        currentInstance = siblings.find(item => item.key === instanceKey);
        if (!currentInstance) {
            return { orderedSiblings: [instanceKey], isLoop: false };
        }
    }

    const chain: string[] = [];  // Making it explicit that this array will contain strings (keys)
    const seenKeys = new Set<string>();
    let isLoop = false;

    while (currentInstance) {
        if (seenKeys.has(currentInstance.key)) {
            isLoop = true;
            break;
        }
        seenKeys.add(currentInstance.key);
        chain.push(currentInstance.key);  // Just push the key, not the whole object
        currentInstance = siblings.find(item => item[nearestSiblingProperty] === currentInstance.key);
    }

    return {
        orderedSiblings: chain, // This now contains ordered sibling keys
        isLoop: isLoop
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

export function getCurrentInstance(historyArray : string[]): string {
    if (historyArray.length > 0) {
        return historyArray[historyArray.length - 1];
    }
    return ('main');
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

  export function getSiblingOrientation(current: string, previous: string, data: any): OrientationType | null {
    // Calculate sibling sequences for the previous instance.
    const verticalSequence = calculateSiblingSecuence(previous, "vertical", data);
    const horizontalSequence = calculateSiblingSecuence(previous, "horizontal", data);

    // Check in which sequence the current instance exists.
    if (verticalSequence.orderedSiblings.includes(current)) {
        return "vertical";
    }
    
    if (horizontalSequence.orderedSiblings.includes(current)) {
        return "horizontal";
    }

    // If the current instance isn't in either sequence, return null.
    return null;
}

export function isUniqueChildInstance(instanceKey : string, data : any): boolean {
    // Find the parent key of the instance
    const parentKey = findParentKey(data, instanceKey);

    if (parentKey === null) {
        return false;  // If no parent is found, it's not a unique child.
    }

    // Filter the data to get children of the parent
    const childrenOfParent = data.filter((item : any) => item.parentKey === parentKey);

    // If the parent has only one child (our instance), return true
    return childrenOfParent.length === 1;
}

