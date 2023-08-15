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
    const [isPortraitMode, setIsPortraitMode] = useState<boolean>(window.innerHeight > window.innerWidth);
    const isPortraitModeRef = useRef<boolean>(isPortraitMode);

    // Function to update orientation mode
    const updateOrientationMode = () => {
      const newIsPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortraitMode(newIsPortraitMode);
      isPortraitModeRef.current = newIsPortraitMode;
    };

    // Function to handle screen orientation change
    const handleOrientationChange = () => {
      updateOrientationMode();
    };

    // Function to handle window resize
    const handleWindowResize = () => {
      updateOrientationMode();
    };

    // Add event listeners for orientation change and window resize
    useEffect(() => {
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
      console.log(isPortraitMode);
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
