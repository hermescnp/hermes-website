import React, { useState, useEffect, use } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import { NavInstance } from './NavInstance'
import { Optionsmenu } from './Optionsmenu'
import PhantomInstance from './PhantomInstance'
import { useExperienceContext } from '@/context/ExperienceContext'
import { InstanceDocumentation } from './InstanceDocumentation'

interface NavbarProps {
    isClient: boolean;
}

interface PlaceHoverType {
    key: string | null;
    name: string | null;
    isChild: boolean | null;
    isParent: boolean | null;
}

interface currentInstanceType {
    key: string;
    name: string;
    parentKey: string;
    parentName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    isClient
}) => {
    const experienceContext = useExperienceContext()
    const placehover = isClient ? experienceContext.placehover : { key: '', name: '', isChild: null, isParent: null }
    const {
        history,
        getLastHistoryItem,
        spaceData,
        pushToHistory,
        isInfoPanelExpanded,
        setIsInfoPanelExpanded,
        isUserPanelExpanded,
        setIsUserPanelExpanded,
        isSearchBarActive,
        setIsSearchBarActive,
    } = useExperienceContext()
    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }
    const [currentInstance, setCurrentInstance] = useState<currentInstanceType>(
        {
            key: 'main', 
            name:(spaceData?.find(item => item.key === 'main')?.name),
            parentKey: 'root',
            parentName: 'root'
        }
    );
    const [currentDocumentation, setCurrentDocumentation] = useState<string>(spaceData[0]?.documentation);
    const [slideUpInstance, setSlideUpInstance] = useState<boolean>(false);
    const [slideDownInstance, setSlideDownInstance] = useState<boolean>(false);
    const [smoothSlide, setSmoothSlide] = useState<boolean>(true);
    const [isTraveling, setIsTraveling] = useState<boolean>(false);
    const [isHoveringNavbar, setIsHoveringNavbar] = useState<boolean>(false);
    const [paperLTRSound, setPaperLTRSound] = useState<HTMLAudioElement | null>(null);
    const [paperRTLSound, setPaperRTLSound] = useState<HTMLAudioElement | null>(null);
    const [parentPlaceHover, setParentPlaceHover] = useState<PlaceHoverType>({ key: currentInstance.parentKey, name: currentInstance.parentName, isChild: null, isParent: true });

    useEffect(() => {
        // Create audio elements when the component mounts
        setPaperLTRSound(new Audio('/assets/sounds/LtoR_paper.mp3'));
        setPaperRTLSound(new Audio('/assets/sounds/RtoL_paper.mp3'));

        // Cleanup audio resources when the component is unmounted
        return () => {
            paperLTRSound?.pause();
            paperLTRSound?.remove();
            paperRTLSound?.pause();
            paperRTLSound?.remove();
        }
    }, []);

    useEffect(() => {
        if (isUserPanelExpanded) {
            paperLTRSound?.play();
        } else {
            paperRTLSound?.play();
        }
    }, [isUserPanelExpanded])

    useEffect(() => {
        if (isInfoPanelExpanded) {
            paperLTRSound?.play();
        } else {
            paperRTLSound?.play();
        }
    }, [isInfoPanelExpanded])

    useEffect(() => {
        if (placehover.name) {
            setSlideUpInstance(true);
            playInstanceFocusSound();
        } else {
            setSlideUpInstance(false);
        }
    }, [placehover])

    const handleBackToParent = () => {
        pushToHistory(currentInstance.parentKey);
        setSlideDownInstance(false);
    }

    useEffect(() => {
        setSmoothSlide(false);
        setTimeout(() => {
            setSmoothSlide(true);
        }, 100);
        setIsTraveling(true);

        // Prevent panel from auto-opening too soon or for 'main' instance
        if (!currentInstance.key || currentInstance.key === 'main') {
            return;
        }

        // Check if current instance has any children
        const instanceHasChild = spaceData?.some(
            (item) => item.parentKey === currentInstance.key
        );
        
        // Check if current instance has documentation to show
        const currentInstanceData = spaceData?.find(item => item.key === currentInstance.key);
        const hasDocumentation = currentInstanceData?.documentation && currentInstanceData.documentation.trim() !== '';

        if (!instanceHasChild && hasDocumentation) {
            setTimeout(() => {
                setIsInfoPanelExpanded(true);
            }, 2000);
        }
    }, [currentInstance, spaceData])

    useEffect(() => {
        if (isTraveling) {
            setTimeout(() => {
                setIsTraveling(false);
            }, 2000);
        }
    }, [isTraveling])

    useEffect(() => {
        const newLastHistoryItem = getLastHistoryItem()
        const newLastHistoryItemParent = spaceData?.find(item => item.key === newLastHistoryItem)?.parentKey || ''
        setCurrentInstance(
            {
                key: newLastHistoryItem, 
                name:(spaceData?.find(item => item.key === newLastHistoryItem)?.name || ''),
                parentKey: newLastHistoryItemParent,
                parentName: (spaceData?.find(item => item.key === newLastHistoryItemParent)?.name || '')
            }
        )
        setCurrentDocumentation(spaceData?.find(item => item.key === newLastHistoryItem)?.documentation || '')
        setParentPlaceHover({ key: newLastHistoryItemParent, name: (spaceData?.find(item => item.key === newLastHistoryItemParent)?.name || ''), isChild: null, isParent: true })
    }, [history, spaceData])


    useEffect(() => {
        if (isInfoPanelExpanded) {
            setCurrentDocumentation(spaceData?.find(item => item.key === currentInstance.key)?.documentation || '')
        }
    }, [isInfoPanelExpanded])

    const handleSearchButtonClick = () => {
        setIsSearchBarActive(true)
    }

    const handleInfoButtonClick = () => {
        if (isUserPanelExpanded) {
            setIsUserPanelExpanded(false);
        }
        setIsInfoPanelExpanded(!isInfoPanelExpanded);
    }

    const handleInstanceNameEnter = () => {
        setIsHoveringNavbar(true)
    }
    const handleInstanceNameLeave = () => {
        setIsHoveringNavbar(false)
    }

    const playInstanceFocusSound = () => {
        const audio = new Audio('/assets/sounds/switch_effect.mp3');
        audio.volume = 0.3;
        audio.playbackRate = 3;
        audio.preservesPitch = false;
        audio.play().catch((error) => { });
    }

    return (
        <div className={"navbar-wrapper" + (isInfoPanelExpanded ? ' navbar-wrapper--expanded' : '')}>
            <div className={'Navbar-background-border' + (isInfoPanelExpanded ? ' Navbar-background-border--hidden' : '')}>
                <div className={'Navbar-background' + (isHoveringNavbar ? ' Instance--hovered' : '')}>
                    <div className={'shimmer-background' + (isTraveling ? ' --on' : ' --off')}></div>
                </div>
            </div>
            <div className="NavBar" onClick={stopPropagation}>
                <button
                    className={"BackToParent" + (currentInstance.key === 'main' ? ' disabled-no-parent' : '')}
                    onClick={currentInstance.key !== 'main' ? handleBackToParent : undefined}
                    onMouseOver={currentInstance.key !== 'main' ? () => setSlideDownInstance(true) : undefined}
                    onMouseLeave={currentInstance.key !== 'main' ? () => setSlideDownInstance(false) : undefined}
                >
                    <Image
                        id="backToParentIcon"
                        src={'/assets/SVG/Back_to_Parent_icon.svg'}
                        alt="Back to parent instance"
                        width={18}
                        height={18}
                    />
                </button>
                <div className={"InstanceNavigator" + (slideUpInstance ? ' slide-up' : '') + (slideDownInstance ? ' slide-down' : '') + (!smoothSlide ? ' no-anim' : '')}>
                    <div className="InstanceNavigator-cell">
                        <PhantomInstance
                            placehover={parentPlaceHover}
                        />
                    </div>
                    <div className="InstanceNavigator-cell">
                        <NavInstance
                            key={currentInstance.key}
                            instanceName={currentInstance.name}
                            HandleInstanceClick={handleInfoButtonClick}
                            HandleInstanceNameEnter={handleInstanceNameEnter}
                            HandleInstanceNameLeave={handleInstanceNameLeave}

                        />
                    </div>
                    <div className="InstanceNavigator-cell">
                        <PhantomInstance
                            placehover={placehover}
                        />
                    </div>
                </div>
                <Optionsmenu
                    handleSearchButtonClick={handleSearchButtonClick}
                    handleInfoButtonClick={handleInfoButtonClick}
                    isPanelOpened={isInfoPanelExpanded}
                    isSearchBarActive={isSearchBarActive}
                    optionsSet='panel'
                />
            </div>
            <div id='infoPanelContent' className='content-cell'>
                <InstanceDocumentation currentDocumentation={currentDocumentation} />
            </div>
            <div id='hideInfoPanel' className='content-cell' onClick={handleInfoButtonClick}>
                <Image className={"view-more-arrow" + (isUserPanelExpanded ? ' arrow-down' : ' arrow-up')} src="/assets/SVG/Chevron.svg" width={18} height={18} alt="User Icon" />
            </div>
        </div>
    )
}
