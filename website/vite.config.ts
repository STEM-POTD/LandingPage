import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    publicDir: 'public',
    server: {
        port: 3000,
        host: '127.0.0.1',
        open: true,
        cors: true,
    },
})
