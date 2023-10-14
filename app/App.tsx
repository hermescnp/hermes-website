"use client"
import './globals.css'
import React, { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
import { MetaverseActions } from '@/components/Navbar/MetaverseActions'
import { LoadingPage } from '@/components/LoadingPage'
import { useExperienceContext } from '@/context/ExperienceContext'

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
  }

  useEffect(() => {
    setIsMapOpened(false);
  }, []);

  return (
    <html lang="en">
      <body className='Layout'>
        <Navbar isClient={isClient} isPortrait={isPortraitModeRef.current} isMapOpened={isMapOpened} />
        <MetaverseActions openSpaceMapWindow={openSpaceMapWindow} isMapOpened={isMapOpened}/>
        <div className={inter.className}>{children}</div>
        {displayLoading ? <LoadingPage isClient={isClient} /> : null}
      </body>
    </html>
  );
}

export default App;
