"use client"
import React, { useState, useEffect } from 'react'
import '../styles/LoadingPage.css'
import Image from 'next/image'
import { useExperienceContext } from '@/context/ExperienceContext'

interface LoadingScreenProps {
    isClient: boolean;
}

export const LoadingPage: React.FC<LoadingScreenProps> = ({ isClient }) => {
    const experienceContext = useExperienceContext()
    const loadingState = isClient ? experienceContext.loadingState : 'Running System'
    const loadingProgress = isClient ? experienceContext.loadingProgress : 0
    const [isReady, setIsReady] = useState<boolean>(false)
    const [isExperienceStarted, setIsExperienceStarted] = useState<boolean>(false)
    const [loadingStateList, setLoadingStateList] = useState<string[]>([])
    const [blink, setBlink] = useState<boolean>(false)
    const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    // New state to handle background opacity
    const [fadeOutBackground, setFadeOutBackground] = useState<boolean>(false);

    useEffect(() => {
        // Create audio elements when the component mounts
        setBackgroundMusic(new Audio('/assets/sounds/background_music.mp3'));
        setAudio(new Audio('/assets/sounds/waterdrop_button.mp3'));

        // Cleanup audio resources when the component is unmounted
        return () => {
            backgroundMusic?.pause();
            backgroundMusic?.remove();
            audio?.pause();
            audio?.remove();
        }
    }, []);

    // Test if model is ready
    useEffect(() => {
        if (loadingState === 'Office loaded') {
            setTimeout(() => {
                setIsReady(true);
            }, 1000)
        }
        if (loadingState === 'started') {
            setIsExperienceStarted(true);
        }
        pushLoadingState(loadingState);
    }, [loadingState]);

    const pushLoadingState = (item: string) => {
        setLoadingStateList((prevLoadingStates) => {
            return [...prevLoadingStates, item];
        });
    };

    const handleStart = () => {
        experienceContext.setLoadingState('started');
        experienceContext.setStartExperience(true);

        if (backgroundMusic) {
            backgroundMusic.volume = 1;
            backgroundMusic.loop = true;
            backgroundMusic.play();
        }

        if (audio) {
            audio.volume = 0.3;
            audio.play();
        }

        // Trigger the background fade out after 2 seconds
        setTimeout(() => {
            setFadeOutBackground(true);
        }, 1000);
    }

    const playHoverStartButtonSound = () => {
        const audio = new Audio('/assets/sounds/switch_effect.mp3');
        audio.volume = 0.3;
        audio.playbackRate = 3;
        audio.preservesPitch = false;
        audio.play().catch((error) => { });
    }

    const stopClickPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return (
        <div className={`${fadeOutBackground ? 'LoadingPage Invisible' : 'LoadingPage'}`} onClick={stopClickPropagation}>
            <Image id="officeLogo" className={isExperienceStarted ? 'OfficeLogo Inflated' : 'OfficeLogo'} src={'/assets/SVG/office_logo.svg'} width={200} height={200} alt="Logo" />
            <div className={isExperienceStarted ? 'LoadingBar Hidden' : 'LoadingBar'}>
                <progress className='LoadingProgress' value={(loadingProgress / 2) + (loadingStateList.length * 10)} max="100"></progress>
            </div>
            <div className={isExperienceStarted ? 'LoadingText Hidden' : 'LoadingText'}>{`${isReady ? 'The office is ready!' : loadingState + '...'}`}</div>
            <div className={'start-button-wrapper' + (isReady ? ' visible' : '') + (isExperienceStarted ? ' MoveOut' : '')}>
                <button
                    className={'StartButton'}
                    onClick={handleStart} onMouseEnter={playHoverStartButtonSound}
                >
                    START EXPERIENCE
                </button>
            </div>

        </div>
    )
}
