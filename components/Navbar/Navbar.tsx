import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import mapIcon from 'public/assets/SVG/space_map.svg'
import NavInstance from './NavInstance'
import NavSearchBar from './NavSearchBar'
import { SpaceMap } from '../SpaceMap/SpaceMap'
import { useExperienceContext } from '@/context/ExperienceContext';

interface NavbarProps {
    isClient: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isClient }) => {
    const experienceContext = useExperienceContext();
    const InstanceBackButton = isClient ? experienceContext.InstanceBackButton : () => { };
    const placehover = isClient ? experienceContext.placehover : null;
    const currentInstance = isClient ? experienceContext.currentInstance : 'main';
    const setCurrentInstance = isClient ? experienceContext.setCurrentInstance : () => { };
    const spaceData = isClient ? experienceContext.spaceData : [];
    const [isMapOpened, setIsMapOpened] = useState<boolean>(false);

    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    const openSpaceMapWindow = () => {
        setIsMapOpened(prevState => !prevState);
    }

    const [navInstances, setNavInstances] = useState<JSX.Element[]>([]);

    // Function to recursively find parent spaces and add them to navInstances
    const createNavInstances = (key: string) => {
        let currentSpace = spaceData.find(space => space.key === key);
        if (currentSpace) {
            if (currentSpace.parentKey !== 'root') {
                createNavInstances(currentSpace.parentKey);
            }
            setNavInstances(prevNavInstances => [
                ...prevNavInstances,
                <NavInstance key={currentSpace.key} instanceName={currentSpace.name} />
            ]);
        }
    }

    // Run createNavInstances once on component mount
    useEffect(() => {
        setNavInstances([]); // Clear previous navigation instances
        createNavInstances(currentInstance); // Create new navigation instances
    }, [currentInstance, spaceData]);

    return (
        <div className="NavBar" onClick={stopPropagation}>
            <button className="BackButton" onClick={InstanceBackButton}>
                <Image id="backChevron" className="BackChevron" src={chevron} width={20} height={20} alt="Back" />
            </button>
            <div className="MapButtonContainer">
                <button className={`${isMapOpened ? 'MapButtonOpened' : 'MapButton'}`} onClick={openSpaceMapWindow}>
                    <Image id="mapIcon" className={`${isMapOpened ? 'MapIconOpened' : 'MapIcon'}`} src={mapIcon} width={22} height={22} alt="Map" />
                </button>
            </div>
            <div className="Navigation">
                <NavInstance instanceName={"Root"} />
                {navInstances}
                <NavSearchBar placehover={placehover} isMapOpened={isMapOpened} />
            </div>
            <SpaceMap isOpened={isMapOpened} onMouseOver={stopPropagation} />
        </div>
    )
}
