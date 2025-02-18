/* import React from 'react'

export default function InstanceControls(key: string, data: any) {
    // Ensure data is an array
    if (!Array.isArray(data)) {
        console.error("Data is not an array");
        // Return default controls if data is not an array
        return {
            maxDistance: 28,
            minDistance: 18,
            maxAzimuthAngle: 0,
            minAzimuthAngle: -1.60,
            maxPolarAngle: Math.PI/2.40,
            minPolarAngle: Math.PI/3.10
        };
    }

    // Get the item from the data array
    const instance = data.find((item: any) => item.key === key);

    // Check if instance is undefined
    if (!instance) {
        console.error(`Instance with key ${key} not found in data`);
        // Return default controls if instance is not found
        return {
            maxDistance: 28,
            minDistance: 18,
            maxAzimuthAngle: 0,
            minAzimuthAngle: -1.60,
            maxPolarAngle: Math.PI/2.40,
            minPolarAngle: Math.PI/3.10
        };
    }

    const instanceControls = {
        "maxDistance": instance.maxDistance,
        "minDistance": instance.minDistance,
        "maxAzimuthAngle": instance.maxAzimuthAngle,
        "minAzimuthAngle": instance.minAzimuthAngle,
        "maxPolarAngle": instance.maxPolarAngle,
        "minPolarAngle": instance.minPolarAngle,
    };

    return instanceControls;
}
 */