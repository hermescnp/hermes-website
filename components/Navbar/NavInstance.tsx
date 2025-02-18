import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavInstanceProps {
    key?: React.Key;
    instanceName: string;
    HandleInstanceClick: () => void;
    HandleInstanceNameEnter: () => void;
    HandleInstanceNameLeave: () => void;
}

export const NavInstance: React.FC<NavInstanceProps> = ({ instanceName, HandleInstanceClick, HandleInstanceNameEnter, HandleInstanceNameLeave }) => {

    return (
        <div className="NavigationInstance" onClick={HandleInstanceClick} onMouseEnter={HandleInstanceNameEnter} onMouseLeave={HandleInstanceNameLeave}>
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
