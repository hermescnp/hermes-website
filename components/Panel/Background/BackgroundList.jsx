import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import '../../../styles/Background.css';
import chevron from 'public/assets/SVG/Chevron.svg';
import BackgroundItem from './BackgroundItem';

export function BackgroundList({ items }) {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const accordionTittleRefs = useRef([]);

  function expand(category, index) {
    if (!expandedCategories.includes(category)) {
      setExpandedCategories((prevCategories) => [...prevCategories, category]);
      const mainCategoryUl = document.getElementById(category);
      const categoryHeight = mainCategoryUl ? mainCategoryUl.clientHeight + 100 : 0;
      setCategoryHeights((prevHeights) => {
        const newHeights = [...prevHeights];
        newHeights[index] = categoryHeight;
        return newHeights;
      });
      setTimeout(() => {
        const headerHeight = 161;
        let elementTop = mainCategoryUl.offsetTop - headerHeight;
        mainCategoryUl.scrollIntoView({ top: elementTop, behavior: 'smooth' });
      }, 100);
    } else {
      collapse(category, index);
    }
  }

  function collapse(category, index) {
    setExpandedCategories(expandedCategories.filter((c) => c !== category));
    setCategoryHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = 70;
      return newHeights;
    });
  }

  const categories = items.reduce((acc, item) => {
    if (item.type === 'background' && item.isVisible) {
      const category = item.category;
      if (!acc.includes(category)) {
        acc.push(category);
      }
    }
    return acc;
  }, []);

  return (
    <section id="FormationBackground">
      {categories.map((category, index) => {
        const isExpanded = expandedCategories.includes(category);
        const isHovered = hoveredCategory === category;

        return (
          <div key={index} className="AccordionContent" id={`${category} Category`} style={{ maxHeight: isExpanded ? '1000px' : '70px', height: categoryHeights[index] + 'px', transition: 'all 0.5s ease-out 0s' }}>
            {isExpanded ? (
              <div className="AccordionTittle" id={`${category} Tittle`} onClick={() => collapse(category)} style={{ transition: 'all 0.5s ease-out 0s' }} onMouseEnter={() => setHoveredCategory(category)} onMouseLeave={() => setHoveredCategory(null)}>
                <h4>{category}</h4>
                <Image className="SeeLess" src={chevron} width={22} height={22} alt="See Less" />
              </div>
            ) : (
              <div ref={(el) => accordionTittleRefs.current[index] = el} className="AccordionTittle" id={`${category} Tittle`} onClick={() => expand(category)} style={{ transition: 'all 0.5s ease-out 0s' }} onMouseEnter={() => setHoveredCategory(category)} onMouseLeave={() => setHoveredCategory(null)}>
                <h4>{category}</h4>
                <Image className="SeeMore" src={chevron} width={22} height={22} alt="See More" />
              </div>
            )}
            <ul className="BackgroundData" id={category}>
              {items
                .filter((item) => item.type === 'background' && item.isVisible && item.category === category)
                .map((item, index) => (
                  <BackgroundItem key={index} item={item} />
                ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}