"use client"
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Panel } from '@/components/Panel/Panel';
import { HeaderPanel } from '@/components/Header/Headerpanel';
import { HiddenPanel } from '@/components/Panel/Hiddenpanel';
import { Tabsbar } from '@/components/Header/Tabsbar';
import { Author } from '@/components/Header/Author'
import { useExperienceContext } from '@/context/ExperienceContext';

const Experience = dynamic(() => import('../components/Experience/Experience'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

export default function Home() {
  const { isClicked } = useExperienceContext();
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(true);
  const [displayHiddenPanel, setDisplayHiddenPanel] = useState<boolean>(true);
  const [returnHiddenPanel, setReturnHiddenPanel] = useState<boolean>(false);
  const [panelData, setPanelData] = useState([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);

  // Create refs for each section
  const skillRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const softwareRef = useRef<HTMLDivElement>(null);

  const handleSidebarHide = (hidden: boolean) => {
    setSidebarHidden(hidden);
  };

  const handleHiddenPanelClick = () => {
    setReturnHiddenPanel(true);
    setTimeout(() => {
      setDisplayHiddenPanel(false);
      setReturnHiddenPanel(false);
    }, 300);
    setTimeout(() => setSidebarHidden(false), 300);
  };

  const handleSidebarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };  

  useEffect(() => {
    fetch('/user/data.json')
      .then(response => response.json())
      .then(data => {
        setPanelData(data);
      })
      .catch(error => console.error('Error:', error));

    const handleTransitionEnd = () => {
      if (sidebarHidden) {
        setTimeout(() => {
          setDisplayHiddenPanel(true);
        }, 300); // Delay of 0.3 seconds
      }
    };

    const node = sideBarRef.current;
    node?.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      node?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [sidebarHidden]);

  const handleRefClick = (sectionId: string) => {
    const sectionRef = sectionId === "SkillSection" ? skillRef :
      sectionId === "FormationBackground" ? backgroundRef :
        softwareRef;
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="Page">
      <Experience isClicked={isClicked} />
      <Author />

      <div ref={sideBarRef} className={`sideBar${sidebarHidden ? ' hidden' : ''}`} onClick={handleSidebarClick}>
        <HeaderPanel onSidebarHide={handleSidebarHide} />
        <Tabsbar
          handleRefClick={handleRefClick} />
        <Panel data={panelData} ref={panelRef} skillRef={skillRef} backgroundRef={backgroundRef} softwareRef={softwareRef} />
      </div>

      <HiddenPanel
        hidden={!displayHiddenPanel || returnHiddenPanel}
        onClick={() => handleHiddenPanelClick()}
        handleRefClick={handleRefClick}
      />
    </div>
  );
}

