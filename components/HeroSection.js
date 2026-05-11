'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BsArrowRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { FaBolt } from 'react-icons/fa';

const slides = [
  {
    image: '/images/hero-bg.png',
    label: 'Industrial Power Solutions',
    heading: 'Reliable Generator Rental Solutions',
    description: 'Premium diesel generator rental for weddings, industries, construction sites, hospitals, and commercial projects across Madhya Pradesh.',
  },
  {
    image: '/images/cunstruction_site_generator.jpg',
    label: 'Construction & Industrial',
    heading: 'Powering Your Biggest Projects',
    description: 'Heavy-duty 35KV generators for construction sites, factories, and industrial operations with 24/7 operator support.',
  },
  {
    image: '/images/party_lawn_generator.jpg',
    label: 'Events & Celebrations',
    heading: 'Uninterrupted Power for Every Event',
    description: 'Make your weddings and events unforgettable with our 35KV silent, reliable generator power backup solutions.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].heading}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[92vw] mx-auto w-full">
          <div className="max-w-[clamp(320px,45vw,700px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { 
                      staggerChildren: 0.15,
                      delayChildren: 0.2
                    }
                  },
                  exit: { 
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }
                }}
              >
                {/* Label */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-center gap-[0.5vw] mb-[2vh]"
                >
                  <div className="w-[clamp(1.8rem,2vw,2.2rem)] h-[2px] bg-accent" />
                  <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">
                    {slides[current].label}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="font-poppins font-extrabold text-[clamp(2.2rem,4vw,4.2rem)] text-white leading-[1.08] mb-[2.5vh]"
                >
                  {slides[current].heading.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Description */}
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="font-inter text-[clamp(0.85rem,1vw,1.1rem)] text-text-secondary leading-relaxed mb-[4vh] max-w-[clamp(280px,35vw,550px)]"
                >
                  {slides[current].description}
                </motion.p>

                {/* Buttons */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-wrap items-center gap-[clamp(0.8rem,1.2vw,1.5rem)]"
                >
                  <Link
                    href="/generators"
                    className="group btn-premium animate-shine inline-flex items-center gap-[0.5vw] font-inter font-semibold text-[clamp(0.85rem,0.95vw,1rem)] text-white bg-accent px-[clamp(1.5rem,2vw,2.5rem)] py-[clamp(0.7rem,1vh,0.9rem)] rounded-md hover:bg-accent-dark hover:shadow-[0_0_30px_rgba(255,140,50,0.4)] transition-all duration-300"
                  >
                    Get Quote
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/generators"
                    className="group inline-flex items-center gap-[0.5vw] font-inter font-semibold text-[clamp(0.85rem,0.95vw,1rem)] text-white border-2 border-white/20 px-[clamp(1.5rem,2vw,2.5rem)] py-[clamp(0.65rem,0.95vh,0.85rem)] rounded-md hover:border-accent/50 hover:bg-white/5 transition-all duration-300"
                  >
                    Explore Generators
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carousel Arrows - Matching reference */}
      <div className="absolute bottom-[6vh] right-[4vw] z-20 flex items-center gap-[clamp(0.5rem,0.8vw,1rem)]">
        <button
          onClick={prev}
          suppressHydrationWarning
          className="w-[clamp(3rem,3.5vw,3.5rem)] h-[clamp(3rem,3.5vw,3.5rem)] bg-accent/20 backdrop-blur-md border border-accent/30 rounded-md flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all duration-300 group"
        >
          <BsChevronLeft className="text-[clamp(1rem,1.2vw,1.3rem)] group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={next}
          suppressHydrationWarning
          className="w-[clamp(3rem,3.5vw,3.5rem)] h-[clamp(3rem,3.5vw,3.5rem)] bg-accent border border-accent rounded-md flex items-center justify-center text-white hover:bg-accent-dark transition-all duration-300 group"
        >
          <BsChevronRight className="text-[clamp(1rem,1.2vw,1.3rem)] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-[6vh] left-[4vw] z-20 flex items-center gap-[0.5vw]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            suppressHydrationWarning
            className={`h-[3px] rounded-full transition-all duration-500 ${
              i === current ? 'w-[clamp(2rem,3vw,3rem)] bg-accent' : 'w-[clamp(1rem,1.5vw,1.5rem)] bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[15vh] bg-gradient-to-t from-primary to-transparent" />
    </section>
  );
}
