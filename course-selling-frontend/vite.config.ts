import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Any request the frontend makes to these paths gets forwarded,
    // server-to-server, to the Express backend on port 3000.
    // The browser only ever talks to the Vite dev server (same origin),
    // so we never hit a CORS error and never had to touch the backend.
    proxy: {
      '/auth': 'http://localhost:3000',
      '/courses': 'http://localhost:3000',
      '/lessons': 'http://localhost:3000',
      '/purchases': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/me': 'http://localhost:3000',
    },
  },
})
