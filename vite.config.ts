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
    }
  }
})
