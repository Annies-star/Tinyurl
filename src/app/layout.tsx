import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyLink - Premium URL Shortener',
  description: 'Shorten your URLs with style and track your clicks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex min-h-screen flex-col')}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
