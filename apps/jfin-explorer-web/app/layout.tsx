'use client'

import { IBM_Plex_Sans_Thai } from 'next/font/google'
import '../src/styles/global.css'
import { useUrlQueryRemover } from '@utils/app-nextjs'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
const tailwindConfig = require('@config/tailwind')

const plexSans = IBM_Plex_Sans_Thai({
    subsets: ['latin'],
    variable: '--font-plex-sans',
    weight: ['300', '400', '700'], // light, regular, bold
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // auto remove `at` query param from url
    useUrlQueryRemover(['at'])
    return (
        <html lang="en">
            <head />
            <body className={`${plexSans.variable}`}>
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
                    {children}
                </ChakraProvider>
            </body>
        </html>
    )
}
