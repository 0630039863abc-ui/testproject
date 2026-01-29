/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Adding the custom colors from index.css as utility aliases if needed, 
                // but mostly we rely on standard tailwind + css variables.
            }
        },
    },
    plugins: [],
}
