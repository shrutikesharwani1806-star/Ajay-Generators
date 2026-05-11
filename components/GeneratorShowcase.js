'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { BsArrowRight, BsStarFill, BsLightningChargeFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import API from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import { useAuth } from '@/context/AuthContext';

const Card3D = ({ gen, i, inView, onBook }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 0, rotateY: 0 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative group perspective-1000"
    >
      <div 
        style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}
        className="relative bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-[0_20px_80px_rgba(212,132,28,0.25)]"
      >
        {/* Holographic Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1),transparent_40%)]" 
             style={{ '--mouse-x': `${x.get() * 100 + 50}%`, '--mouse-y': `${y.get() * 100 + 50}%` }} />

        {/* Top Section - Image with Ticket Notch */}
        <div className="relative h-[clamp(9rem,14vh,11rem)] overflow-hidden">
          <Image 
            src={gen.images?.[0]?.url || '/images/gen-placeholder.jpg'} 
            alt={gen.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
          
          {/* Capacity Badge */}
          <div className="absolute top-4 left-4 z-10" style={{ transform: 'translateZ(40px)' }}>
            <div className="bg-accent px-3 py-1 rounded-full text-[0.65rem] font-black text-white shadow-xl flex items-center gap-1.5 uppercase tracking-tighter">
              <BsLightningChargeFill className="text-[0.7rem]" />
              {gen.capacity}
            </div>
          </div>
        </div>

        {/* Content Section with Ticket Notches */}
        <div className="relative p-6 text-center" style={{ transform: 'translateZ(40px)' }}>
          {/* Side Notches */}
          <div className="absolute left-[-15px] top-[15%] w-8 h-8 bg-primary rounded-full border border-white/5 shadow-inner" />
          <div className="absolute right-[-15px] top-[15%] w-8 h-8 bg-primary rounded-full border border-white/5 shadow-inner" />

          <h3 className="font-poppins font-black text-white text-[clamp(1rem,1.2vw,1.4rem)] mb-1 uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
            {gen.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 mb-5 opacity-80">
            {[...Array(5)].map((_, i) => (
              <BsStarFill key={i} className={`text-[0.65rem] ${i < Math.floor(gen.rating || 4) ? 'text-accent' : 'text-white/20'}`} />
            ))}
            <span className="text-text-muted text-[0.7rem] font-bold ml-1">{gen.rating || 4.5}</span>
          </div>
          
          {/* Pricing Info */}
          <div className="flex flex-col gap-5 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-accent/5 group-hover:border-accent/10 transition-all duration-300">
            <div className="flex justify-between items-center px-1">
              <div className="text-left">
                <p className="text-[0.55rem] uppercase font-bold text-text-muted tracking-widest opacity-60 mb-1">Standard Rate</p>
                <p className="text-white font-poppins font-extrabold text-[0.9rem]">₹{gen.pricing?.daily?.toLocaleString()}</p>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-right">
                <p className="text-[0.55rem] uppercase font-bold text-accent tracking-widest mb-1">Monthly Plan</p>
                <p className="text-accent font-poppins font-black text-[1.1rem]">₹{gen.pricing?.monthly?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onBook}
            className="mt-6 w-full group/btn relative flex items-center justify-center gap-3 font-inter font-black text-[0.7rem] text-white bg-accent py-3.5 rounded-xl hover:bg-accent-dark transition-all duration-500 uppercase tracking-[0.2em] overflow-hidden"
          >
            <span className="relative z-10">Secure Booking</span>
            <BsArrowRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </div>

        {/* Premium Badge Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Floating Particle Glow */}
      <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-[40px] opacity-0 group-hover:opacity-60 transition duration-700 -z-10" />
    </motion.div>
  );
};

export default function GeneratorShowcase() {
  const [generators, setGenerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGen, setSelectedGen] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleBookClick = (gen) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedGen(gen);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchGens = async () => {
      try {
        const { data } = await API.get('/generators');
        if (data.generators?.length > 0) {
          setGenerators(data.generators.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch generators:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGens();
  }, []);

  return (
    <section id="pricing" className="relative py-[clamp(5rem,10vh,8rem)] bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,132,28,0.08),transparent_70%)]" />
      
      <div className="relative max-w-[92vw] mx-auto">
        <motion.div 
          ref={ref} 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-[clamp(3rem,6vh,5rem)]"
        >
          <div className="flex items-center justify-center gap-[0.5vw] mb-[1.5vh]">
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
            <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">Premium Fleet</span>
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
          </div>
          <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white">
            Exclusive <span className="text-accent">Power Bookings</span>
          </h2>
          <p className="font-inter text-[clamp(0.85rem,0.95vw,1rem)] text-text-muted mt-[1vh] max-w-[50vw] mx-auto min-w-[280px]">
            High-performance generators from 30KV to 35KV, optimized for reliability and efficiency.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
        ) : generators.length > 0 ? (
          <motion.div 
            animate={isBooking ? { rotateY: 90, scale: 0.8, opacity: 0 } : { rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,2.5vw,2.5rem)]" 
            style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
          >
            {generators.map((gen, i) => (
              <Card3D key={gen._id} gen={gen} i={i} inView={inView} onBook={() => handleBookClick(gen)} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-card/50 border border-border border-dashed rounded-2xl">
            <BsLightningChargeFill className="text-accent/20 text-5xl mx-auto mb-4" />
            <p className="text-white font-poppins font-semibold text-lg">No Generators Found</p>
            <p className="text-text-muted font-inter text-sm mt-2">
              Please ensure your MongoDB is running and run <code className="bg-primary px-2 py-1 rounded text-accent">npm run seed</code> in the backend folder.
            </p>
          </div>
        )}

        {/* Booking Modal */}
        {selectedGen && (
          <BookingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            generator={selectedGen}
            user={user}
          />
        )}

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={inView ? { opacity: 1 } : {}} 
          transition={{ delay: 0.6 }} 
          className="text-center mt-[clamp(3rem,6vh,5rem)]"
        >
          <Link href="/generators" className="group inline-flex items-center gap-2 font-inter font-semibold text-[clamp(0.9rem,1vw,1.05rem)] text-white bg-card border border-border px-[clamp(2rem,2.5vw,3rem)] py-[clamp(0.7rem,1vh,0.9rem)] rounded-md hover:border-accent/50 hover:text-accent transition-all duration-300">
            View All Capacity Units <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
