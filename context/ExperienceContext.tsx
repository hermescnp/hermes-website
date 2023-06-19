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
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [placehover, setPlaceHover] = useState<string | null>(null);
  const [currentInstance, setCurrentInstance] = useState<string>('main');
  const [spaceData, setSpaceData] = useState([]);

  const InstanceBackButton = (event: any) => {
    event.stopPropagation();
    setIsClicked(prev => !prev);
  };

  useEffect(() => {
    fetch('/models/space-map.json')
    .then(response => response.json())
    .then(data2 => {
      setSpaceData(data2);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  return (
    <ExperienceContext.Provider value={{ isClicked, InstanceBackButton, placehover, setPlaceHover, currentInstance, setCurrentInstance, spaceData }}>
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
