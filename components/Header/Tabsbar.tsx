import React, { useRef } from "react";
import '../../styles/Tabsbar.css';

interface TabsbarProps {
    handleButtonClick: () => void;
}

export const Tabsbar = ({handleButtonClick}: TabsbarProps) => {

    return (
        <div>
            <nav id="NavPanel">
                <button id="skillsButton" className="Tab" onClick={handleButtonClick}><a href="#SkillSection">Skills</a></button>
                <button id="backgroundButton" className="Tab" onClick={handleButtonClick}><a href="#FormationBackground">Background</a></button>
                <button id="softwaresButton" className="Tab" onClick={handleButtonClick}><a href="#SoftwareSection">Softwares</a></button>
            </nav>
            <div id="snakeSpace">
                <svg id="snakeElement" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194.12 4.56">
                    <defs>

                    </defs>
                    <path className="cls-1" d="M0,4.56H194.12S161,4.75,129.41,2.07c-32.35-2.76-32.35-2.76-64.7,0C42.55,4,0,4.56,0,4.56Z" />
                </svg>
            </div>
        </div>
    )
}