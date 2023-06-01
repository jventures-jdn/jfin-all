'use client'

import { IBM_Plex_Sans_Thai } from 'next/font/google'
import Navbar from 'components/Common/Navbar'
import Footer from 'components/Common/Footer'
import '../assets/styles/global.css'
import { WalletConnectProvider } from '@libs/wallet-connect-react'

const plexSans = IBM_Plex_Sans_Thai({
    subsets: ['latin'],
    variable: '--font-plex-sans',
    weight: ['300', '400', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    /* ---------------------------------- Doms ---------------------------------- */
    return (
        <html lang="en" className={`${plexSans.variable}`}>
            <body>
                <WalletConnectProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </WalletConnectProvider>
            </body>
        </html>
    )
}
