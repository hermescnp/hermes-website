import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavInstanceProps {
    instanceName: string;
    HandleInstanceClick: () => void;
}

export const NavInstance: React.FC<NavInstanceProps> = ({ instanceName, HandleInstanceClick }) => {

    return (
        <div className="NavigationInstance" onClick={HandleInstanceClick}>
            <Image
                id="objectIcon"
                className="ObjectIcon"
                src={'/assets/SVG/3DGraphics_Icon.svg'}
                width={20}
                height={20}
                alt="Object Icon"
            />
            <button className={"InstanceButton"} onClick={HandleInstanceClick}>{instanceName}</button>
        </div>
    )
}
