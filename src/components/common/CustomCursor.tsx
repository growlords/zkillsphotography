import React, { useEffect, useState } from 'react';

export interface CursorState {
  label: string;
  variant: 'default' | 'view' | 'play' | 'drag' | 'open';
  active: boolean;
}

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<CursorState>({
    label: '',
    variant: 'default',
    active: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch desktop devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        const cursorType = target.getAttribute('data-cursor') || 'default';
        const label = target.getAttribute('data-cursor-label') || cursorType.toUpperCase();
        setCursorState({
          variant: cursorType as CursorState['variant'],
          label: label,
          active: true,
        });
      } else {
        setCursorState({
          variant: 'default',
          label: '',
          active: false,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isExpanded = cursorState.active && cursorState.variant !== 'default';

  return (
    <div
      className="custom-cursor-element fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`relative -top-1/2 -left-1/2 rounded-full flex items-center justify-center transition-all duration-300 ease-out border backdrop-blur-sm ${
          isExpanded
            ? 'w-20 h-20 bg-champagne text-dark font-sans text-xs font-bold tracking-widest border-champagne shadow-2xl scale-100'
            : 'w-4 h-4 bg-pearl/80 border-pearl/40 scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        {isExpanded && (
          <span className="uppercase tracking-widest text-[10px] select-none font-bold animate-pulse">
            {cursorState.label}
          </span>
        )}
      </div>
    </div>
  );
};
