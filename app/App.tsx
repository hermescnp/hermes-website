"use client"
import './globals.css'
import React, { useState, useEffect, use } from 'react';
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar';
import { ExperienceProvider, useExperienceContext } from '@/context/ExperienceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Hermes's Virtual Office",
  description: 'UX/Technical Artist | Professional Musician Portfolio',
}

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const experienceContext = useExperienceContext();

    const InstanceBackButton = isClient ? experienceContext.InstanceBackButton : () => {};
    const placehover = isClient ? experienceContext.placehover : null;
    const currentInstance = isClient ? experienceContext.currentInstance : 'main';
    const setCurrentInstance = isClient ? experienceContext.setCurrentInstance : () => {};

    useEffect(() => {
      console.log(currentInstance);
    }, [currentInstance]);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    return (
      <html lang="en">
        <body className='Layout'>
          <Navbar handleBackButton={InstanceBackButton} placehover={placehover} currentInstance={currentInstance} setCurrentInstance={setCurrentInstance} />
          <div className={inter.className}>{children}</div>
        </body>
      </html>
    );
}

export default App;
