import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import chevron from 'public/assets/SVG/Chevron.svg'
import searchIcon from 'public/assets/SVG/search_icon.svg'
import { useExperienceContext } from '@/context/ExperienceContext'

interface SearchBarProps {
    placehover?: string | null;
    isMapOpened: boolean;
}

export default function NavSearchBar({ placehover, isMapOpened }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(placehover || '');
    const [isFocused, setIsFocused] = useState(false);
    const experienceContext = useExperienceContext();

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
            experienceContext.pushToHistory(inputValue);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <div className="NavSearchBar">
            <Image id="arrow" className="Arrow" src={chevron} width={15} height={15} alt="Arrow"></Image>
            <div className={`SearchBar ${isFocused ? 'SearchBar--focused' : ''}`}>
                <input 
                    type="text" 
                    placeholder='Search Places or Objects' 
                    className="InstanceInput" 
                    value={inputValue} 
                    onChange={handleInputChange}
                    onFocus={handleFocus} 
                    onBlur={handleBlur} 
                    onKeyDown={handleKeyDown}
                />
                <div className="SearchIconContainer" onClick={handleSubmit}>
                    <Image id="searchIcon" className={`SearchIcon ${inputValue ? 'SearchIcon--enabled' : ''}`} src={searchIcon} width={20} height={20} alt="Search"></Image>
                </div>
            </div>
        </div>
    )
}
