import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
  ,
  // Enable source maps in production build to map minified stack traces back to original source
  build: {
    sourcemap: true,
    // keep names to make mapping easier in some cases
    target: 'es2020',
    rollupOptions: {
      output: {
        // prevent mangling of function names in some bundlers
        compact: false
      }
    }
  }
})


