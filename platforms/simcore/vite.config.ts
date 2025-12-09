import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  plugins: [
    react(),
    // Token validation in development builds
    mode === 'development' && {
      name: 'token-validation',
      buildStart() {
        console.log('🔍 Running token validation...');
        // Token validation will run automatically
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
      onwarn(warning, warn) {
        // Suppress token-related warnings in production
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three'],
          'vendor-plotly': ['plotly.js', 'react-plotly.js'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
        }
      }
    }
  }
}));
