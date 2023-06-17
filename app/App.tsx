"use client"
import './globals.css'
import React, { useState, useEffect } from 'react';
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
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    return (
      <html lang="en">
        <body className='Layout'>
          <Navbar handleBackButton={InstanceBackButton} placehover={placehover} />
          <div className={inter.className}>{children}</div>
        </body>
      </html>
    );
}

export default App;
