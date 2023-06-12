import React, { useState, useRef } from "react";
import '../../styles/Headerpanel.css'
import chevron from 'public/assets/SVG/Chevron.svg'
import Image from "next/image"
import { About } from '@/components/Header/About'
import { Author } from '@/components/Header/Author'
import { Panel } from '@/components/Panel/Panel'

import avatarImg from 'public/assets/HermesPrane.jpg'

interface HeaderPanelProps {
    onSidebarHide: (hidden: boolean) => void;
}

export const HeaderPanel = ({ onSidebarHide }: HeaderPanelProps) => {
    const [offsetHeight, setOffsetHeight] = useState<number>(0);
    const [biographyExpanded, setBiographyExpanded] = useState<boolean>(false);
    const [aboutMeOpacity, setAboutMeOpacity] = useState<number>(0);
    const [aboutMeHidden, setAboutMeHidden] = useState<boolean>(true);

    const aboutMeRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const bioRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const hoverAuthor = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setOffsetHeight(110);
            appearAboutMe();
        }, 500);
    }

    const appearAboutMe = () => {
        setAboutMeOpacity(1);
        setAboutMeHidden(false);
    }

    const unhoverAuthor = () => {
        clearTimeout(hoverTimeoutRef.current!);
        setAboutMeOpacity(0);
        setAboutMeHidden(true);
        if (biographyExpanded) {
            setBiographyExpanded(false);
        }
        setTimeout(() => {
            setOffsetHeight(0);
        }, 300);
    }

    const handleAboutMeClick = () => {
        const extraOffset = 40;
        if (biographyExpanded) {
            // If the biography is already expanded, subtract its height
            setOffsetHeight(offsetHeight - (bioRef.current!.offsetHeight + extraOffset));
        } else {
            // Otherwise, add its height
            setOffsetHeight(offsetHeight + bioRef.current!.offsetHeight + extraOffset);
        }
        // Toggle the expanded state
        setBiographyExpanded(!biographyExpanded);
    }

    const handleHideButtonClick = () => {
        onSidebarHide(true);
    }

    const handleHideButtonMouseEnter = (event: React.MouseEvent) => {
        event.stopPropagation();  // Stop event from triggering the parent div's onMouseEnter
        unhoverAuthor();  // Explicitly call unhoverAuthor as we are stopping propagation
    };

    const handleHideButtonMouseLeave = (event: React.MouseEvent) => {
        event.stopPropagation();  // Stop event from triggering the parent div's onMouseLeave
    };

    return (
        <div id="HeaderPanel" onMouseEnter={hoverAuthor} onMouseLeave={unhoverAuthor}>

            <Author />

            <div id="HeaderPanelBehind">
                <Image
                    id="hideButton"
                    src={chevron}
                    width={24}
                    height={24}
                    alt="chevron"
                    onClick={handleHideButtonClick}
                    onMouseEnter={handleHideButtonMouseEnter}
                    onMouseLeave={handleHideButtonMouseLeave}
                />
            </div>

            <div id="offset" style={{ height: `${offsetHeight}px`, transition: 'height 0.3s ease' }}>
                <About
                    style={{ opacity: aboutMeOpacity }}
                    className={aboutMeHidden ? 'hidden' : ''}
                    bioRef={bioRef}
                    handleAboutMeClick={handleAboutMeClick}
                    expanded={biographyExpanded} />
            </div>

        </div>
    )

}