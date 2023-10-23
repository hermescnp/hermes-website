"use client"
import React, { createContext, useState, useContext, useEffect } from 'react'
import useHistory from './LeGineHooks'
import {getDefaultTravelingData} from '@/components/Experience/InstanceTraveler'

type ExperienceContextType = {
  isClicked: boolean;
  InstanceBackButton: (vent: any) => void;
  placehover: PlaceHoverType;
  setPlaceHover: React.Dispatch<React.SetStateAction<PlaceHoverType>>;
  history: string[];
  pushToHistory: (item: string) => void;
  stepBackHistory: () => void;
  getLastHistoryItem: () => string;
  getPrevHistoryItem: () => string;
  spaceData: any[];
  setSpaceData: React.Dispatch<React.SetStateAction<any[]>>;
  loadingState: string;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  loadingProgress: number;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  startExperience: boolean;
  setStartExperience: React.Dispatch<React.SetStateAction<boolean>>;
  travelingData: any;
  setTravelingData: React.Dispatch<React.SetStateAction<any>>;
}

type PlaceHoverType = {
  name: string | null;
  isSibling: boolean | null;
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [placehover, setPlaceHover] = useState<PlaceHoverType>({ name: '', isSibling: null });
  const [spaceData, setSpaceData] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState('Loading metaverse');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [startExperience, setStartExperience] = useState<boolean>(false);
  const [history, pushToHistory, stepBackHistory, clearHistory, getLastHistoryItem, getPrevHistoryItem] = useHistory();
  const [travelingData, setTravelingData] = useState<any>(getDefaultTravelingData(spaceData));

  const InstanceBackButton = (event: any) => {
    event.stopPropagation();
    setIsClicked(prev => !prev);
  };

  return (
    <ExperienceContext.Provider value={{
      isClicked,
      InstanceBackButton,
      placehover,
      setPlaceHover,
      history,
      pushToHistory,
      stepBackHistory,
      getLastHistoryItem,
      getPrevHistoryItem,
      spaceData,
      setSpaceData,
      loadingState,
      setLoadingState,
      loadingProgress,
      setLoadingProgress,
      startExperience,
      setStartExperience,
      travelingData,
      setTravelingData }}>
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
