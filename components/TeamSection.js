'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const team = [
  {
    name: 'Ajay Kumar Kesharwani',
    role: 'Founder & Director',
    image: '/images/ajay_image.jpg',
    instagram: 'https://www.instagram.com/ajay_kesharwani_86?igsh=MTV6dXloYjB2eTRjeQ==',
  },
  {
    name: 'Prateek Kesharwani',
    role: 'Operations Head',
    image: '/images/prateek.jpg',
    instagram: 'https://www.instagram.com/ajay_kesharwani_86?igsh=MTV6dXloYjB2eTRjeQ==',
  },
];

export default function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-[clamp(5rem,10vh,8rem)] bg-primary overflow-hidden">
      <div className="max-w-[92vw] mx-auto">
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
              Our Expert Team
            </span>
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
          </div>
          <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white">
            Meet The <span className="text-accent">Executive Panel</span>
          </h2>
        </motion.div>

        {/* Team Grid - Centered for 2 people */}
        <div className="flex flex-wrap justify-center gap-[clamp(2rem,5vw,5rem)]">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group text-center"
            >
              {/* Circular Image */}
              <div className="relative mx-auto w-[clamp(8rem,12vw,14rem)] h-[clamp(8rem,12vw,14rem)] mb-[2vh]">
                <div className="absolute inset-0 rounded-full border-2 border-border group-hover:border-accent transition-colors duration-500" />
                <div className="absolute inset-[4px] rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Orange accent arc */}
                <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-[60%] h-[4px] bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <h3 className="font-poppins font-bold text-[clamp(0.95rem,1.1vw,1.2rem)] text-white mb-[0.3vh]">
                {member.name}
              </h3>
              <p className="font-inter text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent mb-[1.5vh]">
                {member.role}
              </p>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-[clamp(0.3rem,0.5vw,0.5rem)]">
                {[
                  { Icon: FaFacebook, href: '#' },
                  { Icon: FaTwitter, href: '#' },
                  { Icon: FaLinkedin, href: '#' },
                  { Icon: FaInstagram, href: member.instagram },
                ].map(({ Icon, href }, si) => (
                  <a
                    key={si}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[clamp(1.8rem,2.2vw,2.5rem)] h-[clamp(1.8rem,2.2vw,2.5rem)] bg-secondary border border-border rounded-md flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 text-[clamp(0.7rem,0.8vw,0.85rem)]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
