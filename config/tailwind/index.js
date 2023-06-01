/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.{js,ts,jsx,tsx}'],
    mode: 'jit',
    theme: {
        extend: {
            colors: {}, // extends color class
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
    daisyui: {
        themes: [
            {
                jfinTheme: {
                    primary: '#c92229',
                    'primary-focus': '#ed000050',
                    'primary-content': '#ffffff',
                    secondary: '#3e33be',
                    'base-300': '#0b0d0f',
                    'base-200': '#16191d',
                    'base-100': '#2e3338',
                },
            },
        ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: 'jfinTheme', // name of one of the included themes for dark mode
        base: false, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    },

    plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
