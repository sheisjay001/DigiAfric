import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'DigiAfric',
  description: 'Competency-based AI-powered education platform',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'DigiAfric',
    description: 'Build verifiable AI skills and employer-ready portfolios.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'DigiAfric',
    images: [
      {
        url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DigiAfric',
      },
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigiAfric',
    description: 'Build verifiable AI skills and employer-ready portfolios.',
    images: [
      (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/og-image.jpg'
    ]
  },
  alternates: {
    canonical: '/'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a href="#content" className="skip-link">Skip to content</a>
        <Header />
        <main id="content" className="container main" role="main" aria-live="polite">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div>
                <div className="brand footer-brand">DigiAfric</div>
                <p className="footer-desc">
                  Empowering African digital workers with verifiable AI skills and employer-ready portfolios.
                </p>
              </div>
              <div className="stack">
                <h4 className="footer-heading">Platform</h4>
                <Link href="/track" className="footer-link">Learning Tracks</Link>
                <Link href="/tutor" className="footer-link">AI Tutor</Link>
                <Link href="/dashboard" className="footer-link">Dashboard</Link>
              </div>
              <div className="stack">
                <h4 className="footer-heading">Community</h4>
                <Link href="#" className="footer-link">Discord (Coming Soon)</Link>
                <Link href="#" className="footer-link">Events</Link>
                <Link href="#" className="footer-link">Success Stories</Link>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; {new Date().getFullYear()} DigiAfric. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
