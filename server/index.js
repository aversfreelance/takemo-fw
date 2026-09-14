import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createApi } from './app.js'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const app = express()
app.use(createApi())
app.use(express.static(join(root, 'dist')))
app.get('*', (_req, res) => {
  res.sendFile(join(root, 'dist', 'index.html'))
})

const port = Number(process.env.PORT || 8787)
app.listen(port, () => {
  console.log(`Takemo API http://localhost:${port}`)
})
