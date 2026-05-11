'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { handleCall } from '@/lib/utils';
import { BsArrowRight, BsTelephoneFill } from 'react-icons/bs';

export default function SupportBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const phoneNumber = '+91 91651 46680';

  return (
    <section className="relative py-[clamp(5rem,12vh,8rem)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/support-banner.png"
          alt="24/7 Generator Support"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[92vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,5vw,5rem)] items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-[clamp(320px,50vw,650px)]"
          >
            <div className="flex items-center gap-[0.5vw] mb-[1.5vh]">
              <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
              <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">
                Booking Appointment
              </span>
            </div>

            <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.5rem)] text-white leading-[1.12] mb-[2vh]">
              24/7 customer support any time{' '}
              <span className="text-accent">of the day or night</span>
            </h2>

            <p className="font-inter text-[clamp(0.85rem,0.95vw,1rem)] text-text-secondary leading-relaxed mb-[3vh]">
              Our emergency power team is always ready. Whether it&apos;s midnight or a holiday, we deliver generators within hours of your call. No event goes dark, no factory stops — we promise uninterrupted power.
            </p>

            <div className="flex flex-wrap items-center gap-[clamp(1rem,1.5vw,1.5rem)]">
              <Link
                href="/generators"
                className="group inline-flex items-center gap-[0.5vw] font-inter font-semibold text-[clamp(0.85rem,0.95vw,1rem)] text-white bg-accent px-[clamp(1.5rem,2vw,2.5rem)] py-[clamp(0.7rem,1vh,0.9rem)] rounded-md hover:bg-accent-dark hover:shadow-[0_0_30px_rgba(255,140,50,0.4)] transition-all duration-300"
              >
                Book Now <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCall(phoneNumber);
                }}
                suppressHydrationWarning
                className="inline-flex items-center gap-[0.5vw] font-inter font-medium text-[clamp(0.85rem,0.95vw,1rem)] text-white cursor-pointer"
              >
                <div className="w-[clamp(2.5rem,3vw,3rem)] h-[clamp(2.5rem,3vw,3rem)] bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center">
                  <BsTelephoneFill className="text-accent text-[clamp(0.8rem,0.9vw,1rem)]" />
                </div>
                <div>
                  <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] text-text-muted">Call us anytime</p>
                  <p className="font-semibold text-[clamp(0.9rem,1vw,1.1rem)]">{phoneNumber}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Side Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square max-w-[450px] ml-auto border border-white/10 shadow-2xl">
              <Image 
                src="/images/support-banner.png" 
                alt="Expert Operator" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
