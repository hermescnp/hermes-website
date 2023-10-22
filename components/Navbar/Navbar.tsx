import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import { NavInstance } from './NavInstance'
import NavSearchBar from './NavSearchBar'
import { Optionsmenu } from './Optionsmenu'
import PhantomInstance from './PhantomInstance'
import { useExperienceContext } from '@/context/ExperienceContext'
import ObjectIcon from 'public/assets/SVG/3DGraphics_Icon.svg'

interface NavbarProps {
    isClient: boolean;
    isPortrait: boolean;
    isMapOpened: boolean;
    handleAboutButtonClick: () => void;
    isSidebarOpened: boolean;
}

type PlaceHoverType = {
    name: string | null;
    isSibling: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({ isClient, isPortrait, isMapOpened, handleAboutButtonClick, isSidebarOpened }) => {
    const experienceContext = useExperienceContext();
    const InstanceBackButton = isClient ? experienceContext.InstanceBackButton : () => { };
    const placehover = isClient ? experienceContext.placehover : { name: '', isSibling: null };
    const history = isClient ? experienceContext.history : () => ['main'];
    const spaceData = isClient ? experienceContext.spaceData : [];
    const [portraitMode, setPortraitMode] = useState<boolean>(isPortrait);
    const [currentInstance, setCurrentInstance] = useState<string>('main');

    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    const [navInstances, setNavInstances] = useState<Array<{ instance: JSX.Element, placehover: PlaceHoverType }>>([]);
    let navInstancePlacehover = placehover?.isSibling ? placehover?.name : null;
    let navSearchBarPlaceHover = placehover?.isSibling ? null : placehover?.name;

    const getLastItem = (array: any): string | null => {
        if (array.length > 0) {
            return array[array.length - 1];
        }
        return null;
    }

    // Function to recursively find parent spaces and add them to navInstances
    const createNavInstances = (key: string) => {
        let currentSpace = spaceData.find(space => space.key === key);
        if (currentSpace) {
            if (currentSpace.parentKey !== 'root') {
                createNavInstances(currentSpace.parentKey);
            }
            if (isPortrait) {
                // Only show the current instance in portrait mode
                setNavInstances([
                    {
                        instance: <NavInstance
                            instanceKey={currentSpace.key}
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
                            instanceKey={currentSpace.key}
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
        const lastHistoryItem = getLastItem(history);
        setCurrentInstance(lastHistoryItem || 'main');
        if (lastHistoryItem) {
            setNavInstances([]); // Clear previous navigation instances
            createNavInstances(lastHistoryItem); // Create new navigation instances based on the last item in history
        }
    }, [history, spaceData, isPortrait]);

    useEffect(() => {
        setPortraitMode(isPortrait);
    }, [isPortrait]);

    return (
        <div className="NavBar" onClick={stopPropagation}>
            <button className="BackButton" onClick={isPortrait && isSidebarOpened ? handleAboutButtonClick : InstanceBackButton}>
                <Image id="backChevron" className="BackChevron" src={chevron} width={20} height={20} alt="Back" />
            </button>
            <div className="Navigation">
                {portraitMode ? (
                    // Portrait Mode
                    <>
                        {currentInstance !== "main" ? (
                            <Image id="objectIcon" className="ObjectIcon" src={ObjectIcon} width={15} height={15} alt="Object Icon"></Image>
                        ) : null}
                        {navInstances.map(instanceData => instanceData.instance)}
                    </>
                ) : (
                    // Landscape Mode
                    <>
                        {/*TODO: Implement Root Instance when LeGine becomes the Root.
                        <NavInstance instanceName={"Root"} /> */}
                        {navInstances.map(instanceData => instanceData.instance)}

                        {/* TODO: Implement Search Bar when the navigation allows jumping to any ramdom instance. */}
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
            <Optionsmenu handleAboutButtonClick={handleAboutButtonClick} isSidebarOpened={isSidebarOpened} isPortrait={portraitMode} />
        </div>
    )
}
