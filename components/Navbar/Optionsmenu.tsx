import React, { CSSProperties, RefObject } from "react";
import Image from "next/image"
import '../../styles/Optionsmenu.css'
import linkedin from 'public/assets/SVG/linkedin_icon.svg'
import instagram from 'public/assets/SVG/instagram_icon.svg'
import youtube from 'public/assets/SVG/youtube_icon.svg'
import twitter from 'public/assets/SVG/twitterX_icon.svg'
import twitch from 'public/assets/SVG/twitch_icon.svg'
import email from 'public/assets/SVG/email_icon.svg'
import chevron from 'public/assets/SVG/Chevron.svg'
  
  export const Optionsmenu = () => {

    const openLink = (link : string) : any => {
        window.open(link, '_blank');
      };

    return (
        <div id="optionsMenu">
            <div id="socialMedia">
                <div className="grid-cell">
                <div className="socialMediaIcon" onClick={() => openLink('https://www.linkedin.com/in/hermes-concepci%C3%B3n-2ab5741b9/')}>
                        <Image id="linkedin" className="MediaIconSrc" src={linkedin} width={40} height={40} alt="Linked in" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon" onClick={() => openLink('https://www.instagram.com/hermes.science/')}>
                        <Image id="instagram" className="MediaIconSrc" src={instagram} width={40} height={40} alt="Instagram" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon" onClick={() => openLink('https://www.youtube.com/@Hermes.science')}>
                        <Image id="youtube" className="MediaIconSrc" src={youtube} width={40} height={40} alt="YouTube" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon" onClick={() => openLink('https://twitter.com/hermesscience')}>
                        <Image id="twitter" className="MediaIconSrc" src={twitter} width={40} height={40} alt="Twitter" />
                    </div>
                </div>
                {/* <div className="grid-cell">
                    <div className="socialMediaIcon" onClick={() => openLink('https://www.twitch.tv/hermesscience')}>
                        <Image id="twitch" className="MediaIconSrc" src={twitch} width={40} height={40} alt="Twitch" />
                    </div>
                </div> */}
                <div className="grid-cell">
                    <div className="socialMediaIcon" onClick={() => openLink('mailto:hermes.cnp@gmail.com?subject=Contact from Hermes.science&body=Hola Hermes,')}>
                        <Image id="email" className="MediaIconSrc" src={email} width={40} height={40} alt="E-mail" />
                    </div>
                </div>
            </div>
            <div className="aboutButtonContainer">
                <button id="aboutButton">ABOUT</button>
            </div>
        </div>
    )
}
