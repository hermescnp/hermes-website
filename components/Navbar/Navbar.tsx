import React, { useState, useEffect, use } from 'react'
import Image from 'next/image'
import '../../styles/Navbar.css'
import { NavInstance } from './NavInstance'
import { Optionsmenu } from './Optionsmenu'
import PhantomInstance from './PhantomInstance'
import { useExperienceContext } from '@/context/ExperienceContext'
import NavSearchBar from './NavSearchBar'
import { InstanceDocumentation } from './InstanceDocumentation'

interface NavbarProps {
    isClient: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
    isClient
}) => {
    const experienceContext = useExperienceContext()
    const { setCurrentDocumentation } = experienceContext
    const placehover = isClient ? experienceContext.placehover : { name: '', isChild: null, isParent: null }
    const {
        getLastHistoryItem,
        spaceData,
        pushToHistory,
        isInfoPanelExpanded,
        setIsInfoPanelExpanded,
        isUserPanelExpanded,
        setIsUserPanelExpanded,
        isSearchBarActive,
        setIsSearchBarActive,
        toggleFreeze,
        setToggleFreeze,
    } = useExperienceContext()
    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }
    const currentInstance = getLastHistoryItem();
    const currentInstanceName = spaceData?.find(item => item.key === currentInstance)?.name || '';
    const currentInstanceParent = spaceData?.find(item => item.key === currentInstance)?.parentKey || '';
    const currentInstanceParentName = spaceData?.find(item => item.key === currentInstanceParent)?.name || '';
    const parentPlaceHover = { name: currentInstanceParentName, isChild: false, isParent: true };
    const [slideUpInstance, setSlideUpInstance] = useState<boolean>(false);
    const [slideDownInstance, setSlideDownInstance] = useState<boolean>(false);
    const [smoothSlide, setSmoothSlide] = useState<boolean>(true);

    useEffect(() => {
        if (placehover.name) {
            setSlideUpInstance(true);
        } else {
            setSlideUpInstance(false);
        }
    }, [placehover])

    const handleBackToParent = () => {
        pushToHistory(currentInstanceParent);
        setSlideDownInstance(false);
    }

    useEffect(() => {
        setSmoothSlide(false);
        setTimeout(() => {
            setSmoothSlide(true);
        }, 100);
        setCurrentDocumentation(spaceData?.find(item => item.key === currentInstance)?.documentation || '');
    }, [currentInstance])

    useEffect(() => {
        if (isInfoPanelExpanded) {
            setCurrentDocumentation(spaceData?.find(item => item.key === currentInstance)?.documentation || '');
        }
    }, [isInfoPanelExpanded])

    const handleSearchButtonClick = () => {
        if (!toggleFreeze) {
            setIsSearchBarActive(!isSearchBarActive);
            setToggleFreeze(true);
            setTimeout(() => {
                setToggleFreeze(false);
            }, 500);
        }
    }

    const handleInfoButtonClick = () => {
        if (isUserPanelExpanded) {
            setIsUserPanelExpanded(false);
        }
        setIsInfoPanelExpanded(!isInfoPanelExpanded);
    }

    return (
        <div className={"navbar-wrapper" + (isInfoPanelExpanded ? ' navbar-wrapper--expanded' : '')}>
            <div className={'Navbar-background-border' + (isInfoPanelExpanded ? ' Navbar-background-border--hidden' : '')}>
                <div className='Navbar-background'></div>
            </div>
            <div className="NavBar" onClick={stopPropagation}>
                <button
                    className={"BackToParent" + (currentInstance === 'main' ? ' disabled-no-parent' : '')}
                    onClick={currentInstance !== 'main' ? handleBackToParent : undefined}
                    onMouseOver={currentInstance !== 'main' ? () => setSlideDownInstance(true) : undefined}
                    onMouseLeave={currentInstance !== 'main' ? () => setSlideDownInstance(false) : undefined}
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
                            instanceName={currentInstanceName}
                            HandleInstanceClick={handleInfoButtonClick}
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
                <InstanceDocumentation />
            </div>
            <div id='hideInfoPanel' className='content-cell' onClick={handleInfoButtonClick}>
                <Image className={"view-more-arrow" + (isUserPanelExpanded ? ' arrow-down' : ' arrow-up')} src="/assets/SVG/Chevron.svg" width={18} height={18} alt="User Icon" />
            </div>
            <NavSearchBar />
        </div>
    )
}
