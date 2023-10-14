import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import chevron from 'public/assets/SVG/Chevron.svg'
import legineIcon from 'public/assets/SVG/legine_wing.svg'
import ObjectIcon from 'public/assets/SVG/3DGraphics_Icon.svg'

interface NavInstanceProps {
    instanceKey: string;
    instanceName: string;
    placehover: any;
    HandleInstanceClick: any;
}

export const NavInstance: React.FC<NavInstanceProps> = ({ instanceKey, instanceName, placehover, HandleInstanceClick }) => {
    const [hoverName, setHoverName] = useState(placehover || '');

    // Update hoverName whenever placehover changes
    useEffect(() => {
            setHoverName(placehover || '');
    }, [placehover]);

    if (instanceName === "Root") {
        return (
            <button className="RootInstance">
                <Image id="legineIcon" className="LegineIcon" src={legineIcon} width={30} height={30} alt="Legine"></Image>
            </button>
        )
    } else {
        return (
            <div className="NavigationInstance">
                <Image id={instanceKey === "main" ? "objectIcon" : "arrow"} className={instanceKey === "main" ? "ObjectIcon" : "Arrow"} src={instanceKey === "main" ? ObjectIcon : chevron} width={15} height={15} alt={instanceKey === "main" ? "Object Icon" : "Arrow"}></Image>
                <button className={instanceKey === "main" ? "MainInstanceButton" : "InstanceButton"} onClick={HandleInstanceClick}>{instanceName}</button>
            </div>
        )
    }
}
