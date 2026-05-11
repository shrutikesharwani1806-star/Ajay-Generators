'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { handleCall } from '@/lib/utils';
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const contactItems = [
    { icon: FaMapMarkerAlt, title: 'Our Location', text: 'Ajay Tent House, Bus Stand Burhar, Distt. Shahdol, Madhya Pradesh, India', href: 'https://goo.gl/maps/...' },
    { icon: FaPhone, title: 'Phone', text: '+91 91651 46680', type: 'phone' },
    { icon: FaWhatsapp, title: 'WhatsApp', text: '+91 91651 46680', href: 'https://wa.me/919165146680' },
    { icon: FaEnvelope, title: 'Email', text: 'info@ajaygenerators.com', href: 'mailto:info@ajaygenerators.com' },
    { icon: FaClock, title: 'Business Hours', text: 'Monday - Sunday: 24/7 Available' },
  ];

  return (
    <section id="contact" className="relative py-[clamp(5rem,10vh,8rem)] bg-primary overflow-hidden">
      <div className="relative max-w-[92vw] mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-[clamp(3rem,6vh,5rem)]">
          <div className="flex items-center justify-center gap-[0.5vw] mb-[1.5vh]">
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
            <span className="font-inter font-semibold text-[clamp(0.7rem,0.8vw,0.85rem)] text-accent uppercase tracking-[0.15em]">Get In Touch</span>
            <div className="w-[clamp(1.2rem,1.5vw,1.8rem)] h-[2px] bg-accent" />
          </div>
          <h2 className="font-poppins font-extrabold text-[clamp(1.8rem,3vw,3.2rem)] text-white">
            Contact <span className="text-accent">Ajay Generators</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,4vw,3rem)]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="flex flex-col gap-[clamp(0.8rem,1.2vh,1.2rem)]">
            {contactItems.map((item) => (
              <div 
                key={item.title} 
                className={`flex items-start gap-[clamp(0.8rem,1vw,1.2rem)] bg-card border border-border rounded-xl p-[clamp(1rem,1.5vw,1.5rem)] hover:border-border-accent transition-all duration-300 ${item.type === 'phone' || item.href ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (item.type === 'phone') {
                    handleCall(item.text);
                  } else if (item.href) {
                    window.open(item.href, item.title === 'WhatsApp' ? '_blank' : '_self');
                  }
                }}
              >
                <div className="w-[clamp(2.5rem,3vw,3rem)] h-[clamp(2.5rem,3vw,3rem)] bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="text-accent text-[clamp(0.9rem,1vw,1.1rem)]" />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-[clamp(0.9rem,1vw,1.05rem)] text-white">{item.title}</p>
                  <p className="font-inter text-[clamp(0.78rem,0.88vw,0.92rem)] text-text-muted mt-[0.3vh]">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-xl overflow-hidden min-h-[40vh]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14626.55!2d81.08!3d23.21!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981!2sBurhar!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0, minHeight: '40vh' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
