import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import '../../styles/Userbar.css'
import { useExperienceContext } from '@/context/ExperienceContext'
import { UserPanel } from '@/components/UserPanel/UserPanel'

export const Userbar: React.FC = () => {
    const { userData, isInfoPanelExpanded, setIsInfoPanelExpanded, isUserPanelExpanded, setIsUserPanelExpanded } = useExperienceContext()
    const handleUserButtonClick = () => {
        if (isInfoPanelExpanded) {
            setIsInfoPanelExpanded(false);
        }
        setIsUserPanelExpanded(!isUserPanelExpanded);
    }
    const panelRef = useRef<HTMLDivElement>(null)

    // Create refs for each section
    const skillRef = useRef<HTMLDivElement>(null)
    const backgroundRef = useRef<HTMLDivElement>(null)
    const softwareRef = useRef<HTMLDivElement>(null)

    return (
        <div className={"userbar-wrapper" + (isUserPanelExpanded ? ' userbar-wrapper--expanded' : '')}>
            <div className={'userbar-background-border' + (isUserPanelExpanded ? ' userbar-background-border--hidden' : '')}>
                <div className='userbar-background'></div>
            </div>
            <div id='userPanelContent' className='content-cell'>
                <UserPanel data={userData} ref={panelRef} skillRef={skillRef} backgroundRef={backgroundRef} softwareRef={softwareRef} />
            </div>
            <div className="UserBar" onClick={handleUserButtonClick}>
                <div className='grid-cell'>
                    <Image className="user-icon" src="/assets/SVG/User_Icon.svg" width={35} height={35} alt="User Icon" />
                </div>
                <div className='grid-cell'>
                    <label className='user-label'>About Hermes</label>
                </div>
                <div className='grid-cell'>
                    <Image className={"view-more-arrow" + (isUserPanelExpanded ? ' arrow-down' : ' arrow-up')} src="/assets/SVG/Chevron.svg" width={18} height={18} alt="User Icon" />
                </div>
            </div>
        </div>
    )
}
