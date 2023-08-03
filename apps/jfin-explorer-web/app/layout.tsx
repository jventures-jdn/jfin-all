'use client'
export const runtime = 'edge'

import { IBM_Plex_Sans_Thai } from 'next/font/google'
import '../src/styles/global.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { MenuDemo } from '../components/menu'
import NextTopLoader from 'nextjs-toploader'
const tailwindConfig = require('@config/tailwind')

const plexSans = IBM_Plex_Sans_Thai({
    subsets: ['latin'],
    variable: '--font-plex-sans',
    weight: ['300', '400', '700'], // light, regular, bold
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head />
            <body className={`${plexSans.variable}`}>
                <NextTopLoader color="yellow" />
                <ChakraProvider
                    theme={extendTheme({
                        config: {
                            initialColorMode: 'light',
                            useSystemColorMode: false,
                        },
                        colors: {
                            ...tailwindConfig.theme.extend.colors,
                        },
                    })}
                >
                    {/* Menu */}
                    <MenuDemo />
                    {/* Main */}
                    <div style={{ padding: 20 }}>{children}</div>
                </ChakraProvider>
            </body>
        </html>
    )
}
