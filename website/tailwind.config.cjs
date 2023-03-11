/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'nav-yellow': '#f5f1e3',
                tan: '#dddbcb',
            },
            backgroundImage: {
                'banner-image': "url('/images/banner-bg.png')",
            },
            fontFamily: {
                'sans-serif': ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [require('prettier-plugin-tailwindcss')],
}
