'use client';

import Link from 'next/link';
import { BsLightningChargeFill } from 'react-icons/bs';
import { handleCall } from '@/lib/utils';
import { FaPhone, FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';

const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Book Generator', href: '/generators' },
  ],
  'Generator Fleet': [
    { name: '30KV Generator', href: '/generators' },
    { name: '35KV Generator', href: '/generators' },
    { name: '62KV Generator', href: '/generators' },
    { name: '82KV Generator', href: '/generators' },
    { name: '125KV Generator', href: '/generators' },
    { name: '250KV Generator', href: '/generators' },
  ],
  'Service Areas': [
    { name: 'Shahdol, MP', href: '/#availability' },
    { name: 'Jabalpur, MP', href: '/#availability' },
    { name: 'Bhopal, MP', href: '/#availability' },
    { name: 'Raipur, CG', href: '/#availability' },
    { name: 'Indore, MP', href: '/#availability' },
    { name: 'Nagpur, MH', href: '/#availability' },
  ],
};

export default function Footer() {
  const phoneNumber = '+91 91651 46680';

  return (
    <footer className="bg-[#030B14] border-t border-border">
      {/* Newsletter Bar */}
      <div className="bg-accent">
        <div className="max-w-[92vw] mx-auto py-[clamp(1.5rem,3vh,2.5rem)] flex flex-col md:flex-row items-center justify-between gap-[2vh]">
          <div>
            <h3 className="font-poppins font-bold text-[clamp(1.2rem,1.5vw,1.6rem)] text-white">Join Our Mailing List</h3>
            <p className="font-inter text-[clamp(0.78rem,0.85vw,0.9rem)] text-white/80">Get the latest updates on availability and special offers</p>
          </div>
          <div className="flex gap-2">
            <input
              suppressHydrationWarning
              type="email"
              placeholder="Enter your email"
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-[clamp(1rem,1.5vw,1.5rem)] py-[clamp(0.5rem,0.7vh,0.7rem)] text-white font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] placeholder:text-white/60 focus:outline-none focus:bg-white/30 w-[clamp(200px,20vw,300px)]"
            />
            <button suppressHydrationWarning className="font-inter font-semibold text-[clamp(0.82rem,0.9vw,0.95rem)] text-accent bg-white px-[clamp(1.2rem,1.5vw,2rem)] py-[clamp(0.5rem,0.7vh,0.7rem)] rounded-md hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[92vw] mx-auto py-[clamp(3rem,6vh,5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[clamp(2rem,3vw,3rem)]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-[0.6vw] group mb-[2vh]">
              <div className="w-[clamp(2.5rem,3vw,3rem)] h-[clamp(2.5rem,3vw,3rem)] bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,140,50,0.3)]">
                <BsLightningChargeFill className="text-white text-[clamp(1.2rem,1.4vw,1.5rem)]" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[clamp(1.2rem,1.4vw,1.5rem)] text-white">Ajay<span className="text-accent">Generators</span></h3>
                <p className="text-[clamp(0.5rem,0.6vw,0.65rem)] text-text-muted font-inter uppercase tracking-wider">Powered by Ajay Tent House</p>
              </div>
            </Link>
            <p className="font-inter text-[clamp(0.82rem,0.9vw,0.95rem)] text-text-muted leading-relaxed mb-[2vh] max-w-[28vw] min-w-[280px]">
              Premium diesel generator rental solutions for weddings, industries, construction sites, hospitals and commercial projects across Madhya Pradesh.
            </p>
            <div className="flex flex-col gap-[0.8vh]">
              <a 
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCall(phoneNumber);
                }}
                className="flex items-center gap-[0.5vw] text-text-muted hover:text-accent transition-colors font-inter text-[clamp(0.78rem,0.85vw,0.9rem)] cursor-pointer"
              >
                <FaPhone className="text-accent text-[0.8em]" /> {phoneNumber}
              </a>
              <a href="mailto:info@ajaygenerators.com" className="flex items-center gap-[0.5vw] text-text-muted hover:text-accent transition-colors font-inter text-[clamp(0.78rem,0.85vw,0.9rem)]">
                <FaEnvelope className="text-accent text-[0.8em]" /> info@ajaygenerators.com
              </a>
              <div className="flex items-start gap-[0.5vw] text-text-muted font-inter text-[clamp(0.78rem,0.85vw,0.9rem)]">
                <FaMapMarkerAlt className="text-accent mt-1 shrink-0 text-[0.8em]" />
                <span>Bus Stand Burhar, Distt. Shahdol, M.P.</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-poppins font-bold text-[clamp(0.9rem,1vw,1.05rem)] text-white mb-[2vh] relative pb-[0.8vh]">
                {title}
                <span className="absolute bottom-0 left-0 w-[clamp(1.5rem,2vw,2.5rem)] h-[2px] bg-accent" />
              </h4>
              <ul className="flex flex-col gap-[0.8vh]">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="font-inter text-[clamp(0.78rem,0.82vw,0.88rem)] text-text-muted hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-[92vw] mx-auto py-[clamp(1.2rem,2vh,1.5rem)] flex flex-col md:flex-row items-center justify-between gap-[1.5vh]">
          <p className="font-inter text-[clamp(0.72rem,0.78vw,0.82rem)] text-text-muted">
            © 2026 Ajay Generators — Powered by Ajay Tent House. All rights reserved.
          </p>
          <div className="flex items-center gap-[clamp(0.6rem,1vw,1rem)]">
            {[
              { Icon: FaWhatsapp, href: 'https://wa.me/919165146680' },
              { Icon: FaFacebook, href: '#' },
              { Icon: FaInstagram, href: 'https://www.instagram.com/ajay_kesharwani_86?igsh=MTV6dXloYjB2eTRjeQ==' },
              { Icon: FaTwitter, href: '#' },
              { Icon: FaYoutube, href: '#' }
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-[clamp(2rem,2.3vw,2.5rem)] h-[clamp(2rem,2.3vw,2.5rem)] bg-card border border-border rounded-md flex items-center justify-center text-text-muted hover:text-white hover:bg-accent hover:border-accent transition-all duration-300 text-[clamp(0.75rem,0.85vw,0.9rem)]">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
