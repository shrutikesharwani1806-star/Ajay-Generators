'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import { BsLightningChargeFill, BsCalendar3, BsGeoAlt, BsClockFill, BsCheckCircleFill, BsInfoCircleFill, BsCreditCardFill, BsChatDotsFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import Image from 'next/image';

const statusColors = {
  pending: { bg: 'rgba(234,179,8,0.1)', color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  accepted: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  processing: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  delivered: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  completed: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', border: 'rgba(107,114,128,0.2)' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

export default function SingleBookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchBooking();
  }, [user, id]);

  const fetchBooking = async () => {
    try {
      const { data } = await API.get(`/bookings/${id}`);
      setBooking(data.booking);
    } catch { 
      toast.error('Booking not found');
      router.push('/my-bookings');
    } finally { setLoading(false); }
  };

  if (!user || loading) return (
    <div style={{ minHeight: '100vh', background: '#06121E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '3rem', height: '3rem', border: '2px solid rgba(212,132,28,0.3)', borderTop: '2px solid #D4841C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const sc = statusColors[booking.status] || statusColors.pending;

  return (
    <div style={{ minHeight: '100vh', background: '#06121E', paddingTop: '12vh', paddingBottom: '6vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 4vw' }}>
        <button onClick={() => router.back()} style={{ color: '#6B7B8D', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '3vh', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#0F2231', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.5rem', overflow: 'hidden' }}>
          
          {/* Status Header */}
          <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#6B7B8D', fontSize: '0.8rem', margin: 0 }}>Booking ID: {booking._id}</p>
              <h1 style={{ color: '#fff', fontSize: '1.5rem', margin: '0.5rem 0' }}>{booking.generator?.name || 'Generator Rental'}</h1>
            </div>
            <div style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {booking.status}
            </div>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* Main Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BsCalendar3 style={{ color: '#D4841C' }} /> Schedule
                </h3>
                <div style={{ color: '#AAB5C3', fontSize: '0.9rem' }}>
                  <p style={{ margin: '0.3rem 0' }}>From: <b>{new Date(booking.fromDate).toLocaleDateString()}</b></p>
                  <p style={{ margin: '0.3rem 0' }}>To: <b>{new Date(booking.toDate).toLocaleDateString()}</b></p>
                  <p style={{ margin: '0.3rem 0', textTransform: 'capitalize' }}>Duration: {booking.rentalDuration}</p>
                </div>
              </div>

              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BsGeoAlt style={{ color: '#D4841C' }} /> Delivery Address
                </h3>
                <div style={{ color: '#AAB5C3', fontSize: '0.9rem' }}>
                  <p style={{ margin: '0.3rem 0' }}>{booking.address?.fullAddress}</p>
                  <p style={{ margin: '0.3rem 0' }}>{booking.address?.city}, {booking.address?.state}</p>
                  <p style={{ margin: '0.3rem 0' }}>Purpose: <b style={{ textTransform: 'capitalize' }}>{booking.purpose}</b></p>
                  <p style={{ margin: '0.3rem 0' }}>Phone: <b>{booking.phone}</b></p>
                </div>
              </div>
            </div>

            {/* Payment & Stats */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', background: 'rgba(212,132,28,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BsCreditCardFill style={{ color: '#D4841C' }} />
                  </div>
                  <div>
                    <p style={{ color: '#6B7B8D', fontSize: '0.8rem', margin: 0 }}>Total Amount</p>
                    <p style={{ color: '#D4841C', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>₹{booking.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '3rem', height: '3rem', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BsCheckCircleFill style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <p style={{ color: '#6B7B8D', fontSize: '0.8rem', margin: 0 }}>Payment Status</p>
                    <p style={{ color: '#10b981', fontSize: '1rem', fontWeight: 600, margin: 0 }}>{(booking.payment?.status || 'pending').toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {booking.adminNotes && (
              <div style={{ background: 'rgba(212,132,28,0.05)', border: '1px solid rgba(212,132,28,0.2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ color: '#D4841C', fontSize: '0.9rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BsInfoCircleFill /> Note from Admin
                </h4>
                <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>{booking.adminNotes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/support')} style={{ flex: 1, minWidth: '150px', background: '#D4841C', color: '#fff', border: 'none', padding: '1rem', borderRadius: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <BsChatDotsFill /> Chat with Support
              </button>
              {['pending', 'accepted'].includes(booking.status) && (
                <button style={{ flex: 1, minWidth: '150px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '1rem', borderRadius: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
