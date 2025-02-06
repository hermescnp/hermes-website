import React from 'react'
import Image from "next/image"

interface SoftwareItemType {
    name: string;
    description: string;
    skillLevel: number;
    iconSource: string;
    isVisible: boolean;
    type: string;
}

interface SoftwareItemProps {
    item: SoftwareItemType;
}

const SoftwareItem: React.FC<SoftwareItemProps> = ({ item }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <li
            className={`SoftwareItem ${hovered ? 'itemHover' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ transition: 'all 0.2s ease-out' }}
        >
            <div className="SoftwareIcon">
                <div style={{ position: 'relative', width: '35px', height: '35px' }}>
                    <Image
                        className={`Logotype ${hovered ? 'inflatedLogo' : ''}`}
                        src={`/assets/${item.iconSource}`}
                        style={{ transition: 'all 0.2s ease-out' }}
                        alt={item.name} fill
                    />
                </div>
            </div>
            <div className="SoftwareInfo">
                <label className="SoftwareName">
                    {item.name}
                    <em> ({item.description})</em>
                </label>
                <div className="ProgressBar">
                    <div
                        className="Progress"
                        style={{ width: `${item.skillLevel}%` }}
                    />
                </div>
            </div>
        </li>
    );
};

export default SoftwareItem;