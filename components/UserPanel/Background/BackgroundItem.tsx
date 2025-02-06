import React, { useState } from 'react';

interface BackgroundItemType {
  category: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  isVisible: boolean;
  type: string;
}

interface BackgroundItemProps {
  item: BackgroundItemType;
}

const BackgroundItem: React.FC<BackgroundItemProps> = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className={`BackgroundTag ${hovered ? 'itemHover' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transition: 'all 0.5s ease-out' }}
    >
      <p className='Date'>{item.startDate}-{item.endDate}</p>
      <strong>{item.name}</strong>
      <p>{item.description}</p>
    </li>
  );
}

export default BackgroundItem;
