import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getSecurityHeaders } from '@alawein/security-headers';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: getSecurityHeaders('development'),
  },
  preview: {
    headers: getSecurityHeaders('production'),
  },
});
