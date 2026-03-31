import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Sport Santé Magazine | Le bimestriel du sport aixois',
  description: 'Retrouvez toute l\'actualité sportive de la région d\'Aix-en-Provence : Water Polo, Taekwondo, Football, et plus encore.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <ScrollReveal />
        
        {/* Global Grain/Paper Texture Overlay */}
        <div className="paper-overlay" />
        {/* Dynamic Editorial Background (Global) */}
        <div className="editorial-bg-layer" />
        
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
