import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/MetaverseActions.css'
import mapIcon from 'public/assets/SVG/space_map.svg'
import { SpaceMap } from '../SpaceMap/SpaceMap'

interface MetaActionsProps {
    openSpaceMapWindow: () => void;
    isMapOpened: boolean;
}

export const MetaverseActions: React.FC<MetaActionsProps> = ({ openSpaceMapWindow, isMapOpened }) => {

    const stopPropagation = (event: React.SyntheticEvent) => {
        event.stopPropagation();
    }

    return (
        <>
            <div className="MetaverseActionsBar" onClick={stopPropagation}>
                <div className="MapButtonContainer">
                    <button className={`${isMapOpened ? 'MapButtonOpened' : 'MapButton'}`} onClick={openSpaceMapWindow}>
                        <Image id="mapIcon" className={`${isMapOpened ? 'MapIconOpened' : 'MapIcon'}`} src={mapIcon} width={22} height={22} alt="Map" />
                    </button>
                </div>
            </div>
            <SpaceMap isOpened={isMapOpened} onMouseOver={stopPropagation} />
        </>
    )
}

