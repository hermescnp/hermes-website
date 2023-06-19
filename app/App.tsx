"use client"
import './globals.css'
import React, { useState, useEffect, use } from 'react';
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar/Navbar';

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
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    return (
      <html lang="en">
        <body className='Layout'>
          <Navbar isClient={isClient} />
          <div className={inter.className}>{children}</div>
        </body>
      </html>
    );
}

export default App;
