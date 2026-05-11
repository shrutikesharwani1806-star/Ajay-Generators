'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import { BsLightningChargeFill, BsCalendar3, BsGeoAlt, BsXCircleFill, BsClockFill, BsCheckCircleFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

const statusColors = {
  pending: { bg: 'rgba(234,179,8,0.1)', color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  accepted: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  processing: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  delivered: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  completed: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', border: 'rgba(107,114,128,0.2)' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

const statusIcons = {
  pending: BsClockFill, accepted: BsCheckCircleFill, rejected: BsXCircleFill,
  cancelled: BsXCircleFill, completed: BsCheckCircleFill,
};

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.bookings || []);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally { setCancellingId(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (!user) return null;
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#06121E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '3rem', height: '3rem', border: '2px solid rgba(212,132,28,0.3)', borderTop: '2px solid #D4841C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#06121E', paddingTop: '12vh', paddingBottom: '6vh' }}>
      <div style={{ maxWidth: '92vw', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: 'clamp(1.8rem,2.5vw,2.5rem)', color: '#fff', marginBottom: '0.5vh' }}>
            My <span style={{ color: '#D4841C' }}>Bookings</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.85rem,0.95vw,1rem)', color: '#6B7B8D', marginBottom: '3vh' }}>
            Track and manage your generator bookings
          </p>
        </motion.div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3vh', flexWrap: 'wrap' }}>
          {['all', 'pending', 'accepted', 'delivered', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.85vw,0.9rem)',
              padding: 'clamp(0.4rem,0.5vh,0.5rem) clamp(1rem,1.2vw,1.5rem)',
              borderRadius: '0.5rem', border: 'none', cursor: 'pointer', textTransform: 'capitalize',
              background: filter === f ? '#D4841C' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#fff' : '#AAB5C3', fontWeight: filter === f ? 600 : 400,
              transition: 'all 0.3s',
            }}>{f} {f !== 'all' && `(${bookings.filter(b => b.status === f).length})`}</button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10vh 0' }}>
            <BsLightningChargeFill style={{ fontSize: '3rem', color: 'rgba(107,123,141,0.3)', marginBottom: '1rem' }} />
            <p style={{ fontFamily: 'var(--font-inter)', color: '#6B7B8D', fontSize: 'clamp(0.9rem,1vw,1.05rem)' }}>
              {filter === 'all' ? 'No bookings yet. Book your first generator!' : `No ${filter} bookings found.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 'clamp(1rem,1.5vw,1.5rem)' }}>
            <AnimatePresence>
              {filtered.map((b, i) => {
                const sc = statusColors[b.status] || statusColors.pending;
                const StatusIcon = statusIcons[b.status] || BsClockFill;
                return (
                  <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} layout
                    style={{
                      background: '#0F2231', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.3s',
                    }}>
                    {/* Status bar */}
                    <div style={{ padding: 'clamp(0.8rem,1vw,1rem) clamp(1rem,1.5vw,1.5rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusIcon style={{ color: sc.color, fontSize: 'clamp(0.8rem,0.9vw,0.95rem)' }} />
                        <span style={{
                          fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem,0.78vw,0.82rem)',
                          color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                          padding: '0.2rem 0.6rem', borderRadius: '0.3rem', textTransform: 'capitalize', fontWeight: 600,
                        }}>{b.status}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.65rem,0.72vw,0.78rem)', color: '#6B7B8D' }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'clamp(1rem,1.5vw,1.5rem)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1vh' }}>
                        <BsLightningChargeFill style={{ color: '#D4841C' }} />
                        <span style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#fff', fontSize: 'clamp(0.9rem,1vw,1.05rem)' }}>
                          {b.generator?.name || b.generator?.capacity || 'Generator'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh', marginBottom: '1.5vh' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BsCalendar3 style={{ color: '#6B7B8D', fontSize: '0.75rem' }} />
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.82vw,0.88rem)', color: '#AAB5C3' }}>
                            {new Date(b.fromDate).toLocaleDateString('en-IN')} — {new Date(b.toDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BsGeoAlt style={{ color: '#6B7B8D', fontSize: '0.75rem' }} />
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.82vw,0.88rem)', color: '#AAB5C3' }}>
                            {b.address?.city}, {b.address?.state}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#6B7B8D', fontSize: '0.75rem' }}>📍</span>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.82vw,0.88rem)', color: '#AAB5C3', textTransform: 'capitalize' }}>
                            Purpose: <b>{b.purpose}</b>
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1vh' }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.65rem,0.7vw,0.75rem)', color: '#6B7B8D', textTransform: 'capitalize' }}>{b.rentalDuration} rental</span>
                          <p style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#D4841C', fontSize: 'clamp(1rem,1.2vw,1.3rem)', margin: 0 }}>₹{b.totalAmount?.toLocaleString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => router.push(`/my-bookings/${b._id}`)}
                            style={{
                              fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.72rem,0.8vw,0.85rem)',
                              color: '#fff', background: 'rgba(212,132,28,0.1)',
                              border: '1px solid rgba(212,132,28,0.2)', borderRadius: '0.4rem',
                              padding: '0.4rem 0.8rem', cursor: 'pointer',
                            }}>
                            View Details
                          </button>
                          {['pending', 'accepted'].includes(b.status) && (
                            <button onClick={() => cancelBooking(b._id)} disabled={cancellingId === b._id}
                              style={{
                                fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.72rem,0.8vw,0.85rem)',
                                color: '#ef4444', background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.4rem',
                                padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', gap: '0.3rem', opacity: cancellingId === b._id ? 0.5 : 1,
                              }}>
                              <BsXCircleFill /> {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
