import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import mapIcon from 'public/assets/SVG/space_map.svg'
import { NavInstance } from './NavInstance'
import NavSearchBar from './NavSearchBar'
import PhantomInstance from './PhantomInstance'
import { SpaceMap } from '../SpaceMap/SpaceMap'
import { useExperienceContext } from '@/context/ExperienceContext'

interface NavbarProps {
    isClient: boolean;
    isPortrait: boolean;
}

type PlaceHoverType = {
    name: string | null;
    isSibling: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({ isClient, isPortrait }) => {
    const experienceContext = useExperienceContext();
    const InstanceBackButton = isClient ? experienceContext.InstanceBackButton : () => { };
    const placehover = isClient ? experienceContext.placehover : { name: '', isSibling: null };
    const currentInstance = isClient ? experienceContext.currentInstance : 'main';
    const setCurrentInstance = isClient ? experienceContext.setCurrentInstance : () => { };
    const spaceData = isClient ? experienceContext.spaceData : [];
    const [isMapOpened, setIsMapOpened] = useState<boolean>(true);
    const [portraitMode, setPortraitMode] = useState<boolean>(isPortrait)

    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    const openSpaceMapWindow = () => {
        setIsMapOpened(prevState => !prevState);
    }

    const [navInstances, setNavInstances] = useState<Array<{ instance: JSX.Element, placehover: PlaceHoverType }>>([]);
    let navInstancePlacehover = placehover?.isSibling ? placehover?.name : null;
    let navSearchBarPlaceHover = placehover?.isSibling ? null : placehover?.name;

    // Function to recursively find parent spaces and add them to navInstances
    const createNavInstances = (key: string) => {
        let currentSpace = spaceData.find(space => space.key === key);
        if (currentSpace) {
            if (currentSpace.parentKey !== 'root') {
                createNavInstances(currentSpace.parentKey);
            }
            if (!navInstancePlacehover && isPortrait) {
                // Only show the current instance in portrait mode
                setNavInstances([
                    {
                        instance: <NavInstance
                            key={currentSpace.key}
                            instanceName={currentSpace.name}
                            placehover={placehover?.isSibling ? navInstancePlacehover : null}
                            HandleInstanceClick={InstanceBackButton} />,
                        placehover: placehover
                    }
                ]);
            } else {
                setNavInstances((prevNavInstances: any) => [
                    ...prevNavInstances,
                    {
                        instance: <NavInstance
                            key={currentSpace.key}
                            instanceName={currentSpace.name}
                            placehover={placehover?.isSibling ? navInstancePlacehover : null}
                            HandleInstanceClick={InstanceBackButton} />,
                        placehover: placehover
                    }
                ]);
            }
        }
    }

    // Run createNavInstances once on component mount
    useEffect(() => {
        setNavInstances([]); // Clear previous navigation instances
        createNavInstances(currentInstance); // Create new navigation instances
        setIsMapOpened(false);
    }, [currentInstance, spaceData, isPortrait]);

    useEffect(() => {
        setPortraitMode(isPortrait);
        //console.log(isPortrait);
    }, [isPortrait]);

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
                {portraitMode ? (
                    // Portrait Mode
                    <>
                        {navInstances.map(instanceData => instanceData.instance)}
                    </>
                ) : (
                    // Landscape Mode
                    <>
                        {/* <NavInstance instanceName={"Root"} /> */}
                        {navInstances.map(instanceData => instanceData.instance)}

                        {/* <NavSearchBar
                    placehover={!placehover?.isSibling ? navSearchBarPlaceHover : null}
                    isMapOpened={isMapOpened}
                /> */}

                        <PhantomInstance
                            placehover={!placehover?.isSibling ? navSearchBarPlaceHover : null}
                            isMapOpened={isMapOpened} />
                    </>
                )}
            </div>
            <SpaceMap isOpened={isMapOpened} onMouseOver={stopPropagation} />
        </div>
    )
}
