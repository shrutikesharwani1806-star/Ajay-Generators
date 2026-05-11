'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsLightningChargeFill, BsStarFill, BsArrowLeft } from 'react-icons/bs';
import { FaGasPump, FaCog, FaRuler, FaWeight, FaVolumeDown } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import toast from 'react-hot-toast';

const fallbackGenerators = {
  '1': { _id: '1', name: 'PowerMax 30KV Generator', capacity: '30KV', powerOutput: '30 KVA / 24 KW', fuelType: 'Diesel', fuelConsumption: '6-8 L/hr', description: 'Compact and reliable 30KV diesel generator perfect for small events, residential backup, and light commercial use.', pricing: { daily: 2000, weekly: 12000, monthly: 40000 }, rating: 4.5, availability: 'available', specifications: { engine: '4-Cylinder Diesel', alternator: 'Brushless Alternator', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '72 dB', dimensions: '1800 x 800 x 1200 mm', weight: '650 kg' }, features: ['Auto Start/Stop', 'Low Noise', 'Digital Control Panel', 'Fuel Efficient'] },
  '2': { _id: '2', name: 'IndustroPower 35KV Generator', capacity: '35KV', powerOutput: '35 KVA / 28 KW', fuelType: 'Diesel', fuelConsumption: '7-9 L/hr', description: 'Versatile 35KV diesel generator suitable for medium events and commercial applications.', pricing: { daily: 2500, weekly: 15000, monthly: 50000 }, rating: 4.6, availability: 'available', specifications: { engine: '4-Cylinder Turbocharged', alternator: 'Brushless Alternator', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '74 dB', dimensions: '2000 x 850 x 1300 mm', weight: '780 kg' }, features: ['Auto Start/Stop', 'Remote Monitoring', 'Heavy Duty Frame', 'Extended Fuel Tank'] },
  '3': { _id: '3', name: 'MegaForce 62KV Generator', capacity: '62KV', powerOutput: '62 KVA / 50 KW', fuelType: 'Diesel', fuelConsumption: '12-15 L/hr', description: 'High-performance 62KV diesel generator designed for large weddings, industrial facilities, and construction sites.', pricing: { daily: 4000, weekly: 24000, monthly: 80000 }, rating: 4.8, availability: 'available', specifications: { engine: '6-Cylinder Turbocharged', alternator: 'Stamford Alternator', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '75 dB', dimensions: '2400 x 1000 x 1500 mm', weight: '1200 kg' }, features: ['24/7 Operation', 'Sound Attenuated', 'Auto Transfer Switch', 'Digital AMF Panel'] },
  '4': { _id: '4', name: 'TitanPower 82KV Generator', capacity: '82KV', powerOutput: '82 KVA / 66 KW', fuelType: 'Diesel', fuelConsumption: '16-20 L/hr', description: 'Premium 82KV diesel generator built for demanding industrial and large-scale event applications.', pricing: { daily: 5500, weekly: 33000, monthly: 110000 }, rating: 4.7, availability: 'available', specifications: { engine: '6-Cylinder Intercooled', alternator: 'Stamford HC Alternator', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '76 dB', dimensions: '2800 x 1100 x 1600 mm', weight: '1600 kg' }, features: ['Heavy Duty Engine', 'Advanced Cooling', 'Load Management', 'Emergency Auto Start'] },
  '5': { _id: '5', name: 'UltraForce 125KV Generator', capacity: '125KV', powerOutput: '125 KVA / 100 KW', fuelType: 'Diesel', fuelConsumption: '22-28 L/hr', description: 'Industrial-grade 125KV diesel generator for large-scale operations.', pricing: { daily: 8000, weekly: 48000, monthly: 160000 }, rating: 4.9, availability: 'available', specifications: { engine: 'V8 Turbocharged', alternator: 'Stamford HCI', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '78 dB', dimensions: '3200 x 1200 x 1800 mm', weight: '2200 kg' }, features: ['Industrial Grade', 'Remote Monitoring', 'Automated Systems', 'Dual Fuel Option'] },
  '6': { _id: '6', name: 'MegaPower 250KV Generator', capacity: '250KV', powerOutput: '250 KVA / 200 KW', fuelType: 'Diesel', fuelConsumption: '40-50 L/hr', description: 'Ultimate powerhouse 250KV diesel generator for the most demanding applications.', pricing: { daily: 15000, weekly: 90000, monthly: 300000 }, rating: 5.0, availability: 'available', specifications: { engine: 'V12 Turbocharged Intercooled', alternator: 'Stamford LVSI', voltage: '415V / 240V', frequency: '50 Hz', noiseLevel: '82 dB', dimensions: '4000 x 1500 x 2000 mm', weight: '3500 kg' }, features: ['Maximum Power', 'Dual Alternator', 'Full Automation', 'GPS Tracking', '24/7 Monitoring'] },
};

