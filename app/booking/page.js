'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BsLightningChargeFill, BsStarFill, BsCheckCircleFill, BsShieldLockFill, BsCash, BsCreditCard } from 'react-icons/bs';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const preselected = searchParams.get('generator');

  const [generators, setGenerators] = useState([]);
  const [selected, setSelected] = useState(preselected || '');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({
    state: '', city: '', fullAddress: '', rentalDuration: 'daily',
    fromDate: '', toDate: '', purpose: 'wedding', notes: '',
    phone: '', paymentMethod: 'cash'
  });

  useEffect(() => {
    fetchGenerators();
  }, []);

  useEffect(() => { 
    if (!user) {
      router.push('/login'); 
    } else if (user && !form.phone) {
      setForm(prev => ({ ...prev, phone: user.phone || '' }));
    }
  }, [user, router]);

  const fetchGenerators = async () => {
    try {
      const { data } = await API.get('/generators');
      setGenerators(data.generators || []);
    } catch (err) {
      toast.error('Failed to load generators from database');
    } finally {
      setFetching(false);
    }
  };

  const selectedGen = generators.find(g => g._id === selected || g.id === selected);

  const calcTotal = () => {
    if (!selectedGen || !form.fromDate || !form.toDate) return selectedGen?.pricing?.daily || 0;
    const start = new Date(form.fromDate);
    const end = new Date(form.toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    if (form.rentalDuration === 'monthly') return (selectedGen.pricing?.monthly || 0) * Math.ceil(diffDays / 30);
    if (form.rentalDuration === 'weekly') return (selectedGen.pricing?.weekly || 0) * Math.ceil(diffDays / 7);
    return (selectedGen.pricing?.daily || 0) * diffDays;
  };

  const handleInitiateBooking = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a generator'); return; }
    if (!form.phone) { toast.error('Please enter mobile number'); return; }
    
    setLoading(true);
    try {
      const res = await API.post('/bookings', {
        generator: selectedGen._id,
        address: { state: form.state, city: form.city, fullAddress: form.fullAddress },
        rentalDuration: form.rentalDuration, fromDate: form.fromDate,
        toDate: form.toDate, purpose: form.purpose, notes: form.notes,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        totalAmount: calcTotal(),
      });
      
      setBookingId(res.data.bookingId);
      setStep(3); // Go to OTP step
      toast.success('OTP sent to your mobile number');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking initiation failed');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) { toast.error('Please enter a valid 4-digit OTP'); return; }
    
    setLoading(true);
    try {
      await API.post(`/bookings/${bookingId}/verify-otp`, { otp });
      setStep(4); // Congrats page
      toast.success('Verification successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally { setLoading(false); }
  };

  if (!user) return null;

  if (fetching) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-primary pt-[12vh] pb-[10vh]">
      <div className="max-w-[92vw] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">
          <span className="font-inter text-xs text-accent uppercase tracking-widest font-bold">
            {step === 4 ? 'Success' : 'Secure Reservation'}
          </span>
          <h1 className="font-poppins font-black text-[clamp(2rem,4vw,3.5rem)] text-white mt-2">
            {step === 4 ? 'Booking Confirmed!' : <>Finalize Your <span className="text-accent">Power Plan</span></>}
          </h1>
        </motion.div>

        {/* Step Indicators */}
        {step < 4 && (
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {['Selection', 'Details', 'Verification'].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step > i + 1 ? 'bg-accent text-white' : step === i + 1 ? 'bg-accent/20 border-2 border-accent text-white' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                  {step > i + 1 ? <BsCheckCircleFill /> : i + 1}
                </div>
                <span className={`font-inter text-sm ${step === i + 1 ? 'text-white font-bold' : 'text-text-muted'}`}>{s}</span>
                {i < 2 && <div className={`w-12 h-[2px] ${step > i + 1 ? 'bg-accent' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Generator Cards */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="max-w-6xl mx-auto">
              {generators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generators.map((gen, i) => (
                    <motion.div key={gen._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelected(gen._id)}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${selected === gen._id ? 'bg-secondary border-accent shadow-[0_0_30px_rgba(212,132,28,0.2)]' : 'bg-card border-white/5 hover:border-white/20'}`}
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                        <Image src={gen.images?.[0]?.url || '/images/gen-placeholder.jpg'} alt={gen.name} fill className="object-cover" />
                        <div className="absolute top-2 left-2 bg-accent px-2 py-1 rounded text-[10px] font-bold text-white uppercase">{gen.capacity}</div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">{gen.name}</h3>
                      <p className="text-text-muted text-xs line-clamp-2 mb-4">{gen.shortDescription || gen.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-accent font-black text-xl">₹{gen.pricing?.daily?.toLocaleString()} <span className="text-[10px] font-normal text-text-muted uppercase">/ Day</span></div>
                        <div className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selected === gen._id ? 'bg-accent text-white' : 'bg-white/5 text-text-muted group-hover:text-white'}`}>
                          {selected === gen._id ? 'SELECTED' : 'SELECT'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border border-border border-dashed rounded-3xl">
                  <BsLightningChargeFill className="text-accent/20 text-6xl mx-auto mb-4" />
                  <h3 className="text-white font-bold text-2xl">No Inventory Available</h3>
                  <p className="text-text-muted mt-2 mb-8">Please check back later or contact support.</p>
                  <Link href="/admin" className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent-dark transition-all">Go to Admin</Link>
                </div>
              )}
              {generators.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button onClick={() => { if (!selected) { toast.error('Please select a unit'); return; } setStep(2); }}
                    className="bg-accent text-white px-12 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-accent-dark hover:shadow-[0_0_30px_rgba(212,132,28,0.4)] transition-all transform active:scale-95">
                    Continue to Details →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Details Form */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleInitiateBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Mobile Number *</label>
                      <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Rental Duration *</label>
                      <select required value={form.rentalDuration} onChange={e => setForm({...form, rentalDuration: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none">
                        <option value="daily">Daily Rental</option>
                        <option value="weekly">Weekly Plan</option>
                        <option value="monthly">Monthly Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Start Date *</label>
                      <input required type="date" value={form.fromDate} onChange={e => setForm({...form, fromDate: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted uppercase font-bold mb-2 block">End Date *</label>
                      <input required type="date" value={form.toDate} onChange={e => setForm({...form, toDate: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Purpose of Rental *</label>
                    <select required value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none">
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

                  <div>
                    <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Site Address *</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input required placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
                      <input required placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
                    </div>
                    <textarea required rows={2} value={form.fullAddress} onChange={e => setForm({...form, fullAddress: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none resize-none" placeholder="Full location details..." />
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="text-xs text-text-muted uppercase font-bold mb-4 block text-center">Select Payment Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setForm({...form, paymentMethod: 'cash'})} className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${form.paymentMethod === 'cash' ? 'bg-accent/10 border-accent text-white' : 'bg-primary border-white/5 text-text-muted'}`}>
                        <BsCash className="text-2xl" />
                        <span className="text-xs font-bold uppercase">Pay Later / Cash</span>
                      </button>
                      <button type="button" onClick={() => setForm({...form, paymentMethod: 'online'})} className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${form.paymentMethod === 'online' ? 'bg-accent/10 border-accent text-white' : 'bg-primary border-white/5 text-text-muted'}`}>
                        <BsCreditCard className="text-2xl" />
                        <span className="text-xs font-bold uppercase">Online Payment</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-primary rounded-xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-muted text-sm">Base Rate ({selectedGen?.capacity})</span>
                      <span className="text-white font-bold">₹{selectedGen?.pricing?.daily?.toLocaleString()} / day</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-white font-bold uppercase tracking-widest text-xs">Estimated Total</span>
                      <span className="text-accent font-black text-2xl">₹{calcTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Back</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-accent text-white font-black py-4 rounded-xl hover:bg-accent-dark transition-all transform active:scale-95 shadow-[0_0_30px_rgba(212,132,28,0.3)] uppercase tracking-widest text-xs">
                      {loading ? 'Processing...' : 'Verify & Book Now'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
              <div className="bg-card border border-border rounded-3xl p-10 text-center shadow-2xl">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BsShieldLockFill className="text-3xl text-accent" />
                </div>
                <h2 className="text-white text-2xl font-black mb-2">Verify Mobile</h2>
                <p className="text-text-muted text-sm mb-8 leading-relaxed">We've sent a 4-digit code to <br/><b className="text-white">{form.phone}</b></p>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input required maxLength={4} type="text" value={otp} onChange={e => setOtp(e.target.value)} 
                    placeholder="0000"
                    className="w-full bg-primary border-2 border-white/10 rounded-xl px-4 py-4 text-white text-center text-3xl font-black tracking-[0.4em] focus:border-accent outline-none" />
                  <button type="submit" disabled={loading} className="w-full bg-accent text-white font-black py-4 rounded-xl hover:bg-accent-dark transition-all transform active:scale-95 shadow-[0_0_30px_rgba(212,132,28,0.4)] uppercase tracking-widest text-xs">
                    {loading ? 'Verifying...' : 'Complete Reservation'}
                  </button>
                </form>
                <button className="text-accent text-xs font-bold uppercase tracking-widest mt-6 hover:underline">Resend Code</button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center">
              <div className="bg-gradient-to-br from-secondary to-primary border border-accent/30 rounded-[2.5rem] p-12 shadow-2xl">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <BsCheckCircleFill className="text-4xl text-white" />
                </div>
                <h2 className="text-white text-4xl font-black mb-4 tracking-tight">Confirmed!</h2>
                <p className="text-text-muted text-lg leading-relaxed mb-10">
                  Your generator booking request is secured. 
                  {form.paymentMethod === 'cash' 
                    ? "Our team will contact you shortly to coordinate the unit delivery and handle the payment onsite." 
                    : "Payment verification is complete. Our team will contact you for delivery coordination."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => router.push('/my-bookings')} className="bg-accent text-white font-black py-4 rounded-xl hover:bg-accent-dark transition-all transform active:scale-95 uppercase tracking-widest text-xs">My Bookings</button>
                  <button onClick={() => router.push('/')} className="bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs border border-white/10">Home</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary flex items-center justify-center"><div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
