'use client';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

const VideoSection = dynamic(() => import('../components/VideoSection'), { ssr: false });
const ServicesSection = dynamic(() => import('../components/ServicesSection'));
const TeamSection = dynamic(() => import('../components/TeamSection'));
const SupportBanner = dynamic(() => import('../components/SupportBanner'));
const GeneratorShowcase = dynamic(() => import('../components/GeneratorShowcase'));
const QuoteFormSection = dynamic(() => import('../components/QuoteFormSection'));
const ReviewsSection = dynamic(() => import('../components/ReviewsSection'));
const BlogSection = dynamic(() => import('../components/BlogSection'));
const ContactSection = dynamic(() => import('../components/ContactSection'));

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <ServicesSection />
      <TeamSection />
      <SupportBanner />
      <GeneratorShowcase />
      <QuoteFormSection />
      <ReviewsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
