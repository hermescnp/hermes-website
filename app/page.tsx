"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Author } from '@/components/Header/Author';
import { useExperienceContext } from '@/context/ExperienceContext';

const Experience = dynamic(() => import('../components/Experience/Experience'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

const getLastItem = (array: any): string | null => {
  if (array.length > 0) {
    return array[array.length - 1];
  }
  return null;
};

export default function Home() {
  const experienceContext = useExperienceContext();
  const { isClicked, spaceData } = experienceContext; // Destructure spaceData from context
  const history = experienceContext.history;
  const [currentInstance, setCurrentInstance] = useState<string>('main');

  useEffect(() => {
    const lastItem = getLastItem(history);
    if (lastItem) {
      setCurrentInstance(lastItem);
    }
  }, [history]);

  // Conditionally render the Experience component only if spaceData is available
  return (
    <div className="Page">
      {spaceData ? (  // Check if spaceData is loaded before rendering Experience
        <Experience isClicked={isClicked} />
      ) : (
        <p>Loading space data...</p> // Fallback content while waiting for spaceData
      )}
      <Author isVisible={currentInstance === 'main'} />
    </div>
  );
}
