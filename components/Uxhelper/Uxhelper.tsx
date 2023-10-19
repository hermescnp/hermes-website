import React, {useEffect, useState, useRef} from "react"
import '../../styles/Uxhelper.css'
import Botface from '@/components/Uxhelper/Botface'
import { Botchat } from '@/components/Uxhelper/Botchat'
import { useExperienceContext } from '@/context/ExperienceContext'

interface UxhelperProps {
    isNotVisible: boolean;
}

export const Uxhelper : React.FC<UxhelperProps> = ({ isNotVisible }) => {
    const isExperienceStarted = useExperienceContext().startExperience
    const [messages, setMessages] = useState<string[]>([
        "Hi! This is the Hermes's Science Lab, I'm here to assist you in your experience through this metaverse."
      ]);

      const chatBoxRef = useRef<HTMLDivElement | null>(null);
    
      useEffect(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = 999999; // a large number to ensure it's at the bottom
        }
      }, [messages]);

      const addNewMessage = (newMessage: string) => {
        setMessages(prevMessages => {
            const recentMessages = prevMessages.slice(-7); // Get the last 5 messages
    
            // Check if the new message is a duplicate of the last 7 messages
            if (!recentMessages.includes(newMessage)) {
                return [...prevMessages, newMessage];
            }
            return prevMessages; // return the previous messages unchanged if the new message is a duplicate of the last 7
        });
    };    

    return (
        <div className={`${isExperienceStarted ? 'ChatbotContainer' : 'LoadingChatbotContainer'} ${isNotVisible ? 'invisible' : ''}`}>
            <Botface chatPrint={addNewMessage}/>
            <Botchat messages={messages} chatPrinter={addNewMessage} chatBoxRef={chatBoxRef} isExperienceStarted={isExperienceStarted}/>
        </div>
    )
}