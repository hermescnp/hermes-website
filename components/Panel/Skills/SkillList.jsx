import React from 'react';
import { SkillItem } from './SkillItem';
import '../../../styles/Skills.css';

function SkillList({ items }) {

  let skillData = items.filter(item => item.type === 'skill');

  let categorySkills = skillData.reduce((result, item) => {
    (result[item['category']] = result[item['category']] || []).push(item);
    return result;
  }, {});

  return (
    <div id="SkillSection">
      {Object.entries(categorySkills).map(([category, skills]) => (
        <div key={category}>
          <h4 className="SkillSectionTittle">{category}</h4>
          <ul className="TagContainer" id={category}>
            {skills.map(skill => <SkillItem key={skill.skillName} skill={skill} />)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SkillList;