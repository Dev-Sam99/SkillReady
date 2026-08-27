import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'SkillReady — Interview Prep Tracker',
  description: 'Editorial interview preparation and spaced repetition tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-sans antialiased bg-[#fafaf8] text-stone-900 min-h-screen selection:bg-stone-900 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
