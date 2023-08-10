import React from 'react'

export default function calculateInstanceLevel(instanceKey : string, data : any) {
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


