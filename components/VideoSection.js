'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BsVolumeUpFill, BsVolumeMuteFill, BsLightningChargeFill } from 'react-icons/bs';

export default function VideoSection() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="max-w-[92vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-[1px] bg-accent" />
              <span className="text-accent font-inter text-xs font-bold uppercase tracking-[0.2em]">Experience Excellence</span>
            </div>
            <h2 className="font-poppins font-black text-[clamp(2rem,3.5vw,3.5rem)] text-white leading-[1.1] mb-6">
              See Our Power <br />
              <span className="text-accent">Solutions in Action</span>
            </h2>
            <p className="text-text-secondary font-inter text-[clamp(1rem,1.1vw,1.2rem)] leading-relaxed mb-8 max-w-xl">
              From mega events to industrial complexes, witness how Ajay Generators provides 
              uninterrupted power with our state-of-the-art rental fleet and 24/7 technical support.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Reliability', value: '100%' },
                { label: 'Uptime', value: '24/7' }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-accent font-poppins font-black text-2xl">{stat.value}</p>
                  <p className="text-text-muted text-xs uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Video Player */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <video 
                ref={videoRef}
                autoPlay 
                muted={isMuted}
                loop 
                playsInline 
                preload="metadata"
                suppressHydrationWarning
                className="w-full h-full object-cover"
              >
                <source src="/videos/services.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Sound Toggle Button */}
              <button 
                onClick={toggleMute}
                suppressHydrationWarning
                className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent/80 transition-all duration-300 z-10"
              >
                {isMuted ? <BsVolumeMuteFill className="text-xl" /> : <BsVolumeUpFill className="text-xl" />}
              </button>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-[0.65rem] font-bold uppercase tracking-widest">On-Site Demonstration</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
