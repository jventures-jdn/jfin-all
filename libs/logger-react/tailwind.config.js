/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')
const config = require('@config/tailwind')

module.exports = {
    ...config,
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            notosans: ['var(--font-plex-sans)', ...fontFamily.sans],
        },
        ...config.theme,
    },
    plugins: [...config.plugins],
    daisyui: config.daisyui,
}
