import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vault: resolve(__dirname, 'vault.html')
      }
    }
  },
  plugins: [
    {
      name: 'html-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/vault') {
            req.url = '/vault.html'
          }
          next()
        })
      }
    }
  ]
})