export default function GeneratorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [generator, setGenerator] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerator = async () => {
      try {
        const { data } = await API.get(`/generators/${id}`);
        setGenerator(data.generator);
      } catch {
        setGenerator(fallbackGenerators[id] || fallbackGenerators['1']);
      } finally {
        setLoading(false);
      }
    };
    fetchGenerator();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!generator) return null;

  const specs = generator.specifications || {};
  const specItems = [
    { icon: FaCog, label: 'Engine', value: specs.engine },
    { icon: BsLightningChargeFill, label: 'Voltage', value: specs.voltage },
    { icon: FaGasPump, label: 'Fuel Rate', value: generator.fuelConsumption },
    { icon: FaVolumeDown, label: 'Noise', value: specs.noiseLevel },
    { icon: FaRuler, label: 'Dimensions', value: specs.dimensions },
    { icon: FaWeight, label: 'Weight', value: specs.weight },
  ];

  return (
    <div className="min-h-screen bg-primary pt-[12vh] pb-[6vh]">
      <div className="max-w-[90vw] mx-auto">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-text-muted hover:text-accent font-inter text-[clamp(0.85rem,0.95vw,1rem)] mb-[3vh] transition-colors">
          <BsArrowLeft /> Back to Generators
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,4vw,4rem)]">
          {/* Left - Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative bg-gradient-to-br from-secondary to-card rounded-2xl border border-border overflow-hidden aspect-square flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent group-hover:from-accent/10 transition-all duration-500" />
              <BsLightningChargeFill className="text-accent/25 text-[clamp(6rem,10vw,12rem)] group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5">
                <span className="font-poppins font-bold text-accent text-[clamp(1rem,1.2vw,1.3rem)]">{generator.capacity}</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 mb-[1.5vh] ${generator.availability === 'available' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <span className={`font-inter text-[clamp(0.7rem,0.8vw,0.85rem)] font-medium capitalize ${generator.availability === 'available' ? 'text-green-400' : 'text-red-400'}`}>{generator.availability}</span>
            </div>

            <h1 className="font-poppins font-extrabold text-[clamp(1.8rem,2.5vw,3rem)] text-white leading-tight mb-[1vh]">{generator.name}</h1>

            <div className="flex items-center gap-2 mb-[2vh]">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <BsStarFill key={i} className={`text-[clamp(0.8rem,0.9vw,1rem)] ${i < Math.floor(generator.rating) ? 'text-accent' : 'text-text-muted/30'}`} />
                ))}
              </div>
              <span className="font-inter text-[clamp(0.85rem,0.95vw,1rem)] text-text-muted">{generator.rating} / 5</span>
            </div>

            <p className="font-inter text-[clamp(0.9rem,1vw,1.1rem)] text-text-secondary leading-relaxed mb-[3vh]">{generator.description}</p>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-xl p-[clamp(1.5rem,2vw,2rem)] mb-[3vh]">
              <h3 className="font-poppins font-bold text-[clamp(1rem,1.2vw,1.3rem)] text-white mb-[1.5vh]">Rental Plans</h3>
              <div className="grid grid-cols-3 gap-[clamp(0.5rem,1vw,1rem)]">
                {[
                  { label: 'Daily', price: generator.pricing?.daily },
                  { label: 'Weekly', price: generator.pricing?.weekly },
                  { label: 'Monthly', price: generator.pricing?.monthly },
                ].map((plan) => (
                  <div key={plan.label} className="text-center bg-secondary border border-border rounded-lg p-[clamp(0.8rem,1vw,1rem)]">
                    <p className="font-inter text-[clamp(0.7rem,0.75vw,0.8rem)] text-text-muted uppercase">{plan.label}</p>
                    <p className="font-poppins font-extrabold text-[clamp(1.1rem,1.4vw,1.5rem)] text-accent mt-1">₹{plan.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {generator.features && (
              <div className="flex flex-wrap gap-2 mb-[3vh]">
                {generator.features.map((f) => (
                  <span key={f} className="font-inter text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent border border-border-accent bg-accent/5 rounded-md px-3 py-1">{f}</span>
                ))}
              </div>
            )}

            {/* Book Now */}
            <Link
              href={user ? `/booking?generator=${generator._id}` : '/login'}
              className="group inline-flex items-center gap-2 font-inter font-semibold text-[clamp(1rem,1.1vw,1.2rem)] text-white bg-accent px-[clamp(2rem,3vw,3rem)] py-[clamp(0.8rem,1.2vh,1.2rem)] rounded-md hover:bg-accent-dark hover:shadow-[0_0_35px_rgba(255,140,50,0.4)] transition-all duration-300"
            >
              <BsLightningChargeFill /> Book This Generator
            </Link>
          </motion.div>
        </div>

        {/* Specifications Grid */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-[clamp(3rem,6vh,5rem)]">
          <h2 className="font-poppins font-bold text-[clamp(1.5rem,2vw,2rem)] text-white mb-[2vh]">Technical Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[clamp(0.5rem,1vw,1rem)]">
            {specItems.map((spec) => (
              <div key={spec.label} className="bg-card border border-border rounded-xl p-[clamp(1rem,1.5vw,1.5rem)] text-center hover:border-border-accent transition-all duration-300">
                <spec.icon className="text-accent text-[clamp(1.2rem,1.5vw,1.5rem)] mx-auto mb-[0.5vh]" />
                <p className="font-inter text-[clamp(0.65rem,0.7vw,0.75rem)] text-text-muted uppercase">{spec.label}</p>
                <p className="font-poppins font-semibold text-[clamp(0.8rem,0.9vw,0.95rem)] text-white mt-1">{spec.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
