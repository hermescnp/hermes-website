import React, { useState } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import NavInstance from './NavInstance'
import NavSearchBar from './NavSearchBar'

interface NavbarProps {
  handleBackButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  placehover?: string | null;
}

export const Navbar = ({ handleBackButton, placehover }: NavbarProps) => {
    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    return (
        <div className="NavBar" onClick={stopPropagation}>
            <button className="BackButton" onClick={handleBackButton}>
                <Image id="backChevron" className="BackChevron" src={chevron} width={25} height={25} alt="Back" />
            </button>
            <div className="Navigation">
                <NavInstance instanceName={"Root"} />
                <NavInstance instanceName={"Hermes's Office"} />
                <NavInstance instanceName={"Prané Music Studio"} />
                <NavSearchBar placehover={placehover} />
            </div>
        </div>
    )
}
