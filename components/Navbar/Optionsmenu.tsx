import React, { useState, useEffect } from "react";
import Image from "next/image"
import '../../styles/Optionsmenu.css'

interface OptionsmenuProps {
    handleSearchButtonClick?: () => void;
    handleInfoButtonClick?: () => void;
    handleUserButtonClick?: () => void;
    isSearchBarActive?: boolean;
    isPanelOpened: boolean;
    optionsSet: 'social' | 'panel';
}

export const Optionsmenu: React.FC<OptionsmenuProps> = ({ handleSearchButtonClick, handleInfoButtonClick, handleUserButtonClick, isPanelOpened, isSearchBarActive, optionsSet }) => {

    const openLink = (link: string): any => {
        window.open(link, '_blank');
    };

    switch (optionsSet) {
        case 'social':
            return (
                <div id="SocialOptions">
                    <div id="socialMedia">
                        <div className="grid-cell">
                            <div className="socialMediaIcon" onClick={() => openLink('https://www.linkedin.com/in/hermes-concepci%C3%B3n-2ab5741b9/')}>
                                <Image id="linkedin" className="MediaIconSrc" src="assets/SVG/linkedin_icon.svg" width={40} height={40} alt="Linked in" />
                            </div>
                        </div>
                        <div className="grid-cell">
                            <div className="socialMediaIcon" onClick={() => openLink('https://www.instagram.com/hermes.science/')}>
                                <Image id="instagram" className="MediaIconSrc" src="assets/SVG/instagram_icon.svg" width={40} height={40} alt="Instagram" />
                            </div>
                        </div>
                        <div className="grid-cell">
                            <div className="socialMediaIcon" onClick={() => openLink('https://www.youtube.com/@Hermes.science')}>
                                <Image id="youtube" className="MediaIconSrc" src="assets/SVG/youtube_icon.svg" width={40} height={40} alt="YouTube" />
                            </div>
                        </div>
                        <div className="grid-cell">
                            <div className="socialMediaIcon" onClick={() => openLink('https://twitter.com/hermesscience')}>
                                <Image id="twitter" className="MediaIconSrc" src="assets/SVG/twitterX_icon.svg" width={40} height={40} alt="Twitter" />
                            </div>
                        </div>
                        <div className="grid-cell">
                            <div className="socialMediaIcon" onClick={() => openLink('mailto:hermes.cnp@gmail.com?subject=Contact from Hermes.science&body=Hola Hermes,')}>
                                <Image id="email" className="MediaIconSrc" src="assets/SVG/email_icon.svg" width={40} height={40} alt="E-mail" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'panel':
            return (
                <div id="PanelOptions">
                    <div className="grid-cell">
                        <div id="infoButton" className={"InstanceOptionIcon" + (isPanelOpened ? ' option-active' : '')} onClick={handleInfoButtonClick}>
                            <Image className="OptionIconSrc" src="assets/SVG/Info_Icon.svg" width={22} height={22} alt="Info Icon" />
                        </div>
                    </div>
                    <div className="grid-cell">
                        <div id="searchButton" className={"InstanceOptionIcon" + (isSearchBarActive ? ' option-active' : '')} onClick={handleSearchButtonClick}>
                            <Image className="OptionIconSrc" src="/assets/SVG/search_icon.svg" width={22} height={22} alt="Search Icon" />
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
}
