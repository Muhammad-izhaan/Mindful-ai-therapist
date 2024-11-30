import React from 'react';
import { motion } from 'framer-motion';

interface MicIconProps {
  isListening: boolean;
  isSpeaking: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const MicIcon: React.FC<MicIconProps> = ({ 
  isListening, 
  isSpeaking, 
  onMouseDown, 
  onMouseUp 
}) => {
  return (
    <div 
      className="cursor-pointer"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill={isListening ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
        animate={{
          scale: isListening ? [1, 1.2, 1] : 1,
          transition: { 
            duration: 0.8, 
            repeat: isListening ? Infinity : 0 
          }
        }}
        className="transition-all duration-300 ease-in-out"
      >
        {isListening && (
          <motion.circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="white" 
            strokeWidth="2" 
            fill="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.3, 0.1, 0],
              scale: [0.5, 2, 3],
              transition: { 
                duration: 1.5, 
                repeat: Infinity 
              }
            }}
            className="absolute top-0 left-0"
          />
        )}
        
        <path 
          d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" 
          fill={isListening ? 'white' : 'rgba(255,255,255,0.5)'}
        />
        <path 
          d="M19 10v2a7 7 0 0 1-14 0v-2m7 7v3m-3 0h6" 
          stroke="white" 
          strokeWidth="2" 
          fill="none"
        />
      </motion.svg>
      
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-8 h-8 bg-white/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MicIcon;
