import React, { useState, useRef } from 'react';
import Image from "next/image"

interface SkillItemType {
  category: string;
  skillName: string;
  skillLevel: number;
  iconSource: string;
  isVisible: boolean;
  type: string;
}

interface CircleProps {
  cx: number;
  cy: number;
  r: number;
}

interface SkillItemProps {
  skill: SkillItemType;
}

export const SkillItem: React.FC<SkillItemProps> = ({ skill }) => {

    const progressAreaRef = useRef<HTMLDivElement>(null);
    const skillItemRef = useRef<HTMLDivElement>(null);
    const { skillName, skillLevel, iconSource, category } = skill;

    const [circleProps, setCircleProps] = useState<CircleProps>({
        cx: 35,
        cy: 35,
        r: 33
    });

    const [isInflated, setIsInflated] = useState<boolean>(false);

    const { cx, cy, r } = circleProps;
    const circumference = getCircunference(r);
    const offset = getOffsetValue(circumference, skillLevel);

    const handleMouseEnter = () => {
        setCircleProps({
            cx: 40,
            cy: 40,
            r: 38
        });
        setIsInflated(true);
    };

    const handleMouseLeave = () => {
        setCircleProps({
            cx: 35,
            cy: 35,
            r: 33
        });
        setIsInflated(false);
    };

    const progressAreaClasses = `ProgressArea ${isInflated ? 'inflatedOuter' : ''}`;
    const skillItemClasses = `SkillItem ${isInflated ? 'inflatedInner' : ''}`;

    return (
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="SkillTag">
                <div className={progressAreaClasses} ref={progressAreaRef}>
                    <svg width="150px" height="150px" version="1.1" className="CircleProgress">
                        <circle
                            cx={cx}
                            cy={cy}
                            r={r}
                            strokeDasharray={circumference.toString()}
                            strokeDashoffset={offset.toString()}
                            strokeLinecap="round"
                            style={{ stroke: 'white', strokeWidth: '4px', fill: 'none', transition: 'all 0.2s ease-out' }}
                        />
                    </svg>
                    <div className={skillItemClasses} ref={skillItemRef}>
                        <Image src={`/assets/SVG/${iconSource}`} alt={skillName} className="SkillIcon" width={70} height={70} />
                    </div>
                </div>
                <div className="SkillLabel">
                    <label>{skillName}</label>
                </div>
            </div>
        </li>
    );
}

function getCircunference(radius: number): number {
    return 2 * Math.PI * radius;
}

function getOffsetValue(circumference: number, skillLevel: number): number {
    const progressPercentage = skillLevel / 100;
    return circumference * (1 - progressPercentage);
}
