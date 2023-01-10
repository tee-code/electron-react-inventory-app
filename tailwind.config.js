// const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {

            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('flowbite/plugin')

    ],
};