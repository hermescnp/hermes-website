import React, { useEffect, useRef, useState } from 'react';
import { useExperienceContext } from '@/context/ExperienceContext';

interface MessageProviderProps {
    chatPrint: (newMessage: string) => void;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ chatPrint }) => {
    const experienceContext = useExperienceContext();
    const isExperienceStarted = experienceContext.startExperience;
    const loadingState = experienceContext.loadingState;
    const history = experienceContext.history;
    const getLastHistoryItem = experienceContext.getLastHistoryItem;
    const data = experienceContext.spaceData;
    const timeoutRef10s = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef20s = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef30s = useRef<NodeJS.Timeout | null>(null);

    // State to track if app loaded before 30 seconds
    const [appLoadedBefore30s, setAppLoadedBefore30s] = useState(false);

    useEffect(() => {
        timeoutRef10s.current = setTimeout(() => {
            if (!isExperienceStarted) {
                if (loadingState === 'Office loaded') {
                    chatPrint("We are ready! Just click on the start button.");
                    setAppLoadedBefore30s(true);
                } else {
                    chatPrint("We are almost there! I'm just loading the place...");
                }
            }
        }, 10000);

        timeoutRef20s.current = setTimeout(() => {
            if (!isExperienceStarted && loadingState === 'Office loaded') {
                chatPrint("Are you there? I'll be here for you anytime you decide to start. Take your time.");
            }
        }, 20000);

        timeoutRef30s.current = setTimeout(() => {
            if (!isExperienceStarted && loadingState !== 'Office loaded' && !appLoadedBefore30s) {
                chatPrint("Oh, I'm sorry this is taking some time... I swear it's not my fault, it's just the internet connection.");
            } else if (!isExperienceStarted && loadingState === 'Office loaded' && !appLoadedBefore30s) {
                chatPrint("Finally! now we can begin with the experience. Just click the start button.");
            }
        }, 30000);

        return () => {
            if (timeoutRef10s.current) clearTimeout(timeoutRef10s.current);
            if (timeoutRef20s.current) clearTimeout(timeoutRef20s.current);
            if (timeoutRef30s.current) clearTimeout(timeoutRef30s.current);
        };
    }, [isExperienceStarted, loadingState, appLoadedBefore30s]);

    useEffect(() => {
        if (isExperienceStarted) {
            if (timeoutRef10s.current) clearTimeout(timeoutRef10s.current);
            if (timeoutRef20s.current) clearTimeout(timeoutRef20s.current);
            if (timeoutRef30s.current) clearTimeout(timeoutRef30s.current);

            chatPrint("Welcome! Feel free to touch any area of the room. It was made for you to explore. You can also drag the screen to rotate the view.");
        }
    }, [isExperienceStarted]);

    useEffect(() => {
        const lastHistoryItem = getLastHistoryItem();

        const currentInstance = data.find(item => item.key === lastHistoryItem);

        if (currentInstance !== 'root' && currentInstance !== 'main' && currentInstance !== undefined) {
            if (currentInstance.isSubSpace === true) {
                chatPrint(`You are at the ${currentInstance.name}, you can touch any object inside the ${currentInstance.description} to explore it.`);
            } else {
                chatPrint(`This is a ${currentInstance.description} about ${currentInstance.name}.`);
            }
        }
        if (history.length === 3 && getLastHistoryItem() !== 'main') {
            setTimeout(() => {
                chatPrint("You can go back to the previous room by double tapping the screen, or by clicking the back button on the top left corner.");
            }, 10000);
        }
    }, [history]);


    return <></>;
}
