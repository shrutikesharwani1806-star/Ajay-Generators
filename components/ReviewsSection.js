'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { BsStarFill, BsChevronLeft, BsChevronRight, BsChatQuoteFill } from 'react-icons/bs';
import API from '@/lib/api';

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const perPage = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get('/reviews');
        if (data.reviews?.length > 0) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / perPage);

  if (loading || reviews.length === 0) return null;

  return (
    <section id="reviews" className="relative py-[clamp(5rem,10vh,8rem)] bg-primary overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative max-w-[92vw] mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-[clamp(3rem,6vh,5rem)]">
          <div className="inline-flex items-center justify-center gap-[0.5vw] mb-[1.5vh] bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
            <BsStarFill className="text-accent text-xs animate-pulse" />
            <span className="font-inter font-bold text-[clamp(0.65rem,0.75vw,0.8rem)] text-accent uppercase tracking-[0.2em]">Customer Testimonials</span>
          </div>
          <h2 className="font-poppins font-black text-[clamp(2rem,3.5vw,4rem)] text-white leading-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Clients Say</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 font-inter text-text-muted text-[clamp(0.85rem,1vw,1.1rem)]">
            Discover why industry leaders and event planners trust Ajay Generators for their most critical power needs.
          </p>
        </motion.div>

        <div className={`flex flex-wrap justify-center gap-[clamp(1.5rem,2.5vw,2.5rem)] ${reviews.length < 3 ? 'max-w-5xl mx-auto' : ''}`}>
          {reviews.slice(current * perPage, current * perPage + perPage).map((r, i) => (
            <motion.div
              key={r._id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0]
              }}
              whileHover={{ y: -15, scale: 1.02 }}
              transition={{ 
                opacity: { duration: 0.5, delay: i * 0.1 },
                scale: { duration: 0.5, delay: i * 0.1 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }}
              className="group relative bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] p-[clamp(2rem,3vw,3rem)] flex-1 min-w-[min(100%,350px)] max-w-[450px] backdrop-blur-xl shadow-2xl hover:border-accent/30 transition-all duration-500"
            >
              {/* Decorative quote mark */}
              <div className="absolute -top-6 -right-4 w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                <BsChatQuoteFill className="text-accent text-2xl group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center gap-1.5 mb-[2.5vh]">
                {Array.from({ length: 5 }).map((_, si) => (
                  <BsStarFill key={si} className={`text-[clamp(0.8rem,0.9vw,1rem)] ${si < r.rating ? 'text-accent drop-shadow-[0_0_8px_rgba(212,132,28,0.5)]' : 'text-white/10'}`} />
                ))}
              </div>

              <p className="relative z-10 font-inter italic font-medium text-[clamp(1rem,1.1vw,1.2rem)] text-white/90 leading-relaxed mb-[3vh]">
                &ldquo;{r.message}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-lg">
                    <span className="font-poppins font-black text-white text-xl uppercase">
                      {(r.name || r.user?.name || 'U')[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-white text-[clamp(1rem,1.1vw,1.2rem)] leading-tight">
                    {r.name || r.user?.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1 h-1 bg-accent rounded-full" />
                    <p className="font-inter font-bold text-[clamp(0.65rem,0.72vw,0.78rem)] text-accent uppercase tracking-wider">
                      {r.eventType || r.event || 'Trusted Client'} {r.city ? `• ${r.city}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-[1vw] mt-[4vh]">
            <button suppressHydrationWarning onClick={() => setCurrent((p) => (p - 1 + totalPages) % totalPages)} className="w-[clamp(2.5rem,3vw,3rem)] h-[clamp(2.5rem,3vw,3rem)] border border-border rounded-md flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-300">
              <BsChevronLeft />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button suppressHydrationWarning key={i} onClick={() => setCurrent(i)} className={`h-[3px] rounded-full transition-all duration-500 ${i === current ? 'w-[clamp(1.5rem,2vw,2.5rem)] bg-accent' : 'w-[clamp(0.8rem,1vw,1rem)] bg-text-muted/30'}`} />
            ))}
            <button suppressHydrationWarning onClick={() => setCurrent((p) => (p + 1) % totalPages)} className="w-[clamp(2.5rem,3vw,3rem)] h-[clamp(2.5rem,3vw,3rem)] border border-border rounded-md flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-300">
              <BsChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
