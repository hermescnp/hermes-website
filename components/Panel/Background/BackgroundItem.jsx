import React from 'react'

export default function BackgroundItem({ item }) {
    const [hovered, setHovered] = React.useState(false);

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
