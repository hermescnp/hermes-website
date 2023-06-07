import React from "react"
import Image from "next/image"
import '../../styles/About.css'
import linkedin from 'public/assets/SVG/linkedin_icon.svg'
import instagram from 'public/assets/SVG/instagram_icon.svg'
import youtube from 'public/assets/SVG/youtube_icon.svg'
import twitter from 'public/assets/SVG/twitter_icon.svg'
import whatsapp from 'public/assets/SVG/whatsapp_icon.svg'
import email from 'public/assets/SVG/email_icon.svg'
import chevron from 'public/assets/SVG/Chevron.svg'

export const About = ({ style, className, bioRef, handleAboutMeClick, expanded }) => {
    return (
        <div id="aboutMe" style={style} className={className}>
            <div id="socialMedia">
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="linkedin" className="MediaIconSrc" src={linkedin} width={40} height={40} alt="Linked in" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="instagram" className="MediaIconSrc" src={instagram} width={40} height={40} alt="Instagram" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="youtube" className="MediaIconSrc" src={youtube} width={40} height={40} alt="YouTube" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="twitter" className="MediaIconSrc" src={twitter} width={40} height={40} alt="Twitter" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="whatsapp" className="MediaIconSrc" src={whatsapp} width={40} height={40} alt="Whatsapp" />
                    </div>
                </div>
                <div className="grid-cell">
                    <div className="socialMediaIcon">
                        <Image id="email" className="MediaIconSrc" src={email} width={40} height={40} alt="E-mail" />
                    </div>
                </div>

            </div>

            <div id="aboutMeButton" onClick={handleAboutMeClick}>
                <p id="aboutMeText">About Me</p> <Image id="AboutMeChevron" className={expanded ? "SeeLess" : "SeeMore"} src={chevron} width={22} height={22} alt="See More" />
            </div>

            <p id="biography" ref={bioRef}>Experienced in 2D and 3D digital graphics generation, specially NURBS-based and Procedural Design. Focused on the development of Art-tech products like Apps, Video-Games, Webs, Interactive simulations and Prototypes. More than 7 years of design experience as UX/UI, 3D modeling, rendering and systems documentation. Good at Dev-team and Artists communication, specially for mathematical stuff and gamified experiences where fast and clear conceptual sketching and explanatory diagrams are needed.
                <br />
                <br />
                Polymath artist, very useful in work environments where holistic intelligence and versatility are very necessary. Can also easily switch the perspective between the user, the business, and the development team to get synergy and synchronization in work efforts.</p>
        </div>
    )
}