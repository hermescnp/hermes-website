import React, { CSSProperties, RefObject } from "react";
import Image from "next/image"
import '../../styles/About.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import authorImg from 'public/assets/HermesPrane.jpg'

export const About = () => {

    return (
        <div id="aboutContent" >
            <div className="AuthorInfoPanel">
                <h2>Hermes Concepción</h2>
                <p>UX/Technical Artist | Professional Musician</p>
            </div>
            
            <Image className="AuthorImage" src={authorImg} width={70} height={70} alt="Fotografía del autor" />

            <p id="biography">Experienced in 2D and 3D digital graphics generation, specially NURBS-based and Procedural Design. Focused on the development of Art-tech products like Apps, Video-Games, Webs, Interactive simulations and Prototypes. More than 7 years of design experience as UX/UI, 3D modeling, rendering and systems documentation. Good at intermediation between Dev-team and Artists, providing mathematical stuff, fast and clear conceptual sketching and explanatory diagrams for a clearer communication.
                <br />
                <br />
                Polymath artist, useful in work environments where holistic intelligence and versatility are necessary.</p>
        </div>
    )
}