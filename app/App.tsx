"use client"
import './globals.css'
import React, { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
import { MetaverseActions } from '@/components/Navbar/MetaverseActions'
import { LoadingPage } from '@/components/LoadingPage'
import { useExperienceContext } from '@/context/ExperienceContext'
import { UserPanel } from '@/components/UserPanel/UserPanel'
import { Tabsbar } from '@/components/Header/Tabsbar'
import { Uxhelper } from '@/components/Uxhelper/Uxhelper'
import { PlayTravelingSound } from '@/components/Experience/TravelingSound'
import { Userbar } from '@/components/Navbar/Userbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Hermes's Virtual Office",
  description: 'UX/Technical Artist | Professional Musician Portfolio',
}

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const experienceContext = useExperienceContext();
  const loadingState = isClient ? experienceContext.loadingState : '';
  const [displayLoading, setDisplayLoading] = useState<boolean>(true);
  const [isPortraitMode, setIsPortraitMode] = useState<boolean>(false);
  const isPortraitModeRef = useRef<boolean>(isPortraitMode);
  const [isMapOpened, setIsMapOpened] = useState<boolean>(true);
  const isExperienceStarted = experienceContext.startExperience;
  const travelingData = experienceContext.travelingData;
  const [paperLTRSound, setPaperLTRSound] = useState<HTMLAudioElement | null>(null);
  const [paperRTLSound, setPaperRTLSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements when the component mounts
    setPaperLTRSound(new Audio('/assets/sounds/LtoR_paper.mp3'));
    setPaperRTLSound(new Audio('/assets/sounds/RtoL_paper.mp3'));
    
    // Cleanup audio resources when the component is unmounted
    return () => {
        paperLTRSound?.pause();
        paperLTRSound?.remove();
        paperRTLSound?.pause();
        paperRTLSound?.remove();
    }
}, []);

  // Function to update orientation mode
  useEffect(() => {
    setIsClient(true);
    setIsPortraitMode(window.innerHeight > window.innerWidth);
    isPortraitModeRef.current = window.innerHeight > window.innerWidth;

    const updateOrientationMode = () => {
      setIsPortraitMode(window.innerHeight > window.innerWidth);
      isPortraitModeRef.current = window.innerHeight > window.innerWidth;
    };

    window.addEventListener('orientationchange', updateOrientationMode);
    window.addEventListener('resize', updateOrientationMode);
  }, []);

  useEffect(() => {
    if (loadingState === 'started') {
      // Wait for 2 seconds before hiding the loading screen
      const timer = setTimeout(() => {
        setDisplayLoading(false);
      }, 2000); // 2-second delay

      return () => clearTimeout(timer); // Cleanup timer on component unmount or if loadingState changes
    }
  }, [loadingState]);

  useEffect(() => {
    setIsClient(true);
    setIsMapOpened(false);
  }, []);

  useEffect(() => {
    isPortraitModeRef.current = isPortraitMode;
  }, [isPortraitMode]);

  useEffect(() => {
    setIsMapOpened(false);
  }, []);

  useEffect(() => {
    fetch('/user/data.json')
      .then(response => response.json())
      .then(data => {
        experienceContext.setUserData(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    fetch('/models/space-map.json')
    .then(response => response.json())
    .then(data2 => {
      experienceContext.setSpaceData(data2);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar isClient={isClient} />
        <Userbar />
        <div className={inter.className}>{children}</div>
        {displayLoading ? <LoadingPage isClient={isClient} /> : null}
        <Uxhelper isNotVisible={isMapOpened && isPortraitModeRef.current}/>
        {isExperienceStarted? <PlayTravelingSound travelingData={travelingData}/> : null}
      </body>
    </html>
  );
}

export default App;
