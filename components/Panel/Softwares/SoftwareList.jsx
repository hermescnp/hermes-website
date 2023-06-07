import React from "react"
import '../../../styles/Softwares.css'
import SoftwareItem from "./SoftwareItem"

const SoftwareList = ({ items }) => {
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