"use client"
import React, { useEffect } from 'react';

type TravelingDataProps = {
    travelingData: {
        navigationAxis: string;
        isNavDescending?: boolean;
        originInstanceLevel: number;
    } | null;
};

export const PlayTravelingSound: React.FC<TravelingDataProps> = ({ travelingData }) => {

    useEffect(() => {
        if (travelingData) {
            if (travelingData.navigationAxis === null) {
                if (travelingData.isNavDescending) {
                    const child = new Audio('/assets/sounds/travelTo_child.mp3');
                    child.play();
                } else {
                    const parent = new Audio('/assets/sounds/travelTo_parent.mp3');
                    parent.play();
                }
            }
            else if (travelingData.originInstanceLevel > 1) {
                const sibling = new Audio('/assets/sounds/travelTo_sibling.mp3');
                sibling.volume = 0.7;
                sibling.play();
            }
        }
    }, [travelingData]);

    return null;
}
