'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { BsLightningChargeFill, BsPersonFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import ConfirmModal from './ConfirmModal';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Generators', href: '/generators' },
  { name: 'Book Now', href: '/booking' },
  { name: 'Services', href: '/#services' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = async () => {
    if (!user) return;
    
    // Admins can logout anytime
    if (user.role === 'admin') {
      setShowLogoutConfirm(true);
      return;
    }

    try {
      const { data } = await API.get('/bookings/my');
      const activeBookings = data.bookings.filter(b => ['pending', 'accepted'].includes(b.status));
      
      if (activeBookings.length > 0) {
        toast.error('You have an active booking. Please cancel it before logging out.', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }
      
      setShowLogoutConfirm(true);
    } catch (err) {
      // If there's an error (like 401), just proceed to confirm/logout
      setShowLogoutConfirm(true);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    toast.success('Logged out successfully');
    setMobileOpen(false);
    setShowLogoutConfirm(false);
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-primary/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-[0.8vh]'
          : 'bg-transparent py-[1.5vh]'
      }`}
    >
      <div className="max-w-[92vw] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[clamp(0.5rem,0.8vw,1rem)] group">
          <div className="w-[clamp(2.2rem,2.8vw,3rem)] h-[clamp(2.2rem,2.8vw,3rem)] bg-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,140,50,0.4)] group-hover:shadow-[0_0_30px_rgba(255,140,50,0.6)] transition-all duration-300 group-hover:scale-105">
            <BsLightningChargeFill className="text-white text-[clamp(1rem,1.3vw,1.4rem)]" />
          </div>
          <div className="leading-none">
            <h1 className="font-poppins font-bold text-[clamp(1rem,1.3vw,1.5rem)] text-white tracking-tight">
              Ajay<span className="text-accent">Generators</span>
            </h1>
            <p className="text-[clamp(0.45rem,0.55vw,0.6rem)] text-text-muted font-inter tracking-[0.15em] uppercase mt-[0.15rem]">
              Power Rental Services
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[clamp(1.2rem,2vw,2.5rem)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative font-inter font-medium text-[clamp(0.75rem,0.85vw,0.95rem)] text-text-secondary hover:text-white transition-colors duration-300 group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-[clamp(0.6rem,1vw,1.2rem)]">
          {mounted && (user ? (
            <div className="flex items-center gap-[clamp(0.8rem,1.2vw,1.5rem)]">
              {user.role === 'admin' && (
                <Link href="/admin" className="font-inter font-bold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent hover:text-white transition-colors bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  ADMIN PANEL
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-3 group/user">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-lg group-hover/user:scale-110 transition-transform duration-300 border border-white/10">
                  <span className="font-poppins font-black text-white text-sm uppercase">{(user.name || 'U')[0]}</span>
                </div>
                <div className="hidden xl:block">
                  <p className="font-poppins font-bold text-xs text-white leading-tight group-hover/user:text-accent transition-colors">
                    {user.name?.split(' ')[0]}
                  </p>
                  <p className="text-[0.6rem] text-text-muted font-inter uppercase tracking-widest font-bold">Account Settings</p>
                </div>
              </Link>
              <button 
                onClick={handleLogoutClick} 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                title="Logout"
              >
                <BsPersonFill className="rotate-180" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="font-inter text-[clamp(0.75rem,0.85vw,0.9rem)] text-text-secondary hover:text-white transition-colors">
              Login
            </Link>
          ))}
          <Link
            href="/generators"
            className="font-inter font-semibold text-[clamp(0.75rem,0.85vw,0.9rem)] text-white bg-accent px-[clamp(1.2rem,1.8vw,2rem)] py-[clamp(0.5rem,0.7vh,0.7rem)] rounded-md hover:bg-accent-dark hover:shadow-[0_0_25px_rgba(255,140,50,0.4)] transition-all duration-300"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white text-[clamp(1.5rem,5vw,2rem)] z-50">
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-2xl border-b border-border py-[3vh] px-[5vw]"
          >
            <div className="flex flex-col gap-[2vh]">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} className="font-inter text-[clamp(1rem,4vw,1.2rem)] text-text-secondary hover:text-accent transition-colors py-[0.5vh] border-b border-border">
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-[3vw] pt-[1vh]">
                {mounted && (user ? (
                  <div className="flex flex-col gap-2">
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="font-inter text-accent font-bold py-2 border-b border-white/5">Admin Dashboard</Link>
                    )}
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="font-inter text-white font-bold py-2 border-b border-white/5">Profile & Bookings</Link>
                    <button onClick={handleLogoutClick} className="font-inter text-red-400 text-left py-2">Logout</button>
                  </div>
                ) : (
                  <div className="flex gap-[3vw]">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="font-inter text-text-secondary border border-border px-[4vw] py-[1vh] rounded-md">Login</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="font-inter text-white bg-accent px-[4vw] py-[1vh] rounded-md font-semibold">Register</Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Sign Out"
        message="Are you sure you want to exit your account? You will need to login again to manage bookings."
      />
    </motion.nav>
  );
}
