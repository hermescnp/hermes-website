import React from 'react'

export default function InstanceControls(key : string, data : any) {

    // get the item from the data array
    const instance = data.find((item : any) => item.key === key);

    const instanceControls = {
        "maxDistance": instance.maxDistance,
        "minDistance": instance.minDistance,
        "maxAzimuthAngle": instance.maxAzimuthAngle,
        "minAzimuthAngle": instance.minAzimuthAngle,
        "maxPolarAngle": instance.maxPolarAngle,
        "minPolarAngle": instance.minPolarAngle,
    }
  return instanceControls
}
