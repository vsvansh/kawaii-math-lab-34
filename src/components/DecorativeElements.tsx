
import React from 'react';
import { motion } from 'framer-motion';

const FloatingBubble: React.FC<{
  size?: number;
  color?: string;
  delay?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}> = ({ 
  size = 10, 
  color = 'rgba(255, 158, 176, 0.3)', 
  delay = 0,
  top,
  left,
  right,
  bottom
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        top,
        left,
        right,
        bottom
      }}
      initial={{ y: 0, opacity: 0.7 }}
      animate={{ 
        y: [-10, 10], 
        opacity: [0.7, 0.5, 0.7] 
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          delay
        },
        opacity: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          delay
        }
      }}
    />
  );
};

const Star: React.FC<{
  size?: number;
  color?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}> = ({
  size = 12,
  color = 'rgba(255, 234, 160, 0.8)',
  top,
  left,
  right,
  bottom,
  delay = 0
}) => {
  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom
      }}
      initial={{ scale: 0.8, opacity: 0.7, rotate: 0 }}
      animate={{ 
        scale: [0.8, 1, 0.8], 
        opacity: [0.7, 1, 0.7],
        rotate: 360
      }}
      transition={{
        scale: {
          duration: 2,
          repeat: Infinity,
          delay
        },
        opacity: {
          duration: 2,
          repeat: Infinity,
          delay
        },
        rotate: {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          delay
        }
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          fill={color} 
        />
      </svg>
    </motion.div>
  );
};

const DecorativeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Top left bubbles */}
      <FloatingBubble size={30} color="rgba(255, 158, 176, 0.2)" top="10%" left="5%" delay={0.5} />
      <FloatingBubble size={20} color="rgba(196, 176, 255, 0.2)" top="15%" left="10%" delay={1.2} />
      <FloatingBubble size={15} color="rgba(156, 204, 252, 0.2)" top="8%" left="15%" delay={0.8} />
      
      {/* Top right bubbles */}
      <FloatingBubble size={25} color="rgba(195, 240, 200, 0.2)" top="12%" right="8%" delay={0.3} />
      <FloatingBubble size={18} color="rgba(254, 198, 161, 0.2)" top="18%" right="15%" delay={1.5} />
      
      {/* Bottom bubbles */}
      <FloatingBubble size={22} color="rgba(255, 234, 160, 0.2)" bottom="10%" left="20%" delay={0.7} />
      <FloatingBubble size={28} color="rgba(196, 176, 255, 0.2)" bottom="15%" right="10%" delay={1.1} />
      
      {/* Stars */}
      <Star size={16} top="25%" left="25%" delay={0.2} />
      <Star size={12} top="15%" right="35%" delay={0.9} color="rgba(255, 158, 176, 0.7)" />
      <Star size={14} bottom="30%" right="20%" delay={0.5} color="rgba(156, 204, 252, 0.7)" />
      <Star size={18} bottom="25%" left="10%" delay={1.3} color="rgba(195, 240, 200, 0.7)" />
    </div>
  );
};

export { FloatingBubble, Star, DecorativeBackground };
