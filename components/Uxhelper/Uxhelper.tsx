import React, { useEffect, useState, useRef } from "react";
import '../../styles/Uxhelper.css';
import Botface from '@/components/Uxhelper/Botface';
import { Botchat } from '@/components/Uxhelper/Botchat';
import { useExperienceContext } from '@/context/ExperienceContext';

export const Uxhelper: React.FC = () => {
    const { startExperience, isInfoPanelExpanded, isUserPanelExpanded, isPortraitMode } = useExperienceContext();
    const [messages, setMessages] = useState<string[]>([
        "Hi! This is the Hermes's Science Lab, I'm here to assist you in your experience through this metaverse."
    ]);

    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const [hiddenChatBot, setHideChatBot] = useState<boolean>(false);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = 999999; // a large number to ensure it's at the bottom
        }
    }, [messages]);

    useEffect(() => {
        if (isPortraitMode && (isUserPanelExpanded || isInfoPanelExpanded)) {
          setHideChatBot(true);
        } else {
          setHideChatBot(false);
        }
      }, [isPortraitMode, isUserPanelExpanded, isInfoPanelExpanded]);

    const addNewMessage = (newMessage: string) => {
        setTimeout(() => {
            setMessages(prevMessages => {
                const recentMessages = prevMessages.slice(-7); // Get the last 7 messages
    
                if (!recentMessages.includes(newMessage)) {
                    return [...prevMessages, newMessage];
                }
                return prevMessages; // return unchanged if the new message is a duplicate of the last 7
            });
        }, 2000);
    };

    return (
        <div className={(startExperience ? 'ChatbotContainer' : 'LoadingChatbotContainer') + (hiddenChatBot ? ' invisible' : '')}>
            <Botface chatPrint={addNewMessage} />
            {(!isPortraitMode || !startExperience) && 
            <Botchat messages={messages} chatPrinter={addNewMessage} chatBoxRef={chatBoxRef} isExperienceStarted={startExperience} />
            }
        </div>
    )
}
