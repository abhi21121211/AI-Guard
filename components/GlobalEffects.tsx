import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GlobalCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [x, y]);

  // Hide custom cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select { cursor: none !important; }
      `}</style>
      
      {/* Primary Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full pointer-events-none z-[10000] shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className={`fixed top-0 left-0 border rounded-full pointer-events-none z-[9999] transition-all duration-150 mix-blend-screen ${
            isClicking ? 'w-6 h-6 border-cyan-400 bg-cyan-400/10' : 
            isPointer ? 'w-10 h-10 border-cyan-400/60 border-dashed' : 'w-8 h-8 border-cyan-500/30'
        }`}
        style={{ x: xSpring, y: ySpring, translateX: '-50%', translateY: '-50%' }}
        animate={isPointer ? { rotate: 180 } : { rotate: 0 }}
      >
        {/* Decorative ticks on ring */}
        {!isPointer && (
            <>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-0.5 h-0.5 bg-cyan-400/50"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] w-0.5 h-0.5 bg-cyan-400/50"></div>
                <div className="absolute left-0 top-1/2 -translate-x-[1px] -translate-y-1/2 w-0.5 h-0.5 bg-cyan-400/50"></div>
                <div className="absolute right-0 top-1/2 translate-x-[1px] -translate-y-1/2 w-0.5 h-0.5 bg-cyan-400/50"></div>
            </>
        )}
      </motion.div>
    </>
  );
};

const ScanlineOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {/* Static Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-60" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Slow Moving Horizontal Scan Bar */}
      <motion.div 
        className="absolute left-0 w-full h-[2px] bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
};

export const GlobalEffects = () => {
  return (
    <>
      <GlobalCursor />
      <ScanlineOverlay />
    </>
  );
};
