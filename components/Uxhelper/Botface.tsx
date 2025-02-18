import React, { useState, useEffect, MouseEvent } from 'react';
import '../../styles/Botface.css';

interface Position {
  x: number;
  y: number;
}

interface EyeProps {
  pupilPosition: Position;
}

interface BotfaceProps {
  chatPrint: (newMessage: string) => void;
}

const Botface: React.FC<BotfaceProps> = ({ chatPrint }) => {
  const [pupilPosition, setPupilPosition] = useState<Position>({ x: 0, y: 0 });
  let movementTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const eyeContainer = document.querySelector('.eye-container');
      if (!eyeContainer) return;

      const rect = eyeContainer.getBoundingClientRect();
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);
      const eyeRadius = 100;
      const pupilRadius = 40;
      const maxEyeMovement = eyeRadius - pupilRadius;

      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      const moveX = Math.cos(angle) * maxEyeMovement;
      const moveY = Math.sin(angle) * maxEyeMovement;

      setPupilPosition({ x: moveX, y: moveY });

      // Clear the previous timeout
      if (movementTimeout) clearTimeout(movementTimeout);

      // Set a timeout to move the pupil back to the center after 1 second of no movement
      movementTimeout = setTimeout(() => {
        setPupilPosition({ x: 0, y: 0 });
      }, 800);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (movementTimeout) clearTimeout(movementTimeout);
    };
  }, []);

  const handleBotClick = (event: MouseEvent) => {
    chatPrint("You won't get anything by clicking on me.")
    event.stopPropagation();
  };

  return (
    <div className="face-wrapper">
      <div className="eye-container" onClick={handleBotClick}>
        <Eye pupilPosition={pupilPosition} />
        <Eye pupilPosition={pupilPosition} />
      </div>
    </div>
  );
};

const Eye: React.FC<EyeProps> = ({ pupilPosition }) => {
  const pupilStyle = {
    transform: `translate(${pupilPosition.x - 50}%, ${pupilPosition.y - 50}%)`
  };

  return (
    <div className="eye">
      <div className="pupil" style={pupilStyle}></div>
    </div>
  );
};

export default Botface;


