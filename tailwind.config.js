/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0A0E14',
                card: '#1F2937',
                primary: '#3B82F6',
                success: '#10B981',
                danger: '#EF4444',
                warning: '#F59E0B',
                text: {
                    primary: '#F3F4F6',
                    secondary: '#9CA3AF'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
