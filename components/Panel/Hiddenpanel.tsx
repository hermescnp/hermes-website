import React from "react";
import Image from 'next/image';
import '../../styles/Hiddenpanel.css';
import chevron from 'public/assets/SVG/Chevron.svg';

interface HiddenPanelProps {
    hidden: boolean;
    onClick: () => void;
    handleButtonClick: () => void;
}

export const HiddenPanel = ({ hidden, onClick, handleButtonClick }: HiddenPanelProps) => {
    return (
        <div
            className="HiddenPanel"
            style={{
                transform: hidden ? 'translateX(-100%)' : 'translateX(0)',
                opacity: hidden ? '0' : '1',
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out, padding-left 0.1s ease-in-out'
            }}
            onClick={onClick} >

            <Image id="unhideButton" src={chevron} width={22} height={22} alt="See More" />
            <div className="hiddenBarContainer">
                <button id="skillsMinimized" onClick={handleButtonClick}><a href="#SkillSection" className="hiddenBarText">Skills</a></button>
                <p className="barTextSeparator">|</p>
                <button id="backgroundMinimized" onClick={handleButtonClick}><a href="#FormationBackground" className="hiddenBarText">Background</a></button>
                <p className="barTextSeparator">|</p>
                <button id="softwaresMinimized" onClick={handleButtonClick}><a href="#SoftwareSection" className="hiddenBarText">Softwares</a></button>
                <p className="barTextSeparator">|</p>
                <button id="contactMeMinimized" onClick={handleButtonClick}><a href="#SoftwareSection" className="hiddenBarText">Softwares</a></button>
            </div>

        </div>
    );
};
