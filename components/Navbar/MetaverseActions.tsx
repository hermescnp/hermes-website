import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/MetaverseActions.css'
import mapIcon from 'public/assets/SVG/space_map.svg'
import searchIcon from 'public/assets/SVG/search_icon.svg'
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
                        <div style={{ position: 'relative', width: '25px', height: '25px' }}>
                            <Image id="mapIcon" className={`${isMapOpened ? 'MapIconOpened' : 'MapIcon'}`} src={mapIcon} fill alt="Map" />
                        </div>
                    </button>
                    <button className='ActionButton icon-disabled'>
                        <div style={{ position: 'relative', width: '30px', height: '30px' }}>
                            <Image id="arIcon" className='MapIcon' src={arIcon} fill alt="Map" />
                        </div>
                    </button>
                    <button id='searchButton' className='ActionButton icon-disabled' >
                        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                            <Image id="soundIcon" className='MapIcon' src={searchIcon} fill alt="Map" />
                        </div>
                    </button>
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '0%' }}>
                <SpaceMap isOpened={isMapOpened} onMouseOver={stopPropagation} />
            </div>
        </>
    )
}

