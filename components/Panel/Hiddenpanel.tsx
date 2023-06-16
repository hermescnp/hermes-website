import React, { useState, useEffect } from "react";
import Image from 'next/image';
import '../../styles/Hiddenpanel.css';
import chevron from 'public/assets/SVG/Chevron.svg';

interface HiddenPanelProps {
  hidden: boolean;
  onClick: () => void;
  handleRefClick: (sectionId: string) => void;
}

export const HiddenPanel = ({ hidden, onClick, handleRefClick }: HiddenPanelProps) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = () => {
      setIsPortrait(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleOrientationChange);

    // Set initial state
    handleOrientationChange();

    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  const transformStyle = isPortrait ? (hidden ? 'translateY(100%)' : 'translateY(0)') : (hidden ? 'translateX(-100%)' : 'translateX(0)');

  return (
    <div
      className="HiddenPanel"
      style={{
        transform: transformStyle,
        opacity: hidden ? '0' : '1',
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out, padding-left 0.1s ease-in-out, padding-bottom 0.1s ease-in-out'
      }}
      onClick={onClick} >

      <Image id="unhideButton" src={chevron} width={22} height={22} alt="See More" />
      <div className="hiddenBarContainer">
        <button id="skillsMinimized" className="hiddenBarTextContainer" onClick={() => handleRefClick('SkillSection')}><a className="hiddenBarText">Skills</a></button>
        <p className="barTextSeparator">|</p>
        <button id="backgroundMinimized" className="hiddenBarTextContainer" onClick={() => handleRefClick('FormationBackground')}><a className="hiddenBarText">Background</a></button>
        <p className="barTextSeparator">|</p>
        <button id="softwaresMinimized" className="hiddenBarTextContainer" onClick={() => handleRefClick('SoftwareSection')}><a className="hiddenBarText">Softwares</a></button>
      </div>
    </div>
  );
};
