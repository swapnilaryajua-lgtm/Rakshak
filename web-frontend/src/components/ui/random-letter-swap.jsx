import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*+=-';

export default function RandomLetterSwap({
  label,
  className,
  staggerDuration = 0.025,
  ...props
}) {
  const [text, setText] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isHovered) {
      let iteration = 0;
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setText(
          label
            .split('')
            .map((letter, index) => {
              if (index < Math.floor(iteration)) {
                return label[index];
              }
              // Preserve spaces
              if (letter === ' ') return ' ';
              
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= label.length) {
          clearInterval(intervalRef.current);
        }

        // Adjust speed here
        iteration += 0.5; 
      }, 30);
    } else {
      clearInterval(intervalRef.current);
      setText(label);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered, label]);

  return (
    <motion.span
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {text}
    </motion.span>
  );
}
