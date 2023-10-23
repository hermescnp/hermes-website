import React, { useState, useEffect, useRef } from 'react';

interface TypingEffectProps {
    message: string;
    typingSpeed?: number;
    showCursor?: boolean;
    isSoundOn?: boolean;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ message, typingSpeed = 100, showCursor = false, isSoundOn = false }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const indexRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Directly refer to the sounds using their paths relative to the public directory
    const vocalSounds: { [key: string]: string } = {
        'a': '/assets/sounds/A.mp3',
        'e': '/assets/sounds/E.mp3',
        'i': '/assets/sounds/I.mp3',
        'o': '/assets/sounds/O.mp3',
        'u': '/assets/sounds/U.mp3'
    };

    const playSound = (src: string) => {
        const audio = new Audio(src);
        audio.volume = 0.3;
        audio.play();
    }    

    const typeNextLetter = () => {
        if (indexRef.current < message.length) {
            const currentLetter = message[indexRef.current].toLowerCase();

            // If the current letter has a corresponding sound, play it
            if (vocalSounds[currentLetter] && isSoundOn) {
                playSound(vocalSounds[currentLetter]);
            }

            // Continue typing
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

    return (
        <span className='bot-text'>
            {displayedMessage}
            {showCursor && <span className="blinking-cursor"></span>}
        </span>
    );
}
