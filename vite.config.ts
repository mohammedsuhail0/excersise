import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        headers: {
          'Origin': 'https://api.groq.com',
        }
      },
      '/api/nvidia': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
        headers: {
          'Origin': 'https://integrate.api.nvidia.com',
        }
      },
    },
  }
});
