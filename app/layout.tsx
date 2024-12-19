import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Press_Start_2P } from 'next/font/google'
import { Providers } from "./providers";

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
  title: "CyberPet",
  description: "Let your pet live forever on blockchain",
  icons: {
    icon: '/img/lg64.png', 
  
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
