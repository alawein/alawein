import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isMoving: boolean;
}

export const useMousePosition = () => {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isMoving: false,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        isMoving: true,
      });

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setPosition((prev) => ({ ...prev, isMoving: false }));
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return position;
};

export default useMousePosition;

