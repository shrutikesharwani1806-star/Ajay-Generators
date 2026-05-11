'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsVolumeUpFill, BsVolumeMuteFill } from 'react-icons/bs';

export default function SoundControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleSound = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73456.mp3?filename=ambient-corporate-11440.mp3"
      />
      
      <motion.button
        onClick={toggleSound}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '12vh',
          right: '3vw',
          zIndex: 51,
          width: 'clamp(2.5rem, 3.5vw, 3.5rem)',
          height: 'clamp(2.5rem, 3.5vw, 3.5rem)',
          background: isPlaying ? '#D4841C' : 'rgba(13,27,42,0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isPlaying 
            ? '0 0 20px rgba(212,132,28,0.4)' 
            : '0 0 20px rgba(0,0,0,0.3)',
          transition: 'background 0.3s',
        }}
        title={isPlaying ? 'Mute Music' : 'Play Music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="volume-up"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <BsVolumeUpFill style={{ color: '#fff', fontSize: '1.2rem' }} />
            </motion.div>
          ) : (
            <motion.div
              key="volume-mute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <BsVolumeMuteFill style={{ color: '#AAB5C3', fontSize: '1.2rem' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Ring when playing */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #D4841C',
            }}
          />
        )}
      </motion.button>
    </>
  );
}
