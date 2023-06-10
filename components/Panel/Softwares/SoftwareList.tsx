import React from "react";
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
}

const SoftwareList: React.FC<SoftwareListProps> = ({ items }) => {
    return (
        <section id="SoftwareSection">
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
};

export default SoftwareList;
