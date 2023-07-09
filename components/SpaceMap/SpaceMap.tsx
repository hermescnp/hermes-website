import React from 'react'
import '../../styles/SpaceMap.css'

interface Props {
  onMouseOver?: (event: React.SyntheticEvent) => void;
  isOpened: boolean;
}

export const SpaceMap: React.FC<Props> = ({ onMouseOver, isOpened }) => {
  const divStyle = {
    height: isOpened ? '100%' : '0%',
  };

  return (
    <div className='SpaceMapWindow' style={divStyle} onMouseOver={onMouseOver} ></div>
  )
}
