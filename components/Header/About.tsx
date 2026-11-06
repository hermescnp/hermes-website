import React, { CSSProperties, RefObject } from "react";
import Image from "next/image"
import '../../styles/About.css'
import { Socialmedia } from "../UserPanel/Socialmedia";

export const About = () => {

    return (
        <div id="aboutContent" >
            <div className="AuthorInfoPanel">
                <h2>Hermes Concepción</h2>
                <p>Agentic AI Architect | UX Designer | Technical Artist</p>
            </div>

            <Image className="AuthorImage" src={'/assets/PNG/HermesPhotography.png'} width={70} height={70} alt="Fotografía del autor" />
            <Socialmedia />
            <div className="biography-container">
                <p id="biography-text">Multi-agent systems developer with over 8 years of experience in product design, creative user experience, and technical arts.
                    I mix cutting-edge technologies like extended reality (XR), deep learning (ML/DL), WebGL, and APIs into integral solutions:
                    AI-powered apps, chatbots, VR/AR simulations, and tools for workflow automation.
                    I lead agentic AI architecture at YUYAY (USA startup), coordinate AI strategies and teach Virtual Reality at UNPHU University, and design AI products and user experiences for Popular Bank (Dominican Republic).
                    I also give talks, workshops, and televised interviews on artificial intelligence, computer graphics (CGI), and the metaverse.
                    <br />
                    <br />
                    As a versatile polymath artist, I thrive in environments that demand holistic intelligence and adaptability.</p>
            </div>
        </div>
    )
}