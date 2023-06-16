import React, { useState } from "react"
import Image from "next/image"
import '../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import legineIcon from 'public/assets/SVG/legine_wing.svg'

interface NavbarProps {
  handleBackButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Navbar = ({ handleBackButton }: NavbarProps) => {

    return (
        <div className="NavBar">
            <button className="BackButton" onClick={handleBackButton}>
                <Image id="backChevron" className="BackChevron" src={chevron} width={20} height={20} alt="Back" />
            </button>
            <div className="Navigation">
                <button className="RootInstance">
                    <Image id="legineIcon" className="LegineIcon" src={legineIcon} width={30} height={30} alt="Legine"></Image>
                </button>
                <div className="NavigationInstance">
                    <Image id="arrow" className="Arrow" src={chevron} width={15} height={15} alt="Arrow"></Image>
                    <button className="InstanceButton">Hermes's Office</button>
                </div>
                <div className="NavigationInstance">
                    <Image id="arrow" className="Arrow" src={chevron} width={15} height={15} alt="Arrow"></Image>
                    <button className="InstanceButton">Prané Music Studio</button>
                </div>
            </div>
        </div>
    )
}