import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Ajay Generators — Premium Industrial Generator Rental | Madhya Pradesh',
  description: 'Premium diesel generator rental solutions for weddings, industries, construction sites, hospitals and commercial projects. 30KV to 250KV generators available across Madhya Pradesh.',
  keywords: 'generator rental, diesel generator, power rental, Madhya Pradesh, wedding generator, industrial generator, Shahdol, Burhar',
  openGraph: {
    title: 'Ajay Generators — Premium Industrial Generator Rental',
    description: 'Reliable power solutions for every event and industry.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-primary text-white font-inter" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
