import React, { useState, useEffect } from "react";
import Image from "next/image"
import '../../styles/Optionsmenu.css'

interface OptionsmenuProps {
    handleAboutButtonClick: () => void;
    isSidebarOpened: boolean;
    isPortrait: boolean;
}

export const Optionsmenu: React.FC<OptionsmenuProps> = ({ handleAboutButtonClick, isSidebarOpened, isPortrait }) => {

    const openLink = (link: string): any => {
        window.open(link, '_blank');
    };

    return (
        <div id="optionsMenu">
            {isPortrait ? (<div></div>) : (
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
            )}
            <div className="aboutButtonContainer" >
                <button id="aboutButton" className={isSidebarOpened ? ' sidebarOpenedButton' : ' sidebarClosedButton'} onClick={handleAboutButtonClick}>ABOUT</button>
            </div>
        </div>
    )
}
