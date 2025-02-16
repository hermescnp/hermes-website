"use client"
import React, { createContext, useState, useContext, useEffect } from 'react'
import { useHistory } from './LeGineHooks'
import { getDefaultTravelingData } from '@/components/Experience/InstanceTraveler'

type ExperienceContextType = {
  placehover: PlaceHoverType;
  setPlaceHover: React.Dispatch<React.SetStateAction<PlaceHoverType>>;
  history: string[];
  pushToHistory: (item: string) => void;
  stepBackHistory: () => void;
  getLastHistoryItem: () => string;
  getPrevHistoryItem: () => string;
  spaceData: any[];
  setSpaceData: React.Dispatch<React.SetStateAction<any[]>>;
  userData: any[];
  setUserData: React.Dispatch<React.SetStateAction<any[]>>;
  loadingState: string;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  loadingProgress: number;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  startExperience: boolean;
  setStartExperience: React.Dispatch<React.SetStateAction<boolean>>;
  travelingData: any;
  setTravelingData: React.Dispatch<React.SetStateAction<any>>;
  isInfoPanelExpanded: boolean;
  setIsInfoPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isUserPanelExpanded: boolean;
  setIsUserPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchBarActive: boolean;
  setIsSearchBarActive: React.Dispatch<React.SetStateAction<boolean>>;
  isPortraitMode: boolean;
  setIsPortraitMode: React.Dispatch<React.SetStateAction<boolean>>;
  isCursorTargeting: boolean;
  setIsCursorTargeting: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundMusic: HTMLAudioElement | null;
  setBackgroundMusic: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  pauseBackgroundMusic: () => void;
}

type PlaceHoverType = {
  key: string | null;
  name: string | null;
  isChild: boolean | null;
  isParent: boolean | null;
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [placehover, setPlaceHover] = useState<PlaceHoverType>({ key: '', name: '', isChild: null, isParent: null });
  const [spaceData, setSpaceData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState('Loading metaverse');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [startExperience, setStartExperience] = useState<boolean>(false);
  const [history, pushToHistory, stepBackHistory, clearHistory, getLastHistoryItem, getPrevHistoryItem] = useHistory();
  const [travelingData, setTravelingData] = useState<any>(getDefaultTravelingData(spaceData));
  const [isInfoPanelExpanded, setIsInfoPanelExpanded] = useState<boolean>(false);
  const [isUserPanelExpanded, setIsUserPanelExpanded] = useState<boolean>(false);
  const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false);
  const [isPortraitMode, setIsPortraitMode] = useState<boolean>(false);
  const [isCursorTargeting, setIsCursorTargeting] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  // NEW: helper to pause background music directly.
  const pauseBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  };

  return (
    <ExperienceContext.Provider value={{
      placehover,
      setPlaceHover,
      history,
      pushToHistory,
      stepBackHistory,
      getLastHistoryItem,
      getPrevHistoryItem,
      spaceData,
      setSpaceData,
      userData,
      setUserData,
      loadingState,
      setLoadingState,
      loadingProgress,
      setLoadingProgress,
      startExperience,
      setStartExperience,
      travelingData,
      setTravelingData,
      isInfoPanelExpanded,
      setIsInfoPanelExpanded,
      isUserPanelExpanded,
      setIsUserPanelExpanded,
      isSearchBarActive,
      setIsSearchBarActive,
      isPortraitMode,
      setIsPortraitMode,
      isCursorTargeting,
      setIsCursorTargeting,
      backgroundMusic,
      setBackgroundMusic,
      pauseBackgroundMusic, // NEW added function
    }}>
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
