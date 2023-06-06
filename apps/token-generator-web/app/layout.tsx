'use client'

import React from 'react'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import Navbar from '../src/components/Common/Navbar'
import Footer from '../src/components/Common/Footer'
import '../assets/styles/global.css'
import { WalletConnectProvider } from '@libs/wallet-connect-react'
import { LoggerReactProvider } from '@libs/logger-react'

const plexSans = IBM_Plex_Sans_Thai({
    subsets: ['latin'],
    variable: '--font-plex-sans',
    weight: ['300', '400', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    /* ---------------------------------- Doms ---------------------------------- */

    return (
        <html lang="en" className={`${plexSans.className}`}>
            <body>
                <WalletConnectProvider>
                    <LoggerReactProvider>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </LoggerReactProvider>
                </WalletConnectProvider>
            </body>
        </html>
    )
}
