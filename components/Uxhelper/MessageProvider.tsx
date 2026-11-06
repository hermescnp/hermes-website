import React, { useEffect, useRef, useState } from 'react';
import { useExperienceContext } from '@/context/ExperienceContext';
import type { BotMessage } from 'Types'

interface MessageProviderProps {
    chatPrint: (newMessage: BotMessage) => void;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ chatPrint }) => {
    const { spaceData, loadingState, startExperience, isPortraitMode, history, getLastHistoryItem, getPrevHistoryItem } = useExperienceContext()
    const timeoutRef10s = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef20s = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef30s = useRef<NodeJS.Timeout | null>(null);

    // State to track if app loaded before 30 seconds
    const [appLoadedBefore30s, setAppLoadedBefore30s] = useState(false);

    useEffect(() => {
        timeoutRef10s.current = setTimeout(() => {
            if (!startExperience) {
                if (loadingState === 'Office loaded') {
                    chatPrint({ type: 'agent', content: "We are ready! Just click on the start button." });
                    setAppLoadedBefore30s(true);
                } else {
                    chatPrint({ type: 'agent', content: "We are almost there! I'm just loading the place..." });
                }
            }
        }, 10000);

        timeoutRef20s.current = setTimeout(() => {
            if (!startExperience && loadingState === 'Office loaded') {
                chatPrint({ type: 'agent', content: "Are you there? I'll be here for you anytime you decide to start. Take your time." });
            }
        }, 20000);

        timeoutRef30s.current = setTimeout(() => {
            if (!startExperience && loadingState !== 'Office loaded' && !appLoadedBefore30s) {
                chatPrint({ type: 'agent', content: "Oh, I'm sorry this is taking some time... I swear it's not my fault, it's just the internet connection." });
            } else if (!startExperience && loadingState === 'Office loaded' && !appLoadedBefore30s) {
                chatPrint({ type: 'agent', content: "Finally! now we can begin with the experience. Just click the start button." });
            }
        }, 30000);

        return () => {
            if (timeoutRef10s.current) clearTimeout(timeoutRef10s.current);
            if (timeoutRef20s.current) clearTimeout(timeoutRef20s.current);
            if (timeoutRef30s.current) clearTimeout(timeoutRef30s.current);
        };
    }, [startExperience, loadingState, appLoadedBefore30s]);

    useEffect(() => {
        if (startExperience && !isPortraitMode) {
            if (timeoutRef10s.current) clearTimeout(timeoutRef10s.current);
            if (timeoutRef20s.current) clearTimeout(timeoutRef20s.current);
            if (timeoutRef30s.current) clearTimeout(timeoutRef30s.current);

            chatPrint({ type: 'agent', content: "Welcome! Feel free to touch any area of the room. It was made for you to explore. You can also drag the screen to rotate the view." });
        }
    }, [startExperience]);

    useEffect(() => {
        const lastHistoryItem = getLastHistoryItem();
        const prevHistoryItem = getPrevHistoryItem();
        const currentInstance = spaceData.find(item => item.key === lastHistoryItem);
        const prevInstance  = spaceData.find(item => item.key === prevHistoryItem);

        if (currentInstance !== 'root' && currentInstance !== 'main' && currentInstance !== undefined && prevInstance.parentKey !== lastHistoryItem) {
            if (currentInstance.isSubSpace === true) {
                chatPrint({ type: 'agent', content: `You are at the ${currentInstance.name}, you can touch any object inside the ${currentInstance.description} to explore it.` });
            } else {
                chatPrint({ type: 'agent', content: `This is a ${currentInstance.description} about ${currentInstance.name}.` });
            }
        }
        if (history.length === 2 && getLastHistoryItem() !== 'main') {
            setTimeout(() => {
                chatPrint({ type: 'agent', content: "Click the 'Navigate-Up' button on the navigation bar to step back, or double tap the screen to return to the home position." });
            }, 10000);
        }
    }, [history]);


    return <></>;
}
