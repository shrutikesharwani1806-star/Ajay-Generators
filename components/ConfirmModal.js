'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BsBoxArrowRight, BsXLg, BsQuestionCircleFill } from 'react-icons/bs';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 text-3xl mx-auto mb-6 border border-red-500/20">
              <BsQuestionCircleFill />
            </div>

            <h3 className="text-xl font-poppins font-black text-white uppercase tracking-tight mb-2">
              {title || 'Are you sure?'}
            </h3>
            <p className="text-sm text-text-muted font-inter leading-relaxed mb-8">
              {message || 'You will need to login again to access your bookings and profile.'}
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={onConfirm}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(239,68,68,0.2)]"
              >
                <BsBoxArrowRight /> Sign Out Now
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-text-muted hover:text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all border border-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
