"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

type ExperienceContextType = {
  isClicked: boolean;
  InstanceBackButton: (vent: any) => void;
  placehover: string | null;
  setPlaceHover: React.Dispatch<React.SetStateAction<string | null>>;
  currentInstance: string;
  setCurrentInstance: React.Dispatch<React.SetStateAction<string>>;
  spaceData: any[];
  loadingState: string;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  loadingProgress: number;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  startExperience: boolean;
  setStartExperience: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [placehover, setPlaceHover] = useState<string | null>(null);
  const [currentInstance, setCurrentInstance] = useState<string>('main');
  const [spaceData, setSpaceData] = useState([]);
  const [loadingState, setLoadingState] = useState('Loading metaverse');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [startExperience, setStartExperience] = useState<boolean>(false);

  const InstanceBackButton = (event: any) => {
    event.stopPropagation();
    setIsClicked(prev => !prev);
  };

  const startIntroButton = (event: any) => {}

  useEffect(() => {
    fetch('/models/space-map.json')
    .then(response => response.json())
    .then(data2 => {
      setSpaceData(data2);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  return (
    <ExperienceContext.Provider value={{
      isClicked,
      InstanceBackButton,
      placehover,
      setPlaceHover,
      currentInstance,
      setCurrentInstance,
      spaceData,
      loadingState,
      setLoadingState,
      loadingProgress,
      setLoadingProgress,
      startExperience,
      setStartExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperienceContext = (): ExperienceContextType => {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error("useExperienceContext must be used within ExperienceProvider");
  }
  return context;
};
