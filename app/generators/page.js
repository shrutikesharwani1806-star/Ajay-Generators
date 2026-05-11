'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BsLightningChargeFill, BsArrowRight, BsStarFill, BsSearch, BsFunnel } from 'react-icons/bs';
import { FaGasPump } from 'react-icons/fa';
import API from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import { useAuth } from '@/context/AuthContext';

const capacities = ['All', '30KV', '35KV'];

const GeneratorCard = ({ gen, i, onBook }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group bg-[#0A111B] backdrop-blur-xl border-2 border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent/40 shadow-2xl hover:shadow-[0_30px_60px_rgba(212,132,28,0.25)] transition-all duration-500"
    >
      <div className="relative aspect-[16/11] bg-gradient-to-br from-secondary to-[#0F172A] overflow-hidden" style={{ transform: 'translateZ(30px)' }}>
        <Image
          src={gen.images?.[0]?.url || '/images/gen-placeholder.jpg'}
          alt={gen.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A111B] via-transparent to-transparent opacity-80" />
        <div className="absolute top-6 left-6 bg-accent rounded-2xl px-5 py-2 shadow-2xl">
          <span className="font-poppins font-black text-[clamp(0.8rem,0.9vw,1rem)] text-white tracking-widest">{gen.capacity}</span>
        </div>
      </div>
      <div className="p-[clamp(1.5rem,2.5vw,2.5rem)] relative" style={{ transform: 'translateZ(60px)' }}>
        <div className="absolute -top-12 left-0 right-0 h-24 bg-gradient-to-t from-[#0A111B] to-transparent pointer-events-none" />
        <h3 className="font-poppins font-black text-[clamp(1.2rem,1.8vw,2rem)] text-white mb-3 leading-tight uppercase tracking-tight group-hover:text-accent transition-colors">{gen.name}</h3>
        <p className="font-inter text-[clamp(0.85rem,1vw,1.1rem)] text-text-muted mb-6 line-clamp-2 font-medium opacity-70 leading-relaxed">{gen.description || gen.shortDescription}</p>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
            <BsLightningChargeFill className="text-xl text-accent animate-pulse" />
            <span className="font-inter font-black text-sm text-white tracking-wide">{gen.powerOutput}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <BsStarFill key={i} className={`text-[0.6rem] ${i < Math.floor(gen.rating) ? 'text-accent' : 'text-white/10'}`} />
              ))}
            </div>
            <span className="font-inter font-black text-xs text-white/50">{gen.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="space-y-1">
            <span className="font-inter text-[0.7rem] text-accent font-black uppercase tracking-[0.2em]">Monthly Deal</span>
            <p className="font-poppins font-black text-[clamp(1.8rem,2.2vw,2.5rem)] text-white leading-none">
              ₹{(gen.pricing?.monthly / 1000).toFixed(0)}K<span className="text-[0.4em] text-accent ml-1 font-black">/MO</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onBook(gen)}
              className="w-full bg-accent text-white px-8 py-3.5 rounded-2xl font-poppins font-black text-[0.8rem] uppercase tracking-widest hover:bg-white hover:text-accent transition-all duration-300 shadow-[0_10px_25px_rgba(212,132,28,0.3)] active:scale-95"
            >
              Book Now
            </button>
            <Link href={`/generators/${gen._id}`} className="text-center font-inter text-[0.7rem] text-text-muted hover:text-white uppercase font-black tracking-widest transition-colors flex items-center justify-center gap-2 group/link">
              Full Specs <BsArrowRight className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function GeneratorsPage() {
  const [generators, setGenerators] = useState([]);
  const [filteredGens, setFilteredGens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGen, setSelectedGen] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const handleBook = (gen) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedGen(gen);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchGenerators();
  }, []);

  const fetchGenerators = async () => {
    try {
      const { data } = await API.get('/generators');
      setGenerators(data.generators || []);
      setFilteredGens(data.generators || []);
    } catch (err) {
      console.error('Failed to fetch generators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...generators];
    if (selectedCapacity !== 'All') result = result.filter((g) => g.capacity === selectedCapacity);
    if (search) result = result.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredGens(result);
  }, [selectedCapacity, search, generators]);

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-primary pt-[12vh]">
      <div className="max-w-[90vw] mx-auto">
        {/* Header */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-[clamp(2rem,4vh,3rem)]">
          <span className="font-inter text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.2em] font-medium">Our Fleet</span>
          <h1 className="font-poppins font-extrabold text-[clamp(2rem,3.5vw,3.5rem)] text-white mt-[1vh]">
            Generator <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Collection</span>
          </h1>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-[clamp(1rem,2vw,1.5rem)] mb-[clamp(2rem,4vh,3rem)]">
          {/* Search */}
          <div className="relative flex-1">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search generators..."
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-[clamp(0.7rem,1vh,1rem)] text-white font-inter text-[clamp(0.85rem,0.95vw,1rem)] focus:outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted"
            />
          </div>
          {/* Capacity Filter */}
          <div className="flex flex-wrap gap-2">
            {capacities.map((c) => (
              <button key={c} onClick={() => setSelectedCapacity(c)} className={`font-inter text-[clamp(0.75rem,0.85vw,0.9rem)] px-[clamp(1rem,1.2vw,1.5rem)] py-[clamp(0.4rem,0.6vh,0.6rem)] rounded-md border transition-all duration-300 ${selectedCapacity === c ? 'bg-accent text-navy border-accent font-semibold' : 'border-white/10 text-text-secondary hover:border-accent/30 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filteredGens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.5rem,2.5vw,2.5rem)] pb-[clamp(4rem,8vh,6rem)]" style={{ perspective: '1000px' }}>
            {filteredGens.map((gen, i) => (
              <GeneratorCard key={gen._id} gen={gen} i={i} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card/30 border border-border border-dashed rounded-3xl">
            <BsLightningChargeFill className="text-accent/20 text-6xl mx-auto mb-6" />
            <h3 className="text-white font-poppins font-bold text-2xl mb-2">Inventory Empty</h3>
            <p className="text-text-muted font-inter max-w-md mx-auto mb-8">
              We couldn't find any generators in your database. Ensure your backend is connected to MongoDB and the data is seeded.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/admin" className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
                Add Manually
              </Link>
              <button onClick={() => window.location.reload()} className="border border-border text-white px-6 py-2 rounded-lg hover:bg-white/5 transition-colors">
                Refresh Page
              </button>
            </div>
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
      </div>
    </div>
  );
}
