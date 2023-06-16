import React, { forwardRef } from 'react';
import { SkillItem } from './SkillItem';
import '../../../styles/Skills.css';

interface SkillItemType {
  category: string;
  skillName: string;
  skillLevel: number;
  iconSource: string;
  isVisible: boolean;
  type: string;
}

interface SkillListProps {
  items: SkillItemType[];
}

const SkillList = forwardRef<HTMLDivElement, SkillListProps>(({ items }, ref) => {

  let skillData = items.filter(item => item.type === 'skill');

  let categorySkills = skillData.reduce<Record<string, SkillItemType[]>>((result, item) => {
    (result[item.category] = result[item.category] || []).push(item);
    return result;
  }, {});

  return (
    <div id="SkillSection" ref={ref}>
      {Object.entries(categorySkills).map(([category, skills]: [string, SkillItemType[]]) => (
        <div key={category}>
          <h4 className="SkillSectionTittle">{category}</h4>
          <ul className="TagContainer" id={category}>
            {skills.map((skill: SkillItemType) => <SkillItem key={skill.skillName} skill={skill} />)}
          </ul>
        </div>
      ))}
    </div>
  );
})

export default SkillList;
