import React from "react"
import '../../styles/Uxhelper.css'
import Botface from '@/components/Uxhelper/Botface'
import Botchat from '@/components/Uxhelper/Botchat'
import { useExperienceContext } from '@/context/ExperienceContext'

interface UxhelperProps {
    isVisible: boolean;
}

export const Uxhelper : React.FC<UxhelperProps> = ({ isVisible }) => {
    const experienceContext = useExperienceContext();
    const isExperienceStarted = experienceContext.startExperience;

    return (
        <div className={`${isExperienceStarted ? 'ChatbotContainer' : 'LoadingChatbotContainer'} ${isVisible ? '' : 'invisible'}`}>
            <Botface />
            <Botchat />
        </div>
    )
}