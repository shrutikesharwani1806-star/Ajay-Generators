'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { BsArrowRight, BsCalendarFill } from 'react-icons/bs';

const posts = [
  {
    title: 'How to Choose the Right Generator for Your Wedding',
    excerpt: 'A comprehensive guide to selecting the perfect generator capacity for your wedding venue...',
    date: 'May 1, 2026',
    category: 'Tips',
    image: '/images/wedding-gen.png',
  },
  {
    title: 'Industrial Generator Maintenance: Best Practices',
    excerpt: 'Keep your rented generator running at peak efficiency with these maintenance tips...',
    date: 'Apr 28, 2026',
    category: 'Industrial',
    image: '/images/hero-bg.png',
  },
  {
    title: 'Emergency Power Planning for Hospitals',
    excerpt: 'Why every hospital needs a reliable generator backup plan and how we can help...',
    date: 'Apr 22, 2026',
    category: 'Emergency',
    image: '/images/generator-transport.png',
  },
];

export default function BlogSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-[clamp(5rem,10vh,8rem)] bg-secondary overflow-hidden">
      <div className="max-w-[92vw] mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-[clamp(3rem,6vh,5rem)]">
          <div className="flex items-center justify-center gap-[0.5vw] mb-[1.5vh]">
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
            <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">Latest News</span>
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
          </div>
          <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white">
            Recent News & <span className="text-accent">Best Blog</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,1.5vw,1.5rem)]">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-border-accent transition-all duration-500"
            >
              <div className="relative h-[clamp(10rem,14vh,13rem)] overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-3 left-3 bg-accent rounded-md px-2 py-[0.15rem]">
                  <span className="font-inter font-semibold text-[clamp(0.6rem,0.68vw,0.72rem)] text-white">{post.category}</span>
                </div>
              </div>
              <div className="p-[clamp(1.2rem,1.5vw,1.5rem)]">
                <div className="flex items-center gap-1 text-text-muted mb-[1vh]">
                  <BsCalendarFill className="text-accent text-[clamp(0.6rem,0.65vw,0.7rem)]" />
                  <span className="font-inter text-[clamp(0.68rem,0.72vw,0.78rem)]">{post.date}</span>
                </div>
                <h3 className="font-poppins font-bold text-[clamp(0.95rem,1.08vw,1.15rem)] text-white mb-[1vh] group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                <p className="font-inter text-[clamp(0.78rem,0.85vw,0.9rem)] text-text-muted leading-relaxed mb-[1.5vh] line-clamp-2">{post.excerpt}</p>
                <button suppressHydrationWarning className="inline-flex items-center gap-1 font-inter font-medium text-[clamp(0.75rem,0.82vw,0.85rem)] text-accent hover:text-white transition-colors group/btn">
                  Read More <BsArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
