import React from "react";
import Image from 'next/image';
import '../../styles/Hiddenpanel.css';
import chevron from 'public/assets/SVG/Chevron.svg';

interface HiddenPanelProps {
    hidden: boolean;
    onClick: () => void;
}

export const HiddenPanel = ({ hidden, onClick }: HiddenPanelProps) => {
    return (
        <div 
            className="HiddenPanel" 
            style={{ 
                transform: hidden ? 'translateX(-100%)' : 'translateX(0)', 
                opacity: hidden ? '0' : '1',
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
            }} 
            onClick={onClick} >

            <Image id="unhideButton" src={chevron} width={22} height={22} alt="See More" />
            <div className="hiddenBarContainer">
                <p id="skillsMinimized" className="hiddenBarText">Skills</p>
                <p className="barTextSeparator">|</p>
                <p id="backgroundMinimized" className="hiddenBarText">Background</p>
                <p className="barTextSeparator">|</p>
                <p id="softwaresMinimized" className="hiddenBarText">Softwares</p>
                <p className="barTextSeparator">|</p>
                <p id="contactMeMinimized" className="hiddenBarText">Contact</p>
            </div>

        </div>
    );
};
