'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { BsCheckCircleFill, BsLightningChargeFill } from 'react-icons/bs';
import { FaTruck, FaTools, FaShieldAlt, FaClock } from 'react-icons/fa';

const features = [
  { icon: FaTruck, text: 'Fast Delivery' },
  { icon: FaTools, text: 'Expert Operators' },
  { icon: FaShieldAlt, text: 'Insured Equipment' },
  { icon: FaClock, text: '24/7 Availability' },
];

const checkItems = [
  'Premium Diesel Generators',
  'From 30KV to 250KV capacity',
  'Trained & experienced operators',
  'Same-day emergency delivery',
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-[clamp(5rem,10vh,8rem)] bg-primary overflow-hidden">
      <div className="max-w-[92vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,5vw,6rem)] items-center">
          {/* Left - Image with floating stats card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/about-gen.png"
                alt="About Ajay Generators"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-[3vh] -right-[2vw] lg:right-[-3vw] bg-secondary/90 backdrop-blur-xl border border-border rounded-xl p-[clamp(1.2rem,1.8vw,2rem)] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-[clamp(0.8rem,1.2vw,1.5rem)]">
                <div className="w-[clamp(3.5rem,4.5vw,5rem)] h-[clamp(3.5rem,4.5vw,5rem)] bg-accent rounded-lg flex items-center justify-center">
                  <span className="font-poppins font-extrabold text-[clamp(1.5rem,2vw,2.2rem)] text-white">5<span className="text-[0.6em]">+</span></span>
                </div>
                <div>
                  <p className="font-poppins font-bold text-[clamp(0.9rem,1vw,1.1rem)] text-white">Years of</p>
                  <p className="font-inter text-[clamp(0.75rem,0.85vw,0.9rem)] text-text-muted">Experience</p>
                </div>
              </div>
            </motion.div>

            {/* Orange accent line */}
            <div className="absolute top-[5%] -left-[1vw] w-[4px] h-[40%] bg-accent rounded-full" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-[0.5vw] mb-[1.5vh]">
              <BsLightningChargeFill className="text-accent text-[clamp(0.7rem,0.8vw,0.85rem)]" />
              <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">
                About the Company
              </span>
            </div>

            <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,2.8vw,3rem)] text-white leading-[1.12] mb-[2vh]">
              Premium Generator Rental <span className="text-accent">Provider Since 2019</span>
            </h2>

            <p className="font-inter text-[clamp(0.85rem,0.95vw,1rem)] text-text-secondary leading-[1.7] mb-[3vh]">
              Starting as Ajay Tent House in Burhar, we expanded into Ajay Generators — now the most trusted generator rental service in Madhya Pradesh. From small events to massive industrial sites, we deliver reliable power solutions with unmatched expertise and commitment.
            </p>

            {/* Check items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.6rem,1vh,1rem)] mb-[3vh]">
              {checkItems.map((item) => (
                <div key={item} className="flex items-center gap-[0.5vw]">
                  <BsCheckCircleFill className="text-accent text-[clamp(0.8rem,0.9vw,1rem)] shrink-0" />
                  <span className="font-inter text-[clamp(0.8rem,0.9vw,0.95rem)] text-text-secondary">{item}</span>
                </div>
              ))}
            </div>

            {/* Feature icons row */}
            <div className="flex flex-wrap gap-[clamp(0.5rem,1vw,1rem)]">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-[0.4vw] bg-secondary border border-border rounded-lg px-[clamp(0.8rem,1.2vw,1.2rem)] py-[clamp(0.4rem,0.6vh,0.6rem)]">
                  <f.icon className="text-accent text-[clamp(0.8rem,0.9vw,1rem)]" />
                  <span className="font-inter text-[clamp(0.7rem,0.78vw,0.82rem)] text-text-secondary font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
