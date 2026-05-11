'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsSendFill, BsLightningChargeFill, BsPaperclip, BsFileEarmarkTextFill, BsDownload, BsXLg } from 'react-icons/bs';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import { io } from 'socket.io-client';

export default function PersonalChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const sessionId = `personal_${user._id}`;

  useEffect(() => {
    // Fetch previous chats
    const fetchHistory = async () => {
      try {
        const { data } = await API.get(`/chat/${sessionId}`);
        if (data.chat?.messages) {
          setMessages(data.chat.messages);
        }
      } catch (err) {
        // Silently ignore if no history
      }
    };
    fetchHistory();

    // Poll for new messages every 4 seconds
    const interval = setInterval(fetchHistory, 4000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/chat/${sessionId}/message/${messageId}`);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

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

  const sendMessage = async () => {
    const userMsg = input.trim();
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
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('isPersonal', 'true');
      if (userMsg) formData.append('message', userMsg);
      if (currentFile) formData.append('file', currentFile);

      await API.post('/chat/message', formData);
    } catch (err) {
      toast.error('Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-card border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-4">
        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
          <BsLightningChargeFill className="text-accent text-xl" />
        </div>
        <div>
          <h3 className="font-poppins font-black text-white tracking-tight">Direct Support</h3>
          <p className="text-[0.7rem] font-inter text-accent uppercase tracking-widest font-bold">Admin is online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-primary/20">
        {messages.filter(m => !m.deletedByUser).length === 0 && (
          <div className="text-center my-auto text-text-muted">
            <p className="font-poppins font-semibold mb-1">Start a conversation</p>
            <p className="text-xs">Send a message to our admin team. We reply quickly!</p>
          </div>
        )}
        {messages.filter(m => !m.deletedByUser).map((msg, i) => (
          <div key={i} className={`flex group/msg ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-accent/20 border border-accent/30 rounded-tr-sm' 
                : 'bg-white/5 border border-white/10 rounded-tl-sm'
            }`}>
              {msg.sender === 'user' && (
                <button 
                  onClick={() => deleteMessage(msg._id)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 text-red-500 hover:text-red-400 p-2 transition-opacity"
                >
                  <BsXLg size={12} />
                </button>
              )}
              {msg.fileUrl && (
                <div className="mb-2">
                  {msg.fileType === 'image' ? (
                    <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded-xl cursor-pointer" onClick={() => window.open(msg.fileUrl, '_blank')} />
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition">
                      <BsFileEarmarkTextFill />
                      <span className="text-xs truncate">Document Attached</span>
                      <BsDownload className="ml-2 text-[0.7rem]" />
                    </a>
                  )}
                </div>
              )}
              {msg.message && (
                <p className={`font-inter text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' ? 'text-white' : 'text-text-secondary'
                }`}>
                  {msg.message}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
             <div className="bg-accent/20 border border-accent/30 rounded-2xl p-4 flex gap-1 rounded-tr-sm">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
             </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-6 py-3 bg-accent/10 border-t border-accent/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BsFileEarmarkTextFill className="text-accent" />
            <span className="text-xs text-white truncate max-w-[200px]">{file.name}</span>
          </div>
          <button suppressHydrationWarning onClick={() => setFile(null)} className="text-red-400 hover:text-red-300">
            <BsXLg />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t border-white/5 bg-white/2 flex items-center gap-2 md:gap-3">
        <input suppressHydrationWarning type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button suppressHydrationWarning onClick={() => fileInputRef.current.click()} className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-text-muted hover:text-accent hover:bg-white/5 transition-colors shrink-0">
          <BsPaperclip className="text-lg" />
        </button>
        <input 
          suppressHydrationWarning
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 md:px-5 py-2.5 md:py-3 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors min-w-0"
        />
        <button 
          suppressHydrationWarning
          onClick={sendMessage} 
          disabled={!input.trim() && !file} 
          className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center text-white hover:bg-accent-dark transition-colors disabled:opacity-50 shrink-0"
        >
          <BsSendFill className="text-sm md:text-base" />
        </button>
      </div>
    </div>
  );
}
