import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(helmet())
app.use(cors({
  origin: env.corsOrigins,
  credentials: true
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use('/uploads', express.static(path.resolve(__dirname, '..', env.uploadDir)))
app.use('/api', routes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
