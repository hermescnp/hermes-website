import React, { useState, useEffect, useRef } from 'react';

interface TypingEffectProps {
    message: string;
    typingSpeed?: number;
    showCursor?: boolean;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ message, typingSpeed = 100, showCursor = false }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const indexRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const typeNextLetter = () => {
        if (indexRef.current < message.length) {
            // Correct the message if it deviates from the desired message
            const correctMessageSoFar = message.substring(0, indexRef.current + 1);
            setDisplayedMessage(correctMessageSoFar);

            indexRef.current++;
            timeoutRef.current = setTimeout(typeNextLetter, typingSpeed);
        }
    };

    useEffect(() => {
        typeNextLetter();

        // Clear timeout when the component unmounts
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [message, typingSpeed]);

    return <span className='bot-text'>
        {displayedMessage}
        {showCursor && <span className="blinking-cursor"></span>}
    </span>;
}
