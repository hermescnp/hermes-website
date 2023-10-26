import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/MetaverseActions.css'
import mapIcon from 'public/assets/SVG/space_map.svg'
import soundIcon from 'public/assets/SVG/sound_icon.svg'
import arIcon from 'public/assets/SVG/augmented_reality_icon.svg'
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
                    <button className='ActionButton icon-disabled'>
                        <Image id="arIcon" className='MapIcon' src={arIcon} width={25} height={25} alt="Map" />
                    </button>
                    <button id='muteSoundButton' className='ActionButton icon-disabled'>
                        <Image id="soundIcon" className='MapIcon' src={soundIcon} width={20} height={20} alt="Map" />
                    </button>
                </div>
            </div>
            <SpaceMap isOpened={isMapOpened} onMouseOver={stopPropagation} />
        </>
    )
}

