import React, { useState, useEffect } from 'react'
import '../styles/LoadingPage.css'
import Image from 'next/image'
import logo from 'public/assets/SVG/office_logo.svg'
import { useExperienceContext } from '@/context/ExperienceContext'

interface LoadingScreenProps {
    isClient: boolean;
}

export const LoadingPage: React.FC<LoadingScreenProps> = ({ isClient }) => {
    const experienceContext = useExperienceContext();
    const loadingState = isClient ? experienceContext.loadingState : 'Running System';
    const loadingProgress = isClient ? experienceContext.loadingProgress : 0;
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isExperienceStarted, setIsExperienceStarted] = useState<boolean>(false);
    const [loadingStateList, setLoadingStateList] = useState<string[]>([]);

    // Test if model is ready
    useEffect(() => {
        if ( loadingState === 'Office loaded' ) {
            setTimeout(()=>{
                setIsReady(true);
            }, 1000)
        }
        if ( loadingState === 'started' ) {
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
        const backgroundMusic = new Audio('/assets/sounds/background_music.mp3');
        backgroundMusic.volume = 1;
        backgroundMusic.loop = true;
        backgroundMusic.play();
        const audio = new Audio('/assets/sounds/waterdrop_button.mp3');
        audio.volume = 0.3;
        audio.play();
    }

    const stopClickPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
      };  

    return (
        <div className={isExperienceStarted? 'LoadingPage Invisible' : 'LoadingPage'} onClick={stopClickPropagation}>
            <Image id="officeLogo" className={isExperienceStarted? 'OfficeLogo Inflated' : 'OfficeLogo'} src={logo} width={200} height={200} alt="Logo" />
            <div className='LoadingBar'>
                <progress className='LoadingProgress' value={(loadingProgress/2) + (loadingStateList.length * 10)} max="100"></progress>
            </div>
            <div className='LoadingText'>{`${isReady ? 'The office is ready!' : loadingState + '...'}`}</div>
            <button className={isReady? 'StartButton Visible' : 'StartButton'} onClick={handleStart} >START EXPERIENCE</button>
        </div>
    )
}
