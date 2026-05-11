'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BsXLg, BsCheck2Circle, BsLightningChargeFill, BsCalendar3, BsPhone, BsEnvelope, BsPerson, BsShieldCheck } from 'react-icons/bs';
import toast from 'react-hot-toast';
import API from '@/lib/api';

export default function BookingModal({ generator, isOpen, onClose, user, initialStep = 1, initialBookingId = null }) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [bookingData, setBookingData] = useState({
    fromDate: '',
    toDate: '',
    rentalDuration: 'daily',
    purpose: 'wedding',
    address: {
      state: 'Madhya Pradesh',
      city: '',
      fullAddress: '',
      pincode: ''
    }
  });

  const [prices, setPrices] = useState({
    total: 0,
    days: 1
  });

  useEffect(() => {
    if (bookingData.fromDate && bookingData.toDate) {
      const start = new Date(bookingData.fromDate);
      const end = new Date(bookingData.toDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      let rate = generator.pricing?.daily || 0;
      if (bookingData.rentalDuration === 'weekly') rate = generator.pricing?.weekly / 7;
      if (bookingData.rentalDuration === 'monthly') rate = generator.pricing?.monthly / 30;

      setPrices({
        total: Math.round(rate * diffDays),
        days: diffDays
      });
    }
  }, [bookingData, generator]);

  const handleNext = async () => {
    if (step === 1) {
      if (!bookingData.fromDate || !bookingData.toDate || !bookingData.address.city || !bookingData.address.fullAddress) {
        toast.error('Please fill all details');
        return;
      }
      
      const start = new Date(bookingData.fromDate);
      const end = new Date(bookingData.toDate);
      if (end < start) {
        toast.error('To Date cannot be before From Date');
        return;
      }

      setLoading(true);
      try {
        const payload = {
          ...bookingData,
          generator: generator._id,
          totalAmount: prices.total,
          name: user?.name,
          email: user?.email,
          phone: user?.phone
        };
        const { data } = await API.post('/bookings', payload);
        setBookingId(data.bookingId);
        setStep(2);
        toast.success('OTP sent to ' + (user?.phone || 'your number'));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (otp.join('').length < 4) {
        toast.error('Please enter complete OTP');
        return;
      }
      setLoading(true);
      try {
        await API.post(`/bookings/${bookingId}/verify-otp`, { otp: otp.join('') });
        setStep(3);
      } catch (err) {
        toast.error(err.response?.data?.message || 'OTP Verification failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (val, i) => {
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 3) {
      document.getElementById(`otp-${i + 1}`).focus();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <BsLightningChargeFill />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-white leading-tight">Book {generator.name}</h3>
                <p className="text-[0.7rem] text-text-muted uppercase tracking-widest">Step {step} of 3</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
              <BsXLg />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {step === 1 && (
              <div className="space-y-6">
                {/* Generator Preview */}
                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-white/10 mb-6">
                  <img 
                    src={generator.images?.[0]?.url || '/images/gen-placeholder.jpg'} 
                    alt={generator.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-accent font-black tracking-widest text-xs uppercase">{generator.capacity} Power Unit</span>
                  </div>
                </div>

                {/* User Info (Pre-filled) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <BsPerson className="text-accent" />
                    <div>
                      <p className="text-[0.6rem] text-text-muted uppercase font-bold">Full Name</p>
                      <p className="text-[0.85rem] text-white font-medium">{user?.name || 'Guest'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BsPhone className="text-accent" />
                    <div>
                      <p className="text-[0.6rem] text-text-muted uppercase font-bold">Contact</p>
                      <p className="text-[0.85rem] text-white font-medium">{user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-4">
                  <p className="text-[0.75rem] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <BsCalendar3 className="text-accent" /> Rental Period
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[0.65rem] text-text-muted px-1">From Date</label>
                      <input 
                        type="date" 
                        value={bookingData.fromDate}
                        onChange={(e) => setBookingData({...bookingData, fromDate: e.target.value})}
                        className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[0.65rem] text-text-muted px-1">To Date</label>
                      <input 
                        type="date" 
                        value={bookingData.toDate}
                        onChange={(e) => setBookingData({...bookingData, toDate: e.target.value})}
                        className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Rental Duration / Rate Selection */}
                <div className="space-y-2">
                  <label className="text-[0.65rem] text-text-muted px-1 uppercase font-bold tracking-widest">Rate Plan</label>
                  <select 
                    value={bookingData.rentalDuration}
                    onChange={(e) => setBookingData({...bookingData, rentalDuration: e.target.value})}
                    className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none"
                  >
                    <option value="daily">Daily Standard Rate (₹{generator.pricing?.daily}/day)</option>
                    <option value="monthly">Monthly Professional Rate (₹{generator.pricing?.monthly}/month)</option>
                  </select>
                </div>

                {/* Purpose of Rental */}
                <div className="space-y-2">
                  <label className="text-[0.65rem] text-text-muted px-1 uppercase font-bold tracking-widest">Purpose of Rental</label>
                  <select 
                    value={bookingData.purpose}
                    onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                    className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none"
                  >
                    <option value="wedding">Wedding / Ceremony</option>
                    <option value="industrial">Industrial Operation</option>
                    <option value="construction">Construction Site</option>
                    <option value="commercial">Commercial / Event</option>
                    <option value="emergency">Emergency Backup</option>
                    <option value="residential">Residential Use</option>
                    <option value="hospital">Hospital / Medical</option>
                    <option value="other">Other Purpose</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <p className="text-[0.75rem] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    📍 Delivery Address
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="City" 
                      value={bookingData.address.city}
                      onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, city: e.target.value}})}
                      className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none" 
                    />
                    <input 
                      placeholder="State" 
                      value={bookingData.address.state}
                      onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, state: e.target.value}})}
                      className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none" 
                    />
                  </div>
                  <textarea 
                    placeholder="Full Address / Landmark" 
                    rows={2}
                    value={bookingData.address.fullAddress}
                    onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, fullAddress: e.target.value}})}
                    className="w-full bg-primary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/30 outline-none resize-none" 
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-6 space-y-8">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent text-3xl mx-auto border border-accent/20">
                  <BsShieldCheck />
                </div>
                <div>
                  <h4 className="text-xl font-poppins font-bold text-white mb-2">Verify Mobile OTP</h4>
                  <p className="text-sm text-text-muted">Enter the 4-digit code sent to your phone <br/><strong>{user?.phone}</strong></p>
                  <p className="text-xs text-accent mt-2 font-inter bg-accent/10 py-1 px-3 rounded-full inline-block border border-accent/20">
                    Not getting SMS? Use <strong>1234</strong> to verify
                  </p>
                </div>
                
                <div className="flex justify-center gap-4">
                  {otp.map((digit, i) => (
                    <input 
                      key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      className="w-14 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-bold text-accent focus:border-accent outline-none"
                    />
                  ))}
                </div>
                
                <button className="text-accent text-[0.75rem] font-bold uppercase tracking-widest hover:underline">
                  Resend OTP in 30s
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-10 space-y-6">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-5xl mx-auto border border-green-500/30"
                >
                  <BsCheck2Circle />
                </motion.div>
                <div>
                  <h4 className="text-2xl font-poppins font-bold text-white mb-2">Booking Confirmed!</h4>
                  <p className="text-sm text-text-muted">Your request has been received. Our team will contact you shortly for delivery coordination.</p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.7rem] text-text-muted uppercase">Booking ID</span>
                    <span className="text-xs text-white font-mono">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.7rem] text-text-muted uppercase">Amount Payable</span>
                    <span className="text-lg text-accent font-bold">₹{prices.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step < 3 && (
            <div className="p-6 border-t border-white/5 bg-white/2 flex items-center justify-between">
              <div>
                {step === 1 && (
                  <>
                    <p className="text-[0.6rem] text-text-muted uppercase font-bold">Estimated Total</p>
                    <p className="text-xl text-white font-poppins font-bold">₹{prices.total.toLocaleString()}</p>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-bold text-[0.75rem] text-white border border-white/10 hover:bg-white/5 transition-all">
                    Back
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 py-3 bg-accent rounded-xl font-bold text-[0.75rem] text-white hover:bg-accent-dark transition-all shadow-[0_10px_20px_rgba(212,132,28,0.3)] disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Processing...' : (step === 1 ? 'Verify & Continue' : 'Confirm Booking')}
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="p-8 pt-0">
              <button 
                onClick={() => {
                  onClose();
                  router.push('/profile');
                  toast('Wait for admin approval. You can share your queries through chatting!', {
                    icon: '🕒',
                    duration: 6000,
                    style: { background: '#0F2231', color: '#fff', border: '1px solid #D4841C' }
                  });
                }}
                className="w-full py-4 bg-accent rounded-2xl font-bold text-[0.8rem] text-white hover:bg-accent-dark transition-all uppercase tracking-widest shadow-lg"
              >
                Go to My Profile
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
