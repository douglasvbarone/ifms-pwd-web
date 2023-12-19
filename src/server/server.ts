import express from 'express'
import { trpcMiddleware } from './trpc'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
})

const server = express()

server.use(cors())
server.set('trust proxy', 1)
server.use(limiter)
server.use('/trpc', trpcMiddleware)

if (process.env.NODE_ENV == 'production') {
  server.use('/', express.static('dist/web'))

  server.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/web' })
  })
}

export { server }
