import app from './src/app.js'
import { connectDb } from './src/config/db.js'
import { env } from './src/config/env.js'

async function startServer() {
  await connectDb()
  app.listen(env.port, () => {
    console.log(`PShop API listening on port ${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
