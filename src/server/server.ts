import express from 'express'
import { trpcMiddleware } from './trpc'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
})

const server = express()

server.use(cors())
server.use(limiter)
server.use('/trpc', trpcMiddleware)

if (process.env.NODE_ENV == 'production') {
  server.use('/', express.static('dist/web'))

  server.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/web' })
  })
}

export { server }
