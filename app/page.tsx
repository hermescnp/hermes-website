"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Author } from '@/components/Header/Author';
import { useExperienceContext } from '@/context/ExperienceContext';
import { WEBGL_UNAVAILABLE, WebGLBoundary, canCreateWebGL } from '@/components/Canvas/WebGLGuard';

const CanvasComponent = dynamic(() => import('../components/Canvas/Canvas'), {
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
  const { spaceData, setLoadingState } = experienceContext; // Destructure spaceData from context
  const history = experienceContext.history;
  const [currentInstance, setCurrentInstance] = useState<string>('main');
  const [webglReady, setWebglReady] = useState<boolean | null>(null);

  useEffect(() => {
    const lastItem = getLastItem(history);
    if (lastItem) {
      setCurrentInstance(lastItem);
    }
  }, [history]);

  useEffect(() => {
    const supported = canCreateWebGL();
    setWebglReady(supported);
    if (!supported) setLoadingState(WEBGL_UNAVAILABLE);
  }, [setLoadingState]);

  const handleWebGLError = (error: Error) => {
    console.error(error);
    setWebglReady(false);
    setLoadingState(WEBGL_UNAVAILABLE);
  };

  // Conditionally render the CanvasComponent only if spaceData is available
  return (
    <div className="Page">
      {spaceData && webglReady ? (  // Check if spaceData is loaded before rendering CanvasComponent
        <WebGLBoundary onError={handleWebGLError}>
          <CanvasComponent />
        </WebGLBoundary>
      ) : webglReady === false ? null : (
        <p>Loading space data...</p> // Fallback content while waiting for spaceData
      )}
      <Author isVisible={currentInstance === 'main'} />
    </div>
  );
}
