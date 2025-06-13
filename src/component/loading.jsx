// src/components/AdvancedLoader.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AdvancedLoader = ({ message = "Loading..." }) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const circleVariants = {
    start: {
      rotate: 0,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 1
      }
    },
    end: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 1
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={loadingVariants}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-6">
          <motion.div
            className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
            variants={circleVariants}
            initial="start"
            animate="end"
          />
          
          <motion.div
            className="absolute inset-4 border-4 border-purple-500 border-b-transparent rounded-full"
            variants={circleVariants}
            initial="end"
            animate="start"
          />
          
          <motion.div
            variants={pulseVariants}
            className="absolute inset-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15l8-8m0 0l-8-8m8 8H4"
              />
            </svg>
          </motion.div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {message}
          {Array(dots).fill(0).map((_, i) => (
            <span key={i}>.</span>
          ))}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-300 text-center">
          Please wait while we process your request
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedLoader;