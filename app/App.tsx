"use client"
import './globals.css'
import React, { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar'
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

    // Function to update orientation mode
    useEffect(() => {
      setIsClient(true);
      setIsPortraitMode(window.innerHeight > window.innerWidth);
      isPortraitModeRef.current = window.innerHeight > window.innerWidth;
  
      const updateOrientationMode = () => {
        setIsPortraitMode(window.innerHeight > window.innerWidth);
        isPortraitModeRef.current = window.innerHeight > window.innerWidth;
      };
  
      const handleOrientationChange = () => {
        updateOrientationMode();
      };
  
      const handleWindowResize = () => {
        updateOrientationMode();
      };
  
      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleWindowResize);
  
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);

    useEffect(() => {
      if ( loadingState === 'started' ) {
          setTimeout(()=>{setDisplayLoading(false)}, 2000)
      }
  }, [loadingState]);
  
    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      isPortraitModeRef.current = isPortraitMode;
  }, [isPortraitMode]);
  
    return (
      <html lang="en">
        <body className='Layout'>
          <Navbar isClient={isClient} isPortrait={isPortraitModeRef.current} />
          <div className={inter.className}>{children}</div>
          {displayLoading? <LoadingPage isClient={isClient} /> : null}
        </body>
      </html>
    );
}

export default App;
