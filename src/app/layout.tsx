'use client'

import './globals.css'
import { Roboto } from 'next/font/google';
import ClientToaster from '@/components/ClientToaster';
import Navbar from '@/frame/navbar.frame';
import { useEffect, useState } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lightMode, setLightMode] = useState<string>("init")
  useEffect(() => {
    setLightMode(window?.localStorage?.getItem("lights") || "")
  }, [])

  return (
    <html lang="vi">
      <body className={roboto.className + " " + lightMode}>
        <div className={`app-layout`}>
          <Navbar setLightMode={setLightMode} lightMode={lightMode}/>
          <div className="web-container">
            {lightMode !== "init" && children}
          </div>
          <ClientToaster />
        </div>
      </body>
    </html>
  )
}
