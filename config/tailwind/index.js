/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.{js,ts,jsx,tsx}'],
    mode: 'jit',
    theme: {
        extend: {
            colors: {
                primary: { 400: '#3e33be', 800: '#282640' },
                secondary: { 400: '#fcd201' },
                background: '',
                danger: '#c92229',
            },
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
    },
    plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
}
