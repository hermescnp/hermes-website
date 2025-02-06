import React, { useState, forwardRef, useRef, useEffect } from "react"
import '../../../styles/Softwares.css'
import SoftwareItem from "./SoftwareItem"
import Image from "next/image"

interface SoftwareItemType {
    name: string;
    description: string;
    skillLevel: number;
    iconSource: string;
    isVisible: boolean;
    type: string;
    isImportant: boolean;
}

interface SoftwareListProps {
    items: SoftwareItemType[];
}

const SoftwareList = forwardRef<HTMLDivElement, SoftwareListProps>(({ items }, ref) => {
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef<HTMLUListElement>(null);

    // Calculate initial height
    const importantItemsCount = items.filter(item => item.isImportant).length;
    const initialHeight = importantItemsCount * 75;

    const [height, setHeight] = useState<string>(`${initialHeight}px`);
    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (containerRef.current) {
            setHeight(`${containerRef.current.scrollHeight}px`);
        }
    }, [showAll, items]);

    const handleClick = (event: React.SyntheticEvent) => {
        setShowAll(!showAll);
        setExpanded(!expanded);
        event.stopPropagation();
    }

    const displayItems = showAll ? items : items.filter(item => item.isImportant === true);

    return (
        <section id="SoftwareSection" ref={ref}>
            <h4 className="SkillSectionTittle">Software Expertise</h4>
            <div style={{ height, overflow: 'hidden', transition: 'height 500ms' }}>
                <ul id="softwareContainer" className="SoftwareContainer" ref={containerRef}>
                    {displayItems.map((item, i) => {
                        if (item.type === 'software' && item.isVisible) {
                            return <SoftwareItem key={i} item={item} />;
                        }
                    })}
                </ul>
            </div>
            <div className="SeeMoreButtonSoftwareContainer">
                <button className="SeeMoreButtonSoftware" onClick={handleClick}>
                    <p id="aboutMeText">{showAll ? 'See Less' : 'See More'}</p>
                    <Image id="AboutMeChevron" className={expanded ? "SeeLess" : "SeeMore"} src={'/assets/SVG/Chevron.svg'} width={20} height={20} alt="See More" />
                </button>
            </div>
        </section>
    );
});

export default SoftwareList;
