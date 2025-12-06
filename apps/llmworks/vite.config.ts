import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Large UI libraries
          'vendor-ui': ['@radix-ui/react-tabs', '@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Chart and visualization libraries
          'vendor-charts': ['recharts', 'lucide-react'],
          // TanStack libraries
          'vendor-query': ['@tanstack/react-query'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Enable compression
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } : undefined,
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['@supabase/supabase-js'],
  },
}));
