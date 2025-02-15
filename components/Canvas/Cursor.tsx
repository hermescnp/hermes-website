import React, { useEffect, useState } from 'react';
import { useExperienceContext } from '@/context/ExperienceContext';
import styles from '../../styles/Cursor.module.css';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { placehover } = useExperienceContext();
  const { isCursorTargeting, setIsCursorTargeting } = useExperienceContext();

  useEffect(() => {
    setIsCursorTargeting(!!placehover?.name);
  }, [placehover]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`${styles.cursor} ${isCursorTargeting ? styles.targeting : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

export default CustomCursor;
