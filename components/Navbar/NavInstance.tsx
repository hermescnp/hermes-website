import React from 'react'
import Image from 'next/image'
import chevron from 'public/assets/SVG/Chevron.svg'
import legineIcon from 'public/assets/SVG/legine_wing.svg'

interface NavInstanceProps {
    instanceName: string;
}

export default function NavInstance({ instanceName }: NavInstanceProps) {

    if (instanceName === "Root") {
        return (
            <button className="RootInstance">
            <Image id="legineIcon" className="LegineIcon" src={legineIcon} width={30} height={30} alt="Legine"></Image>
        </button>
        )
    } else {
        return (
            <div className="NavigationInstance">
                <Image id="arrow" className="Arrow" src={chevron} width={15} height={15} alt="Arrow"></Image>
                <button className="InstanceButton">{instanceName}</button>
            </div>
        )
    }
}
