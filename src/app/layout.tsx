import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import './globals.css';
import styles from './globals.module.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer/Footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'POKÉ COLLECTOR',
  description: 'Pokemon TCG Cards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div>
            <Header />
          </div>
          <div className={styles.pageBody}>{children}</div>
          <Footer />
        </body>
        <GoogleAnalytics gaId='G-EB291KFBXQ' />
      </html>
    </ClerkProvider>
  );
}
