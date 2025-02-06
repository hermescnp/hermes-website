import React, { useState, useEffect, useRef } from 'react'
import { useExperienceContext } from '@/context/ExperienceContext'

export default function NavSearchBar() {
    const [inputValue, setInputValue] = useState('');
    const experienceContext = useExperienceContext();
    const { isSearchBarActive, setIsSearchBarActive, toggleFreeze, setToggleFreeze, } = useExperienceContext();
    const instanceInput = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const trimmedValue = value.replace(/^ +/g, ''); // Remove leading spaces
        setInputValue(trimmedValue);
    }

    useEffect(() => {
        if (isSearchBarActive) {
            instanceInput.current?.focus()
        } else {
            setInputValue('')
            instanceInput.current?.blur()
        }
    }, [isSearchBarActive])

    const handleBlur = () => {
        if (!toggleFreeze) {
            setIsSearchBarActive(false);
            setToggleFreeze(true);
            setTimeout(() => {
                setToggleFreeze(false);
            }, 500);
        }
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
        <div className={'searchbar-container' + (!isSearchBarActive ? ' invisible' : '')}>
            <div className={'SearchBar' + (!isSearchBarActive ? ' searchbar-collapsed' : '')}>
                <input
                    ref={instanceInput}
                    type="text"
                    placeholder='Search Places or Objects'
                    className="InstanceInput"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    )
}
