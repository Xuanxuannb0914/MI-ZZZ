import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist/renderer',
    // 清空旧的 renderer 产物，避免多次构建后残留旧 hash 文件与 sourcemap
    emptyOutDir: true,
    sourcemap: false,
  },
});
