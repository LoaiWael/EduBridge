import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/imgs/favicon/eduBridge-logo.png'], // Assets in your public folder
      manifest: {
        name: 'EduBridge Platform',
        short_name: 'EduBridge',
        description: 'An interactive, dynamic, and highly engaging learning and collaboration platform for students and educators.',
        theme_color: '#D5E4FF',
        background_color: '#F5F7FB',
        display: 'standalone',
        icons: [
          {
            src: '/imgs/favicon/eduBridge-logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/imgs/favicon/eduBridge-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
