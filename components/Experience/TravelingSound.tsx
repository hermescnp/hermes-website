"use client"
import React, { useEffect } from 'react'
import { useExperienceContext } from '@/context/ExperienceContext'
import { isInstanceDescendant, isInstanceSibling } from '@/components/Experience/InstanceAnalyzer'

export const PlayTravelingSound: React.FC = () => {
    const { getLastHistoryItem, history, getPrevHistoryItem, spaceData } = useExperienceContext();

    useEffect(() => {
        const isNavigationDescending = isInstanceDescendant(getLastHistoryItem(), getPrevHistoryItem(), spaceData);
        const isParallelNavigation = isInstanceSibling(getLastHistoryItem(), getPrevHistoryItem(), spaceData)
        let soundPath = ''
        let audio: HTMLAudioElement | null = null

        if (isNavigationDescending) {
            soundPath = '/assets/sounds/travelTo_child.mp3'
        } else if (isParallelNavigation) {
            soundPath = '/assets/sounds/travelTo_sibling.mp3'
        } else {
            soundPath = '/assets/sounds/travelTo_parent.mp3'
        }
        if (soundPath) {
            audio = new Audio(soundPath);
            if (audio) {
                audio.volume = 1;
                audio.play().catch(error => console.error("Audio play failed", error));
            }
        }
        // Cleanup function to stop and remove the audio when the component unmounts or travelingData changes
        return () => {
            if (audio) {
                audio.pause()
                audio.remove()
                audio = null
            }
        };
    }, [history])

    return null
};
