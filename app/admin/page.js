'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import { BsLightningChargeFill, BsPeopleFill, BsBoxFill, BsGraphUpArrow, BsCashStack, BsClockFill, BsCheckCircleFill, BsXCircleFill, BsPlusLg, BsPencilFill, BsTrashFill, BsChatDotsFill, BsSendFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const tabs = ['Overview', 'Bookings', 'Generators', 'Users', 'Quotes', 'Chats'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalGenerators: 0, totalBookings: 0, pendingBookings: 0, activeRentals: 0, totalRevenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [generators, setGenerators] = useState([]);
  const [users, setUsers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [chats, setChats] = useState([]);
  const [showAddGen, setShowAddGen] = useState(false);
  const [editingPriceGen, setEditingPriceGen] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminMsg, setAdminMsg] = useState('');
  const chatEnd = useRef(null);
  const socketRef = useRef(null);

  const LStyle = { fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#6B7B8D', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const IStyle = { background: '#06121E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem', padding: '0.6rem 0.8rem', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '0.9rem', outline: 'none' };

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); toast.error('Admin access required'); return; }
    
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll for new data every 10s

    return () => clearInterval(interval);
  }, [user, router]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedChat]);

  const fetchData = async () => {
    try {
      const [sR, bR, gR, uR, cR, qR] = await Promise.allSettled([
        API.get('/admin/stats'), API.get('/bookings'), API.get('/generators'), API.get('/admin/users'), API.get('/chat/admin/all'), API.get('/quotes')
      ]);
      if (sR.status === 'fulfilled') setStats(sR.value.data.stats || stats);
      if (bR.status === 'fulfilled') setBookings(bR.value.data.bookings || []);
      if (gR.status === 'fulfilled') setGenerators(gR.value.data.generators || []);
      if (uR.status === 'fulfilled') setUsers(uR.value.data.users || []);
      if (cR.status === 'fulfilled') setChats(cR.value.data.chats || []);
      if (qR.status === 'fulfilled') setQuotes(qR.value.data.quotes || []);
    } catch {} finally { setLoading(false); }
  };

  const handleAddGen = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      setLoading(true);

      const imageFile = f.get('image');
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      
      const uploadRes = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.imageUrl;

      const data = {
        name: f.get('name'),
        capacity: f.get('capacity'),
        powerOutput: f.get('powerOutput'),
        description: f.get('description'),
        images: [{ url: imageUrl }],
        pricing: { daily: Number(f.get('dailyPrice')), monthly: Number(f.get('monthlyPrice')) },
        fuelConsumption: '2.5L/hr',
      };

      await API.post('/generators', data);
      toast.success('Generator added successfully!');
      setShowAddGen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add generator');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try { await API.put(`/bookings/${id}/status`, { status }); toast.success(`Booking ${status}`); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const updateQuoteStatus = async (id, status) => {
    try { await API.put(`/quotes/${id}`, { status }); toast.success(`Quote marked as ${status}`); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const deleteGen = async (id) => {
    if (!confirm('Delete this generator?')) return;
    try { await API.delete(`/generators/${id}`); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  const updatePrice = async (id, currentPricing) => {
    if (!newPrice || isNaN(newPrice)) { toast.error('Enter a valid price'); return; }
    try {
      await API.put(`/generators/${id}`, { pricing: { ...currentPricing, daily: Number(newPrice) } });
      toast.success('Price updated');
      setEditingPriceGen(null);
      setNewPrice('');
      fetchData();
    } catch { toast.error('Failed to update price'); }
  };

  const sendAdminReply = async () => {
    if (!adminMsg.trim() || !selectedChat) return;
    try {
      await API.post(`/chat/${selectedChat.sessionId}/reply`, { message: adminMsg });
      setAdminMsg('');
      const { data } = await API.get(`/chat/${selectedChat.sessionId}`);
      setSelectedChat(data.chat);
      fetchData();
    } catch { toast.error('Failed to send'); }
  };

  const deleteChat = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this entire chat history?')) return;
    try {
      await API.delete(`/chat/${sessionId}`);
      toast.success('Chat deleted');
      setSelectedChat(null);
      fetchData();
    } catch { toast.error('Failed to delete chat'); }
  };

  const deleteMessage = async (messageId) => {
    if (!selectedChat) return;
    try {
      await API.delete(`/chat/${selectedChat.sessionId}/message/${messageId}`);
      toast.success('Message hidden from your view');
      const { data } = await API.get(`/chat/${selectedChat.sessionId}`);
      setSelectedChat(data.chat);
    } catch { toast.error('Failed to delete message'); }
  };

  if (!user || user.role !== 'admin' || loading) return (
    <div style={{ minHeight: '100vh', background: '#06121E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '3rem', height: '3rem', border: '2px solid rgba(212,132,28,0.3)', borderTop: '2px solid #D4841C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const statCards = [
    { icon: BsPeopleFill, label: 'Users', value: stats.totalUsers, color: '#3b82f6' },
    { icon: BsLightningChargeFill, label: 'Generators', value: stats.totalGenerators, color: '#D4841C' },
    { icon: BsBoxFill, label: 'Bookings', value: stats.totalBookings, color: '#10b981' },
    { icon: BsClockFill, label: 'Pending', value: stats.pendingBookings, color: '#eab308' },
    { icon: BsGraphUpArrow, label: 'Active', value: stats.activeRentals, color: '#a855f7' },
    { icon: BsCashStack, label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: '#D4841C' },
  ];

  const S = { card: { background: '#0F2231', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem' } };

  return (
    <div style={{ minHeight: '100vh', background: '#06121E', paddingTop: '12vh', paddingBottom: '4vh' }}>
      <style>{`
        .group-chat-msg:hover .delete-btn { opacity: 1 !important; }
        @media (max-width: 768px) {
          .admin-chat-grid { grid-template-columns: 1fr !important; }
          .admin-chat-sidebar { display: ${selectedChat ? 'none' : 'block'} !important; }
          .admin-chat-view { display: ${selectedChat ? 'flex' : 'none'} !important; height: 80vh !important; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-chat-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .admin-chat-header-actions { width: 100% !important; justify-content: flex-end !important; }
        }
      `}</style>
      <div style={{ maxWidth: '92vw', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: 'clamp(1.8rem,2.5vw,2.5rem)', color: '#fff', marginBottom: '0.5vh' }}>Admin Dashboard</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.85rem,0.95vw,1rem)', color: '#6B7B8D', marginBottom: '3vh' }}>Manage generators, bookings, users & chats</p>
        </motion.div>

        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '3vh', background: '#0F2231', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.7rem', padding: '0.3rem', width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.78rem,0.88vw,0.92rem)',
              padding: 'clamp(0.4rem,0.5vh,0.5rem) clamp(0.8rem,1.2vw,1.2rem)', borderRadius: '0.5rem',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              background: activeTab === t ? '#D4841C' : 'transparent',
              color: activeTab === t ? '#fff' : '#6B7B8D', fontWeight: activeTab === t ? 600 : 400,
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <div>
            <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,140px),1fr))', gap: 'clamp(0.5rem,1vw,1rem)', marginBottom: '4vh' }}>
              {statCards.map((s, i) => {
                let targetTab = 'Overview';
                if (s.label === 'Users') targetTab = 'Users';
                if (s.label === 'Generators') targetTab = 'Generators';
                if (['Bookings', 'Pending', 'Active'].includes(s.label)) targetTab = 'Bookings';
                
                return (
                  <motion.div 
                    key={s.label} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveTab(targetTab)}
                    style={{ ...S.card, padding: 'clamp(1rem,1.5vw,1.5rem)', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}
                  >
                    <s.icon style={{ color: s.color, fontSize: 'clamp(1.2rem,1.5vw,1.5rem)', marginBottom: '1vh' }} />
                    <p style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: 'clamp(1.2rem,1.8vw,2rem)', color: '#fff', margin: 0 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.6rem,0.7vw,0.75rem)', color: '#6B7B8D', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.label}</p>
                  </motion.div>
                );
              })}
            </div>
            <h2 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: 'clamp(1.2rem,1.5vw,1.5rem)', color: '#fff', marginBottom: '2vh' }}>Recent Bookings</h2>
            <div style={{ ...S.card, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Customer','Email','Phone','Generator','Status','Date','Actions'].map(h => <th key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem,0.8vw,0.85rem)', color: '#6B7B8D', textAlign: 'left', padding: '0.8rem 1rem', textTransform: 'uppercase' }}>{h}</th>)}
                </tr></thead>
                <tbody>{bookings.slice(0,8).map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.8rem 1rem', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.8rem,0.9vw,0.95rem)' }}>{b.user?.name || 'N/A'}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.user?.email || 'N/A'}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.user?.phone || 'N/A'}</td>
                    <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.78rem,0.85vw,0.9rem)' }}>{b.generator?.name || b.generator?.capacity || 'N/A'}</td>
                    <td style={{ padding: '0.8rem 1rem' }}><span style={{ fontSize: 'clamp(0.68rem,0.75vw,0.8rem)', textTransform: 'capitalize', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: b.status === 'pending' ? 'rgba(234,179,8,0.1)' : b.status === 'accepted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: b.status === 'pending' ? '#eab308' : b.status === 'accepted' ? '#10b981' : '#ef4444' }}>{b.status}</span></td>
                    <td style={{ padding: '0.8rem 1rem', color: '#6B7B8D', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.82vw,0.88rem)' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>{b.status === 'pending' && <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => updateStatus(b._id, 'accepted')} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '1rem' }}><BsCheckCircleFill /></button>
                      <button onClick={() => updateStatus(b._id, 'rejected')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}><BsXCircleFill /></button>
                    </div>}</td>
                  </tr>
                ))}</tbody>
              </table>
              {bookings.length === 0 && <p style={{ textAlign: 'center', color: '#6B7B8D', padding: '3rem', fontFamily: 'var(--font-inter)' }}>No bookings yet</p>}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'Bookings' && (
          <div style={{ ...S.card, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Customer','Email','Phone','Generator','Purpose','Duration','Amount','Status','Actions'].map(h => <th key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.68rem,0.78vw,0.82rem)', color: '#6B7B8D', textAlign: 'left', padding: '0.8rem', textTransform: 'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>{bookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.8rem', color: '#fff', fontSize: 'clamp(0.78rem,0.85vw,0.9rem)' }}>{b.user?.name || 'N/A'}</td>
                  <td style={{ padding: '0.8rem', color: '#AAB5C3', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.user?.email || 'N/A'}</td>
                  <td style={{ padding: '0.8rem', color: '#AAB5C3', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.user?.phone || 'N/A'}</td>
                  <td style={{ padding: '0.8rem', color: '#D4841C', fontSize: 'clamp(0.78rem,0.85vw,0.9rem)' }}>{b.generator?.capacity || 'N/A'}</td>
                  <td style={{ padding: '0.8rem', color: '#AAB5C3', textTransform: 'capitalize', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.purpose}</td>
                  <td style={{ padding: '0.8rem', color: '#AAB5C3', textTransform: 'capitalize', fontSize: 'clamp(0.72rem,0.78vw,0.82rem)' }}>{b.rentalDuration}</td>
                  <td style={{ padding: '0.8rem', color: '#D4841C', fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: '0.8rem' }}><span style={{ fontSize: 'clamp(0.65rem,0.7vw,0.75rem)', textTransform: 'capitalize', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: b.status === 'pending' ? 'rgba(234,179,8,0.1)' : b.status === 'accepted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: b.status === 'pending' ? '#eab308' : b.status === 'accepted' ? '#10b981' : '#ef4444' }}>{b.status}</span></td>
                  <td style={{ padding: '0.8rem' }}>{b.status === 'pending' && <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button onClick={() => updateStatus(b._id, 'accepted')} style={{ fontSize: 'clamp(0.68rem,0.72vw,0.78rem)', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer' }}>Accept</button>
                    <button onClick={() => updateStatus(b._id, 'rejected')} style={{ fontSize: 'clamp(0.68rem,0.72vw,0.78rem)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer' }}>Reject</button>
                  </div>}</td>
                </tr>
              ))}</tbody>
            </table>
            {bookings.length === 0 && <p style={{ textAlign: 'center', color: '#6B7B8D', padding: '3rem' }}>No bookings</p>}
          </div>
        )}

        {/* GENERATORS */}
        {activeTab === 'Generators' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3vh', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-inter)', color: '#AAB5C3', margin: 0 }}>{generators.length} generators in fleet</p>
              <button onClick={() => setShowAddGen(!showAddGen)} style={{
                fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.85vw,0.9rem)', fontWeight: 600,
                padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                background: '#D4841C', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                {showAddGen ? <BsXCircleFill /> : <BsPlusLg />} {showAddGen ? 'Cancel' : 'Add Generator'}
              </button>
            </div>

            {showAddGen && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...S.card, padding: 'clamp(1.5rem,2vw,2.5rem)', marginBottom: '4vh' }}>
                <h3 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#fff', marginBottom: '2vh' }}>Add New Generator</h3>
                <form onSubmit={handleAddGen} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,250px),1fr))', gap: '2vh' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Generator Name</label>
                    <input required name="name" style={IStyle} placeholder="e.g. Industry Power 30KV" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Capacity</label>
                    <select required name="capacity" style={IStyle}>
                      {['30KV', '35KV', '62KV', '82KV', '125KV', '250KV'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Power Output</label>
                    <input required name="powerOutput" style={IStyle} placeholder="e.g. 30 KVA / 24 KW" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Daily Price (₹)</label>
                    <input required type="number" name="dailyPrice" style={IStyle} placeholder="2000" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Monthly Price (₹)</label>
                    <input required type="number" name="monthlyPrice" style={IStyle} placeholder="30000" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Generator Image</label>
                    <input required type="file" name="image" accept="image/*" style={IStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <label style={LStyle}>Description</label>
                    <textarea required name="description" style={{ ...IStyle, height: '80px', resize: 'none' }} placeholder="Provide detailed generator specs..." />
                  </div>
                  <button type="submit" disabled={loading} style={{
                    gridColumn: '1 / -1', fontFamily: 'var(--font-inter)', fontWeight: 700,
                    padding: '0.8rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                    background: '#D4841C', color: '#fff', opacity: loading ? 0.7 : 1,
                  }}>{loading ? 'Saving...' : 'Save Generator'}</button>
                </form>
              </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,280px),1fr))', gap: 'clamp(1rem,1.5vw,1.5rem)' }}>
              {generators.map(g => (
                <div key={g._id} style={{ ...S.card, padding: 'clamp(1.2rem,1.5vw,1.5rem)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1vh' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(212,132,28,0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BsLightningChargeFill style={{ color: '#D4841C' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#fff', fontSize: 'clamp(0.9rem,1vw,1.05rem)', margin: 0 }}>{g.name}</p>
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.65rem,0.72vw,0.78rem)', color: '#D4841C', margin: 0 }}>{g.capacity} • {g.powerOutput}</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,0.82vw,0.88rem)', color: '#6B7B8D', marginBottom: '1vh' }}>{g.description?.slice(0, 80)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1vh' }}>
                    {editingPriceGen === g._id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#D4841C', fontFamily: 'var(--font-poppins)', fontWeight: 700 }}>₹</span>
                        <input type="number" autoFocus value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ ...IStyle, width: '80px', padding: '0.2rem 0.5rem', fontSize: '0.9rem' }} />
                        <button onClick={() => updatePrice(g._id, g.pricing)} style={{ background: 'rgba(16,185,129,0.1)', border: 'none', color: '#10b981', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}><BsCheckCircleFill /></button>
                        <button onClick={() => { setEditingPriceGen(null); setNewPrice(''); }} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}><BsXCircleFill /></button>
                      </div>
                    ) : (
                      <p style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#D4841C', margin: 0 }}>₹{g.pricing?.daily?.toLocaleString()}<span style={{ fontSize: '0.5em', color: '#6B7B8D', fontWeight: 400 }}>/day</span></p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {editingPriceGen !== g._id && (
                        <button onClick={() => { setEditingPriceGen(g._id); setNewPrice(g.pricing?.daily || ''); }} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}><BsPencilFill /></button>
                      )}
                      <button onClick={() => deleteGen(g._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}><BsTrashFill /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'Users' && (
          <div style={{ ...S.card, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name','Email','Phone','Role','Joined'].map(h => <th key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem,0.8vw,0.85rem)', color: '#6B7B8D', textAlign: 'left', padding: '0.8rem 1rem', textTransform: 'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>{users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.8rem 1rem', color: '#fff' }}>{u.name}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3' }}>{u.email}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3' }}>{u.phone}</td>
                  <td style={{ padding: '0.8rem 1rem' }}><span style={{ fontSize: 'clamp(0.65rem,0.7vw,0.75rem)', textTransform: 'capitalize', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: u.role === 'admin' ? 'rgba(212,132,28,0.1)' : 'rgba(59,130,246,0.1)', color: u.role === 'admin' ? '#D4841C' : '#3b82f6' }}>{u.role}</span></td>
                  <td style={{ padding: '0.8rem 1rem', color: '#6B7B8D' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* QUOTES */}
        {activeTab === 'Quotes' && (
          <div style={{ ...S.card, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name','Contact','Generator/City','Message','Status','Actions'].map(h => <th key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem,0.8vw,0.85rem)', color: '#6B7B8D', textAlign: 'left', padding: '0.8rem 1rem', textTransform: 'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>{quotes.map(q => (
                <tr key={q._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.8rem 1rem', color: '#fff' }}>{q.name}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3' }}>{q.phone}<br/>{q.email}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3' }}>{q.generator || 'Any'}<br/>{q.city}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#AAB5C3', maxWidth: '200px' }}><p style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{q.message}</p></td>
                  <td style={{ padding: '0.8rem 1rem' }}><span style={{ fontSize: 'clamp(0.65rem,0.7vw,0.75rem)', textTransform: 'capitalize', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: q.status === 'pending' ? 'rgba(234,179,8,0.1)' : q.status === 'contacted' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: q.status === 'pending' ? '#eab308' : q.status === 'contacted' ? '#3b82f6' : '#10b981' }}>{q.status}</span></td>
                  <td style={{ padding: '0.8rem 1rem' }}>{q.status === 'pending' && <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => updateQuoteStatus(q._id, 'contacted')} style={{ fontSize: '0.7rem', padding: '0.3rem', borderRadius: '0.2rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', cursor: 'pointer' }}>Mark Contacted</button>
                    <button onClick={() => updateQuoteStatus(q._id, 'resolved')} style={{ fontSize: '0.7rem', padding: '0.3rem', borderRadius: '0.2rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', cursor: 'pointer' }}>Resolve</button>
                  </div>}</td>
                </tr>
              ))}</tbody>
            </table>
            {quotes.length === 0 && <p style={{ textAlign: 'center', color: '#6B7B8D', padding: '3rem' }}>No quote requests</p>}
          </div>
        )}

        {/* CHATS */}
        {activeTab === 'Chats' && (
          <div className="admin-chat-grid" style={{ display: 'grid', gridTemplateColumns: selectedChat ? 'minmax(200px,1fr) 2fr' : '1fr', gap: '1.5vw', minHeight: '50vh', height: 'clamp(500px, 70vh, 800px)' }}>
            {/* Chat list */}
            <div className="admin-chat-sidebar" style={{ ...S.card, overflowY: 'auto', height: '100%' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, color: '#fff', fontSize: 'clamp(0.9rem,1vw,1.05rem)', margin: 0 }}>
                  <BsChatDotsFill style={{ color: '#D4841C', marginRight: '0.5rem' }} />All Chats ({chats.length})
                </h3>
              </div>
              {chats.map(c => (
                <div key={c._id} onClick={() => setSelectedChat(c)} style={{
                  padding: '0.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer',
                  background: selectedChat?._id === c._id ? 'rgba(212,132,28,0.08)' : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, color: '#fff', fontSize: 'clamp(0.8rem,0.88vw,0.92rem)', margin: '0 0 0.2rem' }}>{c.user?.name || 'Guest'}</p>
                  {c.user?.email && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: '#D4841C', margin: '0 0 0.3rem' }}>{c.user.email}</p>}
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.68rem,0.75vw,0.78rem)', color: '#6B7B8D', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.messages?.[c.messages.length - 1]?.message?.slice(0, 40) || 'No messages'}...
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.6rem,0.65vw,0.7rem)', color: '#6B7B8D', margin: '0.2rem 0 0' }}>{new Date(c.updatedAt).toLocaleString()}</p>
                </div>
              ))}
              {chats.length === 0 && <p style={{ textAlign: 'center', color: '#6B7B8D', padding: '2rem' }}>No chats</p>}
            </div>

            {/* Chat messages */}
            {selectedChat && (
              <div className="admin-chat-view" style={{ ...S.card, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="admin-chat-header" style={{ padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', background: 'linear-gradient(135deg, #D4841C 0%, #F59E0B 100%)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', shadow: '0 10px 20px rgba(212,132,28,0.2)', shrink: 0 }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{(selectedChat.user?.name || 'G')[0]}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedChat.user?.name || 'Guest User'}</h3>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#D4841C', margin: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#D4841C', borderRadius: '50%', shrink: 0 }} />
                        {selectedChat.user?.email || 'Public Session'}
                      </p>
                      {selectedChat.user?.phone && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#6B7B8D', margin: 0 }}>📞 {selectedChat.user.phone}</p>}
                    </div>
                  </div>
                  <div className="admin-chat-header-actions" style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => deleteChat(selectedChat.sessionId)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.6rem 1rem', borderRadius: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600, transition: 'all 0.3s' }}><BsTrashFill /> Delete</button>
                    <button onClick={() => setSelectedChat(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#6B7B8D', cursor: 'pointer', padding: '0.6rem', borderRadius: '0.6rem', fontSize: '1.2rem' }}><BsXCircleFill /></button>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
                  {selectedChat.messages?.filter(m => !m.deletedByAdmin).map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-start' : 'flex-end', position: 'relative' }} className="group-chat-msg">
                      <div style={{
                        maxWidth: '75%', padding: '0.5rem 0.8rem', borderRadius: '0.6rem',
                        background: m.sender === 'admin' ? 'rgba(212,132,28,0.2)' : m.sender === 'bot' ? 'rgba(59,130,246,0.1)' : '#0F2231',
                        border: m.sender === 'admin' ? '1px solid rgba(212,132,28,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        position: 'relative'
                      }}>
                        <button 
                          onClick={() => deleteMessage(m._id)}
                          style={{ 
                            position: 'absolute', top: '-10px', [m.sender === 'admin' ? 'left' : 'right']: '-10px',
                            background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%',
                            width: '20px', height: '20px', fontSize: '0.6rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.2s'
                          }}
                          className="delete-btn"
                        >
                          <BsTrashFill />
                        </button>
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.6rem,0.65vw,0.68rem)', color: m.sender === 'admin' ? '#D4841C' : m.sender === 'bot' ? '#3b82f6' : '#6B7B8D', margin: '0 0 0.2rem', fontWeight: 600, textTransform: 'capitalize' }}>{m.sender}</p>
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.78rem,0.85vw,0.9rem)', color: '#fff', margin: 0, whiteSpace: 'pre-line' }}>{m.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEnd} />
                </div>
                <div style={{ padding: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input value={adminMsg} onChange={e => setAdminMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAdminReply()}
                    placeholder="Reply..." style={{
                      flex: 1, background: '#06121E', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '0.5rem', padding: '0.5rem 0.8rem', color: '#fff',
                      fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.8rem,0.88vw,0.92rem)', outline: 'none',
                      minWidth: '0'
                    }} />
                  <button onClick={sendAdminReply} style={{
                    width: '2.5rem', height: '2.5rem', background: '#D4841C', border: 'none',
                    borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', cursor: 'pointer',
                  }}><BsSendFill /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
