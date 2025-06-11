import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Neobrutalism',
        short_name: 'Neobrutalism',
        description: 'Aplikasi Sosial dengan gaya brutal & keren',
        theme_color: '#ffffff',
        background_color: '#0d0d0d',
        display: 'standalone',
        icons: [
          {
            src: '/192.png',
            sizes: '192x118',
            type: 'image/png'
          },
          {
            src: '/512.png',
            sizes: '512x315',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
