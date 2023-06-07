import React from 'react'

const SoftwareItem = ({ item }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <li
            className={`SoftwareItem ${hovered ? 'itemHover' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ transition: 'all 0.2s ease-out' }}
        >
            <div className="SoftwareIcon">
                <img
                    className={`Logotype ${hovered ? 'inflatedLogo' : ''}`}
                    src={item.iconSource}
                    style={{ transition: 'all 0.2s ease-out' }}
                />
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