import React, { CSSProperties, RefObject } from "react";
import Image from "next/image"
import '../../styles/About.css'
import linkedin from 'public/assets/SVG/linkedin_icon.svg'
import instagram from 'public/assets/SVG/instagram_icon.svg'
import youtube from 'public/assets/SVG/youtube_icon.svg'
import twitter from 'public/assets/SVG/twitterX_icon.svg'
import twitch from 'public/assets/SVG/twitch_icon.svg'
import email from 'public/assets/SVG/email_icon.svg'
import chevron from 'public/assets/SVG/Chevron.svg'

interface AboutProps {
    style?: CSSProperties;
    className?: string;
    bioRef: RefObject<HTMLParagraphElement>;
    handleAboutMeClick: () => void;
    expanded: boolean;
  }
  
  export const About = ({ style, className, bioRef, handleAboutMeClick, expanded }: AboutProps) => {

    const openLink = (link : string) : any => {
        window.open(link, '_blank');
      };

    return (
        <div id="aboutMe" style={style} className={className}>
            <div id="aboutMeButton" onClick={handleAboutMeClick}>
                <p id="aboutMeText">About Me</p> <Image id="AboutMeChevron" className={expanded ? "SeeLess" : "SeeMore"} src={chevron} width={20} height={20} alt="See More" />
            </div>

            <p id="biography" ref={bioRef}>Experienced in 2D and 3D digital graphics generation, specially NURBS-based and Procedural Design. Focused on the development of Art-tech products like Apps, Video-Games, Webs, Interactive simulations and Prototypes. More than 7 years of design experience as UX/UI, 3D modeling, rendering and systems documentation. Good at intermediation between Dev-team and Artists, providing mathematical stuff, fast and clear conceptual sketching and explanatory diagrams for a clearer communication.
                <br />
                <br />
                Polymath artist, useful in work environments where holistic intelligence and versatility are necessary.</p>
        </div>
    )
}