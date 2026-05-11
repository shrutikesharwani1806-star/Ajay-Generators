'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleCall } from '@/lib/utils';
import { BsChatDotsFill, BsXLg, BsSendFill, BsLightningChargeFill, BsTelephoneFill, BsPaperclip, BsFileEarmarkTextFill, BsDownload } from 'react-icons/bs';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const greetingName = user?.name ? user.name.split(' ')[0] : '';
    setMessages([
      { sender: 'bot', message: `Namaste ${greetingName}! Welcome to Ajay Generators. 🙏\n\nI am your digital assistant. You can chat here directly with Ajay Kumar Kesharwani (Owner) or ask me anything about our rental fleet.\n\n📞 Direct: +91 91651 46680` },
    ]);
  }, [user]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('chatSessionId') || `session_${Date.now()}`;
    localStorage.setItem('chatSessionId', sessionId);

    // Poll for new messages every 3 seconds to avoid WebSocket issues in unified Next.js
    const pollInterval = setInterval(async () => {
      try {
        const res = await API.get(`/chat/${sessionId}`);
        if (res.data.success && res.data.chat) {
          // Only update if message count changed
          setMessages(prev => {
            const newMessages = res.data.chat.messages;
            if (newMessages.length > prev.length) {
              return newMessages;
            }
            return prev;
          });
        }
      } catch (err) {
        // Silently ignore polling errors
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const sendMessage = async (msg) => {
    const userMsg = (msg || input).trim();
    if (!userMsg && !file) return;

    const newMessage = { 
      sender: 'user', 
      message: userMsg,
      fileUrl: file ? URL.createObjectURL(file) : null,
      fileType: file ? (file.type.startsWith('image/') ? 'image' : 'document') : null
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    const currentFile = file;
    setFile(null);
    setLoading(true);

    try {
      const sessionId = localStorage.getItem('chatSessionId') || `session_${Date.now()}`;
      localStorage.setItem('chatSessionId', sessionId);

      const formData = new FormData();
      formData.append('sessionId', sessionId);
      if (userMsg) formData.append('message', userMsg);
      if (currentFile) formData.append('file', currentFile);

      const res = await API.post('/chat/message', formData);
      const data = res.data;

      if (data.botReply) {
        setMessages(prev => [...prev, { sender: 'bot', message: data.botReply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', message: 'Connection error. Call us: 📞 9165146680' }]);
    } finally { setLoading(false); }
  };

  const quickActions = [
    { label: '⚡ Generators', value: 'generators' },
    { label: '💰 Pricing', value: 'pricing' },
    { label: '📋 Booking', value: 'booking' },
    { label: '📞 Contact', value: 'number' },
  ];

  return (
    <>
      <motion.button suppressHydrationWarning onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: '3vh', right: '3vw', zIndex: 50,
          width: 'clamp(3.5rem,4vw,4rem)', height: 'clamp(3.5rem,4vw,4rem)',
          background: '#D4841C', borderRadius: '50%', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 0 30px rgba(212,132,28,0.4)',
        }}>
        {isOpen ? <BsXLg style={{ color: '#fff', fontSize: '1.1rem' }} /> : <BsChatDotsFill style={{ color: '#fff', fontSize: '1.2rem' }} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: 'calc(3vh + clamp(4rem,5vw,5rem))', right: '3vw', zIndex: 50,
              width: 'clamp(300px,25vw,400px)', height: 'clamp(420px,55vh,550px)',
              background: 'rgba(13,27,42,0.97)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}>
            {/* Header */}
            <div style={{ background: 'rgba(212,132,28,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '2.2rem', height: '2.2rem', background: 'rgba(212,132,28,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BsLightningChargeFill style={{ color: '#D4841C', fontSize: '1rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', margin: 0 }}>Ajay Generators</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: '#10b981', margin: 0 }}>● Online — 24/7 Support</p>
              </div>
              <a 
                href="tel:9165146680" 
                onClick={(e) => {
                  e.preventDefault();
                  handleCall('+91 91651 46680');
                }}
                style={{ width: '2rem', height: '2rem', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', cursor: 'pointer' }}
              >
                <BsTelephoneFill style={{ color: '#10b981', fontSize: '0.75rem' }} />
              </a>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '0.7rem 1rem',
                    borderRadius: '0.8rem',
                    background: msg.sender === 'user' ? 'rgba(212,132,28,0.2)' : '#0F2231',
                    border: msg.sender === 'user' ? '1px solid rgba(212,132,28,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {msg.fileUrl && (
                      <div style={{ marginBottom: msg.message ? '0.5rem' : 0 }}>
                        {msg.fileType === 'image' ? (
                          <img src={msg.fileUrl} alt="Chat attachment" style={{ maxWidth: '100%', borderRadius: '0.5rem', cursor: 'pointer' }} onClick={() => window.open(msg.fileUrl, '_blank')} />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4841C', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.4rem' }}>
                            <BsFileEarmarkTextFill />
                            <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Document</span>
                            <BsDownload style={{ marginLeft: 'auto', fontSize: '0.7rem' }} />
                          </a>
                        )}
                      </div>
                    )}
                    {msg.message && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: msg.sender === 'user' ? '#fff' : '#AAB5C3', margin: 0, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{msg.message}</p>}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#0F2231', borderRadius: '0.8rem', padding: '0.6rem 1rem', display: 'flex', gap: '0.3rem' }}>
                    {[0, 150, 300].map(d => <span key={d} style={{ width: '0.5rem', height: '0.5rem', background: 'rgba(212,132,28,0.5)', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* File Preview */}
            {file && (
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(212,132,28,0.1)', borderTop: '1px solid rgba(212,132,28,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BsFileEarmarkTextFill style={{ color: '#D4841C' }} />
                <span style={{ fontSize: '0.75rem', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                <BsXLg style={{ color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setFile(null)} />
              </div>
            )}

            {/* Input */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input suppressHydrationWarning type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <button suppressHydrationWarning onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', color: '#6B7B8D', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <BsPaperclip />
              </button>
              <input suppressHydrationWarning value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..." style={{
                  flex: 1, background: '#0F2231', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '0.5rem', padding: '0.6rem 1rem',
                  color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                  outline: 'none',
                }} />
              <button suppressHydrationWarning onClick={() => sendMessage()} disabled={!input.trim() && !file} style={{
                width: '2.5rem', height: '2.5rem',
                background: '#D4841C', border: 'none', borderRadius: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer', opacity: (input.trim() || file) ? 1 : 0.3,
              }}><BsSendFill /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
