import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(async ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  const { createApi } = await import('./server/app.js')
  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'takemo-api',
      configureServer(server) {
        const api = createApi()
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/api')) api(req, res, next)
          else next()
        })
      },
    },
  ],
}
})
