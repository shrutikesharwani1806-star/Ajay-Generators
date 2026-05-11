'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BsLightningChargeFill, BsSendFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import API from '@/lib/api';

export default function QuoteFormSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', phone: '', email: '', generator: '', city: '', message: '' });
  const [generators, setGenerators] = useState([]);

  useEffect(() => {
    const fetchGens = async () => {
      try {
        const { data } = await API.get('/generators');
        if (data.generators) setGenerators(data.generators);
      } catch (err) {
        console.error('Failed to load generators for quote form');
      }
    };
    fetchGens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/quotes', form);
      toast.success('Quote request submitted! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', generator: '', city: '', message: '' });
    } catch (err) {
      toast.error('Failed to submit quote request. Please try again.');
    }
  };

  return (
    <section className="relative py-[clamp(5rem,10vh,8rem)] bg-secondary overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,140,50,0.04),transparent_50%)]" />

      <div className="relative max-w-[92vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,5vw,5rem)] items-center">
          {/* Left - Info */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-[0.5vw] mb-[1.5vh]">
              <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
              <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">
                Get a Quote
              </span>
            </div>
            <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white leading-[1.12] mb-[2vh]">
              Request a <span className="text-accent">Free Quote</span> for Generator Rental
            </h2>
            <p className="font-inter text-[clamp(0.85rem,0.95vw,1rem)] text-text-secondary leading-relaxed mb-[3vh]">
              Fill out the form and our team will get back to you within 30 minutes with a customized rental quote. Available 24/7 for emergency requests.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-[clamp(1rem,1.5vw,1.5rem)]">
              {[
                { value: '500+', label: 'Rentals' },
                { value: '50+', label: 'Cities' },
                { value: '99%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-card border border-border rounded-xl p-[clamp(1rem,1.5vw,1.5rem)]">
                  <p className="font-poppins font-extrabold text-[clamp(1.5rem,2vw,2.2rem)] text-accent">{stat.value}</p>
                  <p className="font-inter text-[clamp(0.65rem,0.72vw,0.78rem)] text-text-muted uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-[clamp(1.5rem,2.5vw,2.5rem)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.8rem,1.2vh,1.2rem)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.8rem,1.2vh,1.2rem)]">
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <input
                    type="tel"
                    required
                    suppressHydrationWarning
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <input
                  type="email"
                  suppressHydrationWarning
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.8rem,1.2vh,1.2rem)]">
                  <select
                    suppressHydrationWarning
                    value={form.generator}
                    onChange={(e) => setForm({ ...form, generator: e.target.value })}
                    className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-text-muted font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] focus:outline-none focus:border-accent/50 transition-colors"
                  >
                    <option value="">Select Generator</option>
                    {generators.map(g => (
                      <option key={g._id} value={g.capacity}>{g.name} ({g.capacity})</option>
                    ))}
                    {generators.length === 0 && (
                      <>
                        <option value="30KV">30KV Generator</option>
                        <option value="35KV">35KV Generator</option>
                      </>
                    )}
                  </select>
                  <input
                    type="text"
                    suppressHydrationWarning
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Your City"
                    className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <textarea
                  rows={3}
                  suppressHydrationWarning
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your requirements or message..."
                  className="w-full bg-primary border border-border rounded-lg px-[clamp(1rem,1.2vw,1.2rem)] py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="w-full font-inter font-semibold text-[clamp(0.9rem,1vw,1.05rem)] text-white bg-accent py-[clamp(0.7rem,1vh,0.9rem)] rounded-lg hover:bg-accent-dark hover:shadow-[0_0_25px_rgba(255,140,50,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <BsSendFill /> Submit Quote Request
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
