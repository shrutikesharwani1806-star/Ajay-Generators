'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function LampAnimation({ isLit, isTyping }) {
  // Rainbow glow colors
  const glowColors = ['#D4841C', '#FF4D4D', '#4DFF4D', '#4D4DFF', '#D4841C'];

  return (
    <div className="relative w-[200px] h-[250px] flex flex-col items-center justify-end">
      {/* SVG Definitions for realistic effects */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="lampBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3A3A3A' }} />
            <stop offset="50%" style={{ stopColor: '#1A1A1A' }} />
            <stop offset="100%" style={{ stopColor: '#000000' }} />
          </linearGradient>
          <radialGradient id="glassGrad" cx="30%" cy="30%" r="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
          </radialGradient>
        </defs>
      </svg>

      {/* The Character */}
      <motion.div
        animate={{ 
          y: isTyping ? [0, -4, 0] : [0, -2, 0],
          rotate: isLit ? [0, -0.5, 0.5, 0] : 0
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* Realistic Person Shadow/Body */}
        <svg width="140" height="160" viewBox="0 0 100 120" fill="none">
          {/* Suit/Uniform */}
          <path d="M25 110C25 85 35 75 50 75C65 75 75 85 75 110" fill="url(#lampBodyGrad)" stroke="#2A2A2A" strokeWidth="1" />
          <path d="M45 75V90M55 75V90" stroke="#D4841C" strokeWidth="1" opacity="0.3" />
          
          {/* Head with skin tone and details */}
          <circle cx="50" cy="45" r="28" fill="#1A222D" stroke="#D4841C" strokeWidth="2.5" />
          
          {/* Eyes - Realistic blinking */}
          <motion.g animate={{ x: isTyping ? [-1, 1, -1] : 0 }}>
            <motion.circle 
              animate={{ scaleY: isLit ? [1, 0.1, 1] : 0.1 }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 1] }}
              cx="40" cy="42" r="4" fill="#D4841C" filter="url(#glow)"
            />
            <motion.circle 
              animate={{ scaleY: isLit ? [1, 0.1, 1] : 0.1 }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 1] }}
              cx="60" cy="42" r="4" fill="#D4841C" filter="url(#glow)"
            />
          </motion.g>

          {/* Smile - Colorful glow */}
          <motion.path 
            animate={{ 
              d: isLit ? "M35 60C40 72 60 72 65 60" : "M40 65C45 66 55 66 60 65",
              stroke: isLit ? glowColors : '#4B5B6D'
            }}
            transition={{ stroke: { repeat: Infinity, duration: 3 } }}
            strokeWidth="3" strokeLinecap="round" 
          />

          {/* Detailed Hat */}
          <path d="M22 38C22 30 35 22 50 22C65 22 78 30 78 38L85 45H15L22 38Z" fill="#D4841C" />
          <rect x="42" y="15" width="16" height="8" rx="2" fill="#D4841C" />
          <path d="M50 15V10" stroke="#D4841C" strokeWidth="2" strokeLinecap="round" />

          {/* Realistic Arm */}
          <motion.path
            animate={{ 
              rotate: isLit ? [-8, -10, -8] : 0,
              y: isLit ? -1 : 0
            }}
            style={{ originX: '75px', originY: '75px' }}
            d="M75 75C88 75 95 65 98 50"
            stroke="url(#lampBodyGrad)" strokeWidth="7" strokeLinecap="round"
          />
        </svg>

        {/* The Realistic Colorful Lamp */}
        <motion.div
          style={{ position: 'absolute', right: '-15px', top: '25px' }}
          animate={{ 
            y: isLit ? [0, -4, 0] : 0,
            rotate: isLit ? [0, 3, -3, 0] : 0
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="relative group">
            {/* Lamp Structure */}
            <div className="w-12 h-16 bg-[#222] rounded-lg border-[3px] border-[#444] relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* Internal Flame/LED */}
              <AnimatePresence>
                {isLit && (
                  <>
                    <motion.div
                      animate={{ 
                        backgroundColor: glowColors,
                        scale: [1, 1.2, 1],
                        filter: ['blur(4px)', 'blur(2px)', 'blur(4px)']
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute inset-2 rounded-md shadow-[0_0_20px_currentColor]"
                    />
                    {/* Realistic Flicker Overlay */}
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.1 }}
                      className="absolute inset-0 bg-white/10 pointer-events-none"
                    />
                  </>
                )}
              </AnimatePresence>
              
              {/* Glass Reflection Layer */}
              <div className="absolute inset-0 bg-[url(#glassGrad)] opacity-50" />
              <div className="absolute top-2 left-2 w-1.5 h-10 bg-white/20 rounded-full blur-[1px] rotate-10" />
            </div>

            {/* Brass Fittings */}
            <div className="absolute -top-1 left-0 right-0 h-3 bg-gradient-to-b from-[#B8860B] to-[#D4841C] rounded-t-md border-x border-t border-[#444]" />
            <div className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-t from-[#B8860B] to-[#D4841C] rounded-b-md border-x border-b border-[#444]" />
            
            {/* Handle */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 border-[3px] border-[#D4841C] rounded-full" />

            {/* MAGICAL COLORFUL GLOW */}
            <AnimatePresence>
              {isLit && (
                <>
                  {/* Dynamic Color Aura */}
                  <motion.div
                    animate={{ 
                      backgroundColor: glowColors,
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] -z-10"
                  />
                  
                  {/* Rotating Color Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 -z-10"
                  >
                    {[0, 90, 180, 270].map(deg => (
                      <div 
                        key={deg}
                        style={{ 
                          transform: `rotate(${deg}deg) translateY(-100px)`,
                          backgroundColor: glowColors[deg/90]
                        }}
                        className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full blur-3xl opacity-20"
                      />
                    ))}
                  </motion.div>

                  {/* Sparkles/Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 5)],
                        y: [0, - (40 + i * 5)],
                        backgroundColor: glowColors[i % 5]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full blur-[1px] shadow-lg"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Realistic Shadow with light reflection */}
      <div className="relative">
        <motion.div 
          animate={{ scale: isLit ? 1.3 : 1, opacity: isLit ? 0.4 : 0.2 }}
          className="w-32 h-4 bg-black rounded-[100%] blur-md" 
        />
        <AnimatePresence>
          {isLit && (
            <motion.div
              animate={{ backgroundColor: glowColors }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 w-32 h-4 rounded-[100%] blur-xl opacity-30"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
