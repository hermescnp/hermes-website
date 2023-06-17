import React, { useState } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import NavInstance from './NavInstance'
import NavSearchBar from './NavSearchBar'

interface NavbarProps {
  handleBackButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  placehover?: string | null;
  currentInstance: string;
  setCurrentInstance: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar = ({ handleBackButton, placehover, currentInstance, setCurrentInstance }: NavbarProps) => {
    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    return (
        <div className="NavBar" onClick={stopPropagation}>
            <button className="BackButton" onClick={handleBackButton}>
                <Image id="backChevron" className="BackChevron" src={chevron} width={20} height={20} alt="Back" />
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
