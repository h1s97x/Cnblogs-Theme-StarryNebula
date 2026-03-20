import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/scripts/main.ts',
      name: 'StarryNebula',
      fileName: () => 'starrynebula.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: 'starrynebula.css'
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      }
    },
    // 其他优化
    cssCodeSplit: false,
    sourcemap: false,
    reportCompressedSize: true,
  }
})
