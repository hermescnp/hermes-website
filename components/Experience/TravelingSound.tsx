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
        let audio: HTMLAudioElement | null = null; // Declare an audio variable

        if (travelingData) {
            const soundPath = travelingData.navigationAxis === null
                ? travelingData.isNavDescending
                    ? '/assets/sounds/travelTo_child.mp3'
                    : '/assets/sounds/travelTo_parent.mp3'
                : travelingData.originInstanceLevel > 1
                    ? '/assets/sounds/travelTo_sibling.mp3'
                    : '';

            if (soundPath) {
                audio = new Audio(soundPath);
                if (audio) {
                    audio.volume = travelingData.originInstanceLevel > 1 ? 0.7 : 1; // Adjust volume based on condition
                    audio.play().catch(error => console.error("Audio play failed", error));
                }
            }
        }

        // Cleanup function to stop and remove the audio when the component unmounts or travelingData changes
        return () => {
            if (audio) {
                audio.pause();
                audio.remove();
                audio = null;
            }
        };
    }, [travelingData]);

    return null; // This component doesn't render anything
};
