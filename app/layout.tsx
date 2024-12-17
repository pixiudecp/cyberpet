import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Press_Start_2P } from 'next/font/google'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
})

export const metadata: Metadata = {
  title: "Walrus Storage",
  description: "The Next Generation of Web3 Storage",
  icons: {
    icon: '/img/logo.gif', // 或 '/favicon.ico'
    // 可以设置不同尺寸
    // apple: [
    //   { url: '/apple-icon.png' },
    //   { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
