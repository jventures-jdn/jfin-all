/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')
const config = require('@config/tailwind')

module.exports = {
    ...config,
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './node_modules/@libs/ui-kit/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            notosans: ['var(--font-plex-sans)', ...fontFamily.sans],
        },
        ...config.theme,
    },
    plugins: [...config.plugins],
    daisyui: config.daisyui,
}
