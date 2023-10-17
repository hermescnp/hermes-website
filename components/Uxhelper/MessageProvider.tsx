import React from 'react'
import { useExperienceContext } from '@/context/ExperienceContext'

interface MessageProviderProps {
    chatPrint: (newMessage: string) => void;
}

export const MessageProvider : React.FC<MessageProviderProps> = ({chatPrint}) => {
    const experienceContext = useExperienceContext();
    const isExperienceStarted = experienceContext.startExperience;
    const history = experienceContext.history;
  return (
    <button onClick={() => chatPrint("Hello... how can i help you?")}>
    +
    </button>
  )
}
