"use client"
import './globals.css'
import React, { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
import { MetaverseActions } from '@/components/Navbar/MetaverseActions'
import { LoadingPage } from '@/components/LoadingPage'
import { useExperienceContext } from '@/context/ExperienceContext'
import { Panel } from '@/components/Panel/Panel'
import { Tabsbar } from '@/components/Header/Tabsbar'
import { Uxhelper } from '@/components/Uxhelper/Uxhelper'
import { PlayTravelingSound } from '@/components/Experience/TravelingSound'

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
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(false);
  const [panelData, setPanelData] = useState([]);
  const isExperienceStarted = experienceContext.startExperience;
  const travelingData = experienceContext.travelingData;
  const [paperLTRSound, setPaperLTRSound] = useState<HTMLAudioElement | null>(null);
  const [paperRTLSound, setPaperRTLSound] = useState<HTMLAudioElement | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Create refs for each section
  const skillRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);

  const handleSidebarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleRefClick = (sectionId: string) => {
    const sectionRef = sectionId === "SkillSection" ? skillRef :
      sectionId === "FormationBackground" ? backgroundRef :
        softwareRef;
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      setTimeout(() => { setDisplayLoading(false) }, 2000)
    }
  }, [loadingState]);

  useEffect(() => {
    setIsClient(true);
    setIsMapOpened(false);
  }, []);

  useEffect(() => {
    isPortraitModeRef.current = isPortraitMode;
  }, [isPortraitMode]);

  const openSpaceMapWindow = () => {
    setIsMapOpened(prevState => !prevState);
    if (paperRTLSound) {
      paperRTLSound.volume = 1;
      paperRTLSound.play();
    }
  }

  useEffect(() => {
    setIsMapOpened(false);
  }, []);

  const handleAboutButtonClick = () => {
    setIsSidebarOpened(prevState => !prevState);
    if (paperLTRSound) {
      paperLTRSound.volume = 1;
      paperLTRSound.play();
    }
  };

  useEffect(() => {
    fetch('/user/data.json')
      .then(response => response.json())
      .then(data => {
        setPanelData(data);
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
      <body className='Layout'>
        <Navbar isClient={isClient} isPortrait={isPortraitModeRef.current} isMapOpened={isMapOpened} handleAboutButtonClick={handleAboutButtonClick} isSidebarOpened={isSidebarOpened} />

        <MetaverseActions openSpaceMapWindow={openSpaceMapWindow} isMapOpened={isMapOpened} />

        <div className={inter.className}>{children}</div>

        <div ref={sidebarRef} className={`sideBar${isSidebarOpened ? '' : ' hidden'}`} onClick={handleSidebarClick}>
          <Tabsbar
            handleRefClick={handleRefClick} />
          <Panel data={panelData} ref={panelRef} skillRef={skillRef} backgroundRef={backgroundRef} softwareRef={softwareRef} />
        </div>
        {displayLoading ? <LoadingPage isClient={isClient} /> : null}
        <Uxhelper isNotVisible={isMapOpened || isSidebarOpened && isPortraitModeRef.current}/>
        {isExperienceStarted? <PlayTravelingSound travelingData={travelingData}/> : null}
      </body>
    </html>
  );
}

export default App;
