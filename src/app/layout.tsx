import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['800'],
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillReady — Technical Interview & Spaced Repetition Tracker',
  description: 'Editorial interview preparation and spaced repetition tracker for software engineers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkillReady',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#EAF4FE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${figtree.variable} font-sans antialiased bg-mist text-ink min-h-screen selection:bg-deep selection:text-white relative`}>
        {/* Sky Glass Fixed Blurred Background Blobs */}
        <div className="sky-glass-blob-container" aria-hidden="true">
          <div className="sky-glass-blob blob-1" />
          <div className="sky-glass-blob blob-2" />
          <div className="sky-glass-blob blob-3" />
        </div>

        {/* Page Content Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <PwaRegister />
      </body>
    </html>
  );
}
