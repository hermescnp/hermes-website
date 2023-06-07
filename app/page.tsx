"use client"
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Panel } from '@/components/Panel/Panel';
import { HeaderPanel } from '@/components/Header/Headerpanel';
import { HiddenPanel } from '@/components/Panel/Hiddenpanel';
import { Tabsbar } from '@/components/Header/Tabsbar';

const Experience = dynamic(() => import('../components/Experience/Experience'), {
  ssr: false,
  loading: () => <p>loading...</p>
});

export default function Home() {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [displayHiddenPanel, setDisplayHiddenPanel] = useState<boolean>(false);
  const [returnHiddenPanel, setReturnHiddenPanel] = useState<boolean>(false);

  const callExperience = (event: any) => {
    event.stopPropagation();
    setIsClicked(!isClicked);
  };

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

  const panelRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);

  function handleButtonClick() {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    const handleTransitionEnd = () => {
      if (sidebarHidden) {
        setTimeout(() => {
          setDisplayHiddenPanel(true);
        }, 300); // Delay of 0.3 seconds
      }
    };

    const node = sideBarRef.current;
    if (node) {
      node.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      if (node) {
        node.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [sidebarHidden]);

  return (
    <div className="Page">
      <Experience isClicked={isClicked} />

      <div ref={sideBarRef} className={`sideBar${sidebarHidden ? ' hidden' : ''}`}>
        <HeaderPanel onSidebarHide={handleSidebarHide} />
        <Tabsbar handleButtonClick={handleButtonClick} />
        <Panel ref={panelRef} />
      </div>

      <HiddenPanel hidden={!displayHiddenPanel || returnHiddenPanel} onClick={() => handleHiddenPanelClick()} />

      <div role="contentinfo" className="FooterInfo">
        <p className="metaInfo">Web designed and Developed by: Hermes Concepción</p>
        <p className="metaInfo">Last Edit: May 15, 2023</p>
        <button id="testingButton" type="button" className="buttonTest" onClick={callExperience}>Testing Function</button>
      </div>
    </div>
  );
}
