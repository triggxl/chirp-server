// import dotenv from 'dotenv'
// dotenv.config()
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || { host: 'localhost', user: 'Triggxl', password: '', database: 'chirp-app' },
  ssl: { rejectUnauthorized: false }
};

