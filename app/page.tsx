"use client"
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Author } from '@/components/Header/Author'
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
}

export default function Home() {
  const { isClicked } = useExperienceContext();
  const experienceContext = useExperienceContext();
  const history = experienceContext.history;
  const [currentInstance, setCurrentInstance] = useState<string>('main');

  useEffect(() => {
    const lastItem = getLastItem(history);
    if (lastItem) {
      setCurrentInstance(lastItem);
    }
  }, [history]);

  return (
    <div className="Page">
      <Experience isClicked={isClicked} />
      <Author isVisible={currentInstance === 'main'}/>
    </div>
  );
}

