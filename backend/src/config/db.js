import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env and fill your Atlas URI.')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongoUri, { dbName: 'pshop' })
  console.log('MongoDB connected: pshop')
}

export async function disconnectDb() {
  await mongoose.disconnect()
}
