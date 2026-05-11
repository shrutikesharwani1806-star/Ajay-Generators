'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BsPersonFill, BsEnvelopeFill, BsPhoneFill, BsBoxSeam, BsClockHistory, BsChevronRight, BsLightningChargeFill, BsBoxArrowRight } from 'react-icons/bs';
import API from '@/lib/api';
import toast from 'react-hot-toast';
import BookingModal from '@/components/BookingModal';
import ConfirmModal from '@/components/ConfirmModal';
import PersonalChat from '@/components/PersonalChat';
import { BsChatDotsFill, BsStarFill } from 'react-icons/bs';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, message: '', eventType: '', city: '' });
  const [generatorToReview, setGeneratorToReview] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchMyBookings();
  }, [user, authLoading, router]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    const hasPending = bookings.some(b => b.status === 'pending');
    if (hasPending) {
      toast((t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="font-poppins font-bold text-sm text-white">Pending Bookings Detected!</p>
          <p className="text-xs text-text-muted">Logging out will automatically mark your pending bookings as cancelled. Continue?</p>
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                setLoading(true);
                try {
                  // Cancel all pending bookings
                  const pending = bookings.filter(b => b.status === 'pending');
                  await Promise.all(pending.map(b => API.put(`/bookings/${b._id}/cancel`)));
                  handleLogoutConfirm();
                } catch (err) {
                  toast.error('Logout failed during cancellation');
                } finally { setLoading(false); }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-[0.7rem] font-bold uppercase tracking-widest"
            >
              Cancel & Logout
            </button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-white/10 text-white rounded-lg text-[0.7rem] font-bold uppercase tracking-widest">Keep Session</button>
          </div>
        </div>
      ), { duration: 6000, style: { background: '#0F2231', border: '1px solid #ef4444' } });
      return;
    }
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleResumeBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleOpenReview = (booking) => {
    setGeneratorToReview(booking.generator);
    setIsReviewModalOpen(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', {
        generator: generatorToReview?._id,
        rating: reviewData.rating,
        message: reviewData.message,
        eventType: reviewData.eventType || 'Event',
        city: reviewData.city || 'Unknown'
      });
      toast.success('Review submitted successfully!');
      setIsReviewModalOpen(false);
      setReviewData({ rating: 5, message: '', eventType: '', city: '' });
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchMyBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-[15vh] pb-[10vh]">
      <div className="max-w-[90vw] lg:max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Profile Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-card border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent text-4xl mx-auto mb-4 border border-accent/20">
                <BsPersonFill />
              </div>
              <h2 className="text-2xl font-poppins font-black text-white uppercase tracking-tight">{user?.name}</h2>
              <p className="text-accent font-inter text-sm font-bold uppercase tracking-widest mb-6">Verified Customer</p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                  <BsEnvelopeFill className="text-text-muted" />
                  <span className="text-sm text-text-muted font-medium truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                  <BsPhoneFill className="text-text-muted" />
                  <span className="text-sm text-text-muted font-medium">{user?.phone || 'No phone set'}</span>
                </div>
              </div>

              <button 
                onClick={handleLogoutClick}
                className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-bold text-sm transition-all duration-300"
              >
                <BsBoxArrowRight /> Sign Out
              </button>
            </div>

            <div className="bg-accent/5 border border-accent/10 rounded-3xl p-6">
              <h4 className="text-white font-poppins font-bold mb-2 flex items-center gap-2">
                <BsLightningChargeFill className="text-accent" /> Power Member
              </h4>
              <p className="text-xs text-text-muted font-inter leading-relaxed">
                As a registered user, you get priority support and faster booking verifications.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center justify-between p-4 rounded-2xl font-bold uppercase tracking-widest text-[0.75rem] transition-all ${
                  activeTab === 'bookings' ? 'bg-accent text-white shadow-lg' : 'bg-card border border-white/5 text-text-muted hover:text-white hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3"><BsBoxSeam className="text-lg" /> My Bookings</div>
                {activeTab === 'bookings' && <BsChevronRight />}
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center justify-between p-4 rounded-2xl font-bold uppercase tracking-widest text-[0.75rem] transition-all ${
                  activeTab === 'chat' ? 'bg-accent text-white shadow-lg' : 'bg-card border border-white/5 text-text-muted hover:text-white hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3"><BsChatDotsFill className="text-lg" /> Support Chat</div>
                {activeTab === 'chat' && <BsChevronRight />}
              </button>
            </div>
          </motion.div>

          {/* Main Content - Dynamic Based on Tab */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            {activeTab === 'bookings' ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-poppins font-black text-white flex items-center gap-3 uppercase tracking-tight">
                    <BsBoxSeam className="text-accent" /> My Rental History
                  </h3>
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[0.7rem] text-text-muted font-black uppercase tracking-widest">
                    {bookings.length} Bookings
                  </span>
                </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-card/50 animate-pulse rounded-2xl" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking, i) => (
                  <motion.div 
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-card border border-white/5 hover:border-accent/30 rounded-3xl p-6 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Gen Image */}
                      <div className="w-full md:w-32 h-20 relative rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <img 
                          src={booking.generator?.images?.[0]?.url || '/images/gen-placeholder.jpg'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={booking.generator?.name}
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-poppins font-black text-white uppercase tracking-tight">
                              {booking.generator?.name || booking.generator?.capacity}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[0.65rem] text-text-muted flex items-center gap-1 font-bold uppercase tracking-widest">
                                <BsClockHistory /> {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`text-[0.6rem] px-2 py-0.5 rounded font-black uppercase tracking-widest ${
                                booking.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 
                                booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-text-muted font-bold uppercase mb-1">Total Paid</p>
                            <p className="text-xl font-poppins font-black text-accent">₹{booking.totalAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="shrink-0 flex flex-col gap-2">
                        {booking.status === 'accepted' && (
                          <button 
                            onClick={() => handleOpenReview(booking)}
                            className="text-[0.7rem] bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors text-center"
                          >
                            Share Review
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'accepted') && (
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-[0.7rem] bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors text-center"
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          onClick={() => handleResumeBooking(booking)}
                          className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent/30 transition-all self-end mt-1"
                        >
                          <BsChevronRight />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/30 border border-white/5 border-dashed rounded-[3rem]">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10 text-4xl mx-auto mb-6">
                  <BsBoxSeam />
                </div>
                <h4 className="text-white font-poppins font-bold text-xl mb-2">No Bookings Yet</h4>
                <p className="text-text-muted font-inter text-sm max-w-xs mx-auto mb-8">
                  You haven't rented any generators yet. Explore our fleet to find the perfect unit for your needs.
                </p>
                <button 
                  onClick={() => router.push('/generators')}
                  className="bg-accent text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-accent-dark transition-all"
                >
                  Explore Fleet
                </button>
              </div>
            )}
            </>
            ) : (
              <PersonalChat user={user} />
            )}
          </motion.div>

        </div>
      </div>

      {/* Resume Booking Modal */}
      {selectedBooking && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          generator={selectedBooking.generator}
          user={user}
          initialStep={selectedBooking.isOtpVerified ? 3 : 2}
          initialBookingId={selectedBooking._id}
        />
      )}

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Sign Out"
        message="Are you sure you want to exit your account? You will need to login again to manage bookings."
      />

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-poppins font-black text-white uppercase tracking-tight mb-4">Share Your Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <BsStarFill key={star} onClick={() => setReviewData({...reviewData, rating: star})} className={`text-2xl cursor-pointer transition-colors ${star <= reviewData.rating ? 'text-accent' : 'text-white/20'}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-1">Event Type</label>
                  <input required placeholder="e.g. Wedding" value={reviewData.eventType} onChange={e => setReviewData({...reviewData, eventType: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-accent/50" />
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-1">City</label>
                  <input required placeholder="e.g. Bhopal" value={reviewData.city} onChange={e => setReviewData({...reviewData, city: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-accent/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase font-bold tracking-widest block mb-1">Your Experience</label>
                <textarea required rows={4} placeholder="Tell us about the generator performance..." value={reviewData.message} onChange={e => setReviewData({...reviewData, message: e.target.value})} className="w-full bg-primary border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-accent/50 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-sm uppercase tracking-widest hover:bg-accent-dark transition-colors">Submit</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
