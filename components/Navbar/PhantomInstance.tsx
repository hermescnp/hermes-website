import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface SearchBarProps {
    placehover?: string | null;
    isMapOpened: boolean;
}

export default function PhantomInstance({ placehover, isMapOpened }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(placehover || '');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (isFocused === false && isMapOpened === false) {
            setInputValue(placehover || '');
        }
    }, [placehover]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const trimmedValue = value.replace(/^ +/g, ''); // Remove leading spaces
        setInputValue(trimmedValue);
    }

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    const handleSubmit = () => {
        if (inputValue) {
            console.log('Path sent');
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    let active = inputValue ? 'PhantomArrow--active' : '';

    return (
        <div className="NavigationInstance">
            <Image id="arrow" className={`PhantomArrow ${active}`} src={'/assets/SVG/Chevron.svg'} width={15} height={15} alt="Arrow"></Image>
            <div className={`PhantomInstance`}>{inputValue}</div>
        </div>
    )
}
