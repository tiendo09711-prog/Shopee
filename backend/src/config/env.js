import dotenv from 'dotenv'

dotenv.config()

function getEnv(name, fallback = '') {
  return process.env[name] || fallback
}

export const env = {
  port: Number(getEnv('PORT', 5000)),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  mongoUri: getEnv('MONGODB_URI'),
  jwtAccessSecret: getEnv('JWT_ACCESS_SECRET', 'replace_with_access_secret'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET', 'replace_with_refresh_secret'),
  jwtAccessExpires: getEnv('JWT_ACCESS_EXPIRES', '15m'),
  jwtRefreshExpires: getEnv('JWT_REFRESH_EXPIRES', '7d'),
  uploadDir: getEnv('UPLOAD_DIR', 'uploads'),
  corsOrigins: [
    getEnv('CLIENT_CUSTOMER_URL', 'http://localhost:5173'),
    getEnv('CLIENT_SELLER_URL', 'http://localhost:5174'),
    getEnv('CLIENT_ADMIN_URL', 'http://localhost:5175')
  ]
}
