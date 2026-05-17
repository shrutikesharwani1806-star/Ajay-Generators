'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsLightningChargeFill, BsEye, BsEyeSlash } from 'react-icons/bs';
import toast from 'react-hot-toast';
import GeneratorLoader from '@/components/GeneratorLoader';

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(user.role === 'admin' ? '/admin' : '/profile');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success('Account created!');
      router.push('/profile');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-[5vw] pt-[12vh] pb-[5vh]">
      <div className="flex flex-col lg:flex-row items-center gap-[clamp(2rem,5vw,5rem)]">
        {/* Animation Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center mb-4">
            <p className="text-accent font-poppins font-bold text-sm uppercase tracking-widest mb-1">New Member</p>
            <h3 className="text-white font-poppins font-bold text-xl">Join The Fleet</h3>
          </div>
          <GeneratorLoader isLit={isInputFocused || loading} isTyping={isTyping} />
        </motion.div>

        {/* Form Side */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-[clamp(360px,30vw,450px)] bg-card border border-border rounded-xl p-[clamp(2rem,3vw,3rem)] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          {/* Mobile Animation */}
          <div className="lg:hidden flex justify-center mb-6 scale-75 h-32">
            <GeneratorLoader isLit={isInputFocused || loading} isTyping={isTyping} />
          </div>

          <div className="text-center mb-[3vh]">
            <div className="w-[clamp(3rem,4vw,4rem)] h-[clamp(3rem,4vw,4rem)] bg-accent rounded-xl flex items-center justify-center mx-auto mb-[1.5vh] shadow-[0_0_25px_rgba(255,140,50,0.3)]">
              <BsLightningChargeFill className="text-white text-[clamp(1.5rem,2vw,2rem)]" />
            </div>
            <h1 className="font-poppins font-extrabold text-[clamp(1.5rem,2vw,2rem)] text-white">Create Account</h1>
            <p className="font-inter text-[clamp(0.8rem,0.9vw,0.95rem)] text-text-muted mt-[0.5vh]">Join Ajay Generators</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5vh]">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '9876543210' },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-inter text-[clamp(0.75rem,0.8vw,0.85rem)] text-text-muted mb-1 block">{f.label}</label>
                <input 
                  type={f.type} 
                  required 
                  value={form[f.key]} 
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => {
                    setForm({ ...form, [f.key]: e.target.value });
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 500);
                  }}
                  className="w-full bg-primary border border-border rounded-lg px-4 py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.85rem,0.95vw,1rem)] focus:outline-none focus:border-accent/50 transition-colors" 
                  placeholder={f.placeholder} 
                />
              </div>
            ))}
            <div>
              <label className="font-inter text-[clamp(0.75rem,0.8vw,0.85rem)] text-text-muted mb-1 block">Password</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  required 
                  minLength={6} 
                  value={form.password} 
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 500);
                  }}
                  className="w-full bg-primary border border-border rounded-lg px-4 py-[clamp(0.6rem,0.8vh,0.8rem)] text-white font-inter text-[clamp(0.85rem,0.95vw,1rem)] focus:outline-none focus:border-accent/50 transition-colors pr-12" 
                  placeholder="Min 6 characters" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent">
                  {showPass ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              onMouseEnter={() => setIsInputFocused(true)}
              onMouseLeave={() => setIsInputFocused(false)}
              className="w-full font-inter font-semibold text-[clamp(0.9rem,1vw,1.05rem)] text-white bg-accent py-[clamp(0.7rem,1vh,1rem)] rounded-lg hover:bg-accent-dark hover:shadow-[0_0_25px_rgba(255,140,50,0.3)] transition-all duration-300 disabled:opacity-50 mt-[1vh]"
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>
          <p className="font-inter text-[clamp(0.8rem,0.85vw,0.9rem)] text-text-muted text-center mt-[2vh]">
            Already have an account? <Link href="/login" className="text-accent hover:text-accent-dark transition-colors">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
