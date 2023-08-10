"use client"
import './globals.css'
import React, { useState, useEffect } from 'react'
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

    useEffect(() => {
      if ( loadingState === 'started' ) {
          setTimeout(()=>{setDisplayLoading(false)}, 2000)
      }
  }, [loadingState]);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    return (
      <html lang="en">
        <body className='Layout'>
          <Navbar isClient={isClient} />
          <div className={inter.className}>{children}</div>
          {displayLoading? <LoadingPage isClient={isClient} /> : null}
        </body>
      </html>
    );
}

export default App;
