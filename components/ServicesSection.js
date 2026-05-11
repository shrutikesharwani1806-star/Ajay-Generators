'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { BsArrowRight, BsLightningChargeFill } from 'react-icons/bs';
import { FaIndustry, FaHardHat, FaHeart, FaHospital, FaBolt, FaVolumeDown } from 'react-icons/fa';

const services = [
  {
    icon: FaIndustry,
    title: 'Industrial Generator Rental',
    description: 'Heavy-duty generators for factories, manufacturing plants, and industrial operations requiring 24/7 continuous power.',
    image: '/images/industry_generator.jpg',
  },
  {
    icon: FaHeart,
    title: 'Wedding & Event Power',
    description: 'Silent generators ensuring uninterrupted power for lights, sound, catering, and decorations at your celebrations.',
    image: '/images/party_lawn_generator.jpg',
  },
  {
    icon: FaHardHat,
    title: 'Construction Site Generators',
    description: 'Rugged, reliable generators for construction projects — powering tools, machinery, and site offices.',
    image: '/images/cunstruction_site_generator.jpg',
  },
  {
    icon: FaHospital,
    title: 'Emergency Power Backup',
    description: 'Rapid-response emergency generators for hospitals, data centers, and critical facilities when every second counts.',
    image: '/images/generator-transport.png',
  },
  {
    icon: FaVolumeDown,
    title: 'Silent Generator Rental',
    description: 'Acoustic-enclosed generators for noise-sensitive environments — offices, hotels, and residential areas.',
    image: '/images/hotel_room_generator.jpg',
  },
  {
    icon: FaBolt,
    title: 'Commercial Power Solutions',
    description: 'Scalable power solutions for commercial establishments, malls, offices, and corporate events.',
    image: '/images/support-banner.png',
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" className="relative py-[clamp(5rem,10vh,8rem)] bg-secondary overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,140,50,0.03),transparent_50%)]" />

      <div className="relative max-w-[92vw] mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-[clamp(3rem,6vh,5rem)]"
        >
          <div className="flex items-center justify-center gap-[0.5vw] mb-[1.5vh]">
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
            <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">
              Types of Services
            </span>
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
          </div>
          <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white">
            Popular Generator <span className="text-accent">Services</span>
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(1rem,1.5vw,1.5rem)]">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-border-accent hover:shadow-[0_0_30px_rgba(255,140,50,0.08)] transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-[clamp(10rem,15vh,14rem)] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                {/* Icon badge */}
                <div className="absolute bottom-[-1rem] left-[clamp(1rem,1.5vw,1.5rem)] w-[clamp(3rem,3.5vw,3.5rem)] h-[clamp(3rem,3.5vw,3.5rem)] bg-accent rounded-lg flex items-center justify-center shadow-[0_4px_15px_rgba(255,140,50,0.4)] z-10">
                  <service.icon className="text-white text-[clamp(1.2rem,1.4vw,1.5rem)]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-[clamp(1.2rem,1.5vw,1.5rem)] pt-[clamp(1.5rem,2vw,2rem)]">
                <h3 className="font-poppins font-bold text-[clamp(1rem,1.15vw,1.2rem)] text-white mb-[1vh] group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-inter text-[clamp(0.78rem,0.85vw,0.9rem)] text-text-muted leading-relaxed mb-[1.5vh]">
                  {service.description}
                </p>
                <button suppressHydrationWarning className="inline-flex items-center gap-1 font-inter font-medium text-[clamp(0.75rem,0.82vw,0.85rem)] text-accent hover:text-white transition-colors group/btn">
                  Learn More <BsArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
