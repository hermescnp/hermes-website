import React, { useState, useRef, forwardRef, Ref } from 'react';
import Image from 'next/image';
import '../../../styles/Background.css';
import chevron from 'public/assets/SVG/Chevron.svg';
import BackgroundItem from './BackgroundItem';

interface BackgroundItemType {
  category: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  isVisible: boolean;
  type: string;
}

interface BackgroundListProps {
  items: BackgroundItemType[];
  ref: Ref<HTMLDivElement>;
}

const BackgroundList = forwardRef<HTMLDivElement, BackgroundListProps>(({ items }, ref) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categoryHeights, setCategoryHeights] = useState<number[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const accordionTittleRefs = useRef<(HTMLDivElement | null)[]>([]);

  function expand(category: string, index: number) {
    if (!expandedCategories.includes(category)) {
      setExpandedCategories((prevCategories) => [...prevCategories, category]);
      const mainCategoryUl = document.getElementById(category) as HTMLElement;
      const categoryHeight = mainCategoryUl ? mainCategoryUl.clientHeight + 100 : 0;
      setCategoryHeights((prevHeights) => {
        const newHeights = [...prevHeights];
        newHeights[index] = categoryHeight;
        return newHeights;
      });
      setTimeout(() => {
        mainCategoryUl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      collapse(category, index);
    }
  }

  function collapse(category: string, index: number) {
    setExpandedCategories(expandedCategories.filter((c) => c !== category));
    setCategoryHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = 70;
      return newHeights;
    });
  }

  const categories = items.reduce<string[]>((acc, item) => {
    if (item.type === 'background' && item.isVisible) {
      const category = item.category;
      if (!acc.includes(category)) {
        acc.push(category);
      }
    }
    return acc;
  }, []);

  return (
    <section id="FormationBackground" ref={ref}>
      {categories.map((category, index) => {
        const isExpanded = expandedCategories.includes(category);
        const isHovered = hoveredCategory === category;

        return (
          <div key={index} className="AccordionContent" id={`${category} Category`} style={{ maxHeight: isExpanded ? '1000px' : '70px', height: categoryHeights[index] + 'px', transition: 'all 0.5s ease-out 0s' }}>
            {isExpanded ? (
              <div className="AccordionTittle" id={`${category} Tittle`} onClick={() => collapse(category, index)} style={{ transition: 'all 0.5s ease-out 0s' }} onMouseEnter={() => setHoveredCategory(category)} onMouseLeave={() => setHoveredCategory(null)}>
                <h4>{category}</h4>
                <Image className="SeeLess" src={chevron} width={20} height={20} alt="See Less" />
              </div>
            ) : (
              <div ref={(el) => accordionTittleRefs.current[index] = el} className="AccordionTittle" id={`${category} Tittle`} onClick={() => expand(category, index)} style={{ transition: 'all 0.5s ease-out 0s' }} onMouseEnter={() => setHoveredCategory(category)} onMouseLeave={() => setHoveredCategory(null)}>
                <h4>{category}</h4>
                <Image className="SeeMore" src={chevron} width={20} height={20} alt="See More" />
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
});

export default BackgroundList;