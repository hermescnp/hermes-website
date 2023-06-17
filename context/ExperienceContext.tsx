"use client"
import React, { createContext, useState, useContext } from 'react';

type ExperienceContextType = {
  isClicked: boolean;
  InstanceBackButton: (vent: any) => void;
  placehover: string | null;
  setPlaceHover: React.Dispatch<React.SetStateAction<string | null>>;
  currentInstance: string;
  setCurrentInstance: React.Dispatch<React.SetStateAction<string>>;
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [placehover, setPlaceHover] = useState<string | null>(null);
  const [currentInstance, setCurrentInstance] = useState<string>('main');

  const InstanceBackButton = (event: any) => {
    event.stopPropagation();
    setIsClicked(prev => !prev);
  };

  return (
    <ExperienceContext.Provider value={{ isClicked, InstanceBackButton, placehover, setPlaceHover, currentInstance, setCurrentInstance }}>
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
