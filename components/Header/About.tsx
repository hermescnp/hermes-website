import React, { CSSProperties, RefObject } from "react";
import Image from "next/image"
import '../../styles/About.css'

export const About = () => {

    return (
        <div id="aboutContent" >
            <div className="AuthorInfoPanel">
                <h2>Hermes Concepción</h2>
                <p>UX/Technical Artist | Professional Musician</p>
            </div>
            
            <Image className="AuthorImage" src={'/assets/PNG/HermesPhotography.png'} width={70} height={70} alt="Fotografía del autor" />

            <p id="biography">With over 7 years of experience in UX/UI development, 3D modeling, and rendering, I specialize in technical art focused on virtual reality and artificial intelligence. 
            My expertise includes creating art-tech products like video games, interactive simulations, and tools development. 
            I excel in bridging the gap between development teams and artists, providing mathematical solutions and clear conceptual sketching for better communication.
                <br />
                <br />
                As a versatile polymath artist, I thrive in environments that demand holistic intelligence and adaptability.</p>
        </div>
    )
}