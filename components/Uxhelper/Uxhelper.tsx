import React from "react"
import '../../styles/Uxhelper.css'
import Botface from '@/components/Uxhelper/Botface'
import { useExperienceContext } from '@/context/ExperienceContext'

export const Uxhelper = () => {
    const experienceContext = useExperienceContext();
    const isExperienceStarted = experienceContext.startExperience;

    return (
        <div className={isExperienceStarted ? 'ChatbotContainer' : 'LoadingChatbotContainer'}>
            <Botface />
        </div>
    )
}