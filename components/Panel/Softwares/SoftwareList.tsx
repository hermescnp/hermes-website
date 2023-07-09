import React, { forwardRef } from "react";
import '../../../styles/Softwares.css';
import SoftwareItem from "./SoftwareItem";

interface SoftwareItemType {
    name: string;
    description: string;
    skillLevel: number;
    iconSource: string;
    isVisible: boolean;
    type: string;
}

interface SoftwareListProps {
    items: SoftwareItemType[];
    // removed the ref from here
}

// Wrapped component in forwardRef, note that ref is now a second parameter to the function
const SoftwareList = forwardRef<HTMLDivElement, SoftwareListProps>(( { items }, ref ) => {
    return (
        <section id="SoftwareSection" ref={ref}>
            <h4 className="SkillSectionTittle">Software Expertise</h4>
            <ul id="softwareContainer" className="SoftwareContainer">
                {items.map((item, i) => {
                    if (item.type === 'software' && item.isVisible) {
                        return <SoftwareItem key={i} item={item} />;
                    }
                })}
            </ul>
        </section>
    );
});

export default SoftwareList;
