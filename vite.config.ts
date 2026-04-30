import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : [],
            },
        }),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
            '/api/v1/search': {
                target: 'https://dev.makemystay.in',
                changeOrigin: true,
                secure: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
