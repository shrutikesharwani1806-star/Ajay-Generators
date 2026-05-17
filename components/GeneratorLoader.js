'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function GeneratorLoader({ isLit, isTyping }) {
  const isWorking = isLit;

  return (
    <div className="relative w-[200px] h-[200px] flex flex-col items-center justify-end">
      {/* Generator Body */}
      <motion.div
        animate={{
          x: isWorking ? [-1.5, 1.5, -1, 1, 0] : 0,
          y: isWorking ? [0.5, -0.5, 0] : 0,
        }}
        transition={{ repeat: Infinity, duration: 0.1 }}
        className="relative z-10 w-[140px] h-[120px]"
      >
        <svg viewBox="0 0 140 120" width="100%" height="100%" fill="none" className="overflow-visible">
          {/* Main Body */}
          <rect x="10" y="30" width="120" height="70" rx="8" fill="#1A222D" stroke="#3A4A5D" strokeWidth="2" />
          
          {/* Top Panel (Orange) */}
          <rect x="10" y="20" width="120" height="15" rx="4" fill="#D4841C" />
          <path d="M15 20 L25 10 L115 10 L125 20 Z" fill="#b06a12" />
          
          {/* Grill / Vents */}
          {[45, 55, 65, 75, 85].map(y => (
            <line key={y} x1="25" y1={y} x2="70" y2={y} stroke="#0F1722" strokeWidth="5" strokeLinecap="round" />
          ))}

          {/* Control Panel */}
          <rect x="85" y="45" width="35" height="45" rx="4" fill="#0F1722" stroke="#3A4A5D" strokeWidth="1" />
          
          {/* Control Panel LEDs */}
          <motion.circle 
            animate={{ opacity: isWorking ? [1, 0.4, 1] : 0.4 }} 
            transition={{ repeat: Infinity, duration: 0.5 }}
            cx="95" cy="55" r="3" fill={isWorking ? '#10b981' : '#4B5563'} 
          />
          <motion.circle 
            animate={{ opacity: isWorking ? [1, 0.2, 1] : 0.2 }} 
            transition={{ repeat: Infinity, duration: 0.2 }}
            cx="105" cy="55" r="3" fill={isWorking ? '#ef4444' : '#4B5563'} 
          />
          <motion.circle 
            animate={{ opacity: isTyping && !isWorking ? [1, 0.5, 1] : 0.5 }} 
            transition={{ repeat: Infinity, duration: 1 }}
            cx="115" cy="55" r="3" fill={isTyping || isWorking ? '#eab308' : '#4B5563'} 
          />
          
          {/* Screen */}
          <rect x="92" y="65" width="21" height="14" rx="2" fill={isWorking ? '#0ea5e9' : '#1e293b'} />
          
          {/* Wheels */}
          <circle cx="30" cy="105" r="10" fill="#111" stroke="#333" strokeWidth="3" />
          <circle cx="110" cy="105" r="10" fill="#111" stroke="#333" strokeWidth="3" />
          
          {/* Exhaust Pipe */}
          <path d="M100 10 L100 -5 L115 -5" stroke="#64748b" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>

        {/* Smoke Particles from Exhaust */}
        <AnimatePresence>
          {isWorking && (
            <div className="absolute top-[-10px] right-[10px]">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`smoke-${i}`}
                  initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [0.5, 2, 3],
                    x: [0, 20 + Math.random() * 30],
                    y: [0, -40 - Math.random() * 30],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5 + Math.random(),
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                  className="absolute w-5 h-5 bg-gray-400 rounded-full blur-[4px]"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Electric Sparks */}
        <AnimatePresence>
          {isWorking && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: (Math.random() - 0.5) * 120,
                    y: (Math.random() - 0.5) * 80,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    delay: Math.random() * 1.5,
                  }}
                  className="absolute left-1/2 top-1/2 w-1.5 h-4 bg-yellow-300 rotate-45 blur-[1px] shadow-[0_0_12px_#fde047]"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Realistic Shadow */}
      <div className="relative mt-3">
        <motion.div 
          animate={{ scale: isWorking ? [1, 1.02, 1] : 1, opacity: isWorking ? [0.5, 0.6, 0.5] : 0.4 }}
          transition={{ repeat: Infinity, duration: 0.1 }}
          className="w-[140px] h-[10px] bg-black rounded-[100%] blur-md" 
        />
      </div>
    </div>
  );
}
