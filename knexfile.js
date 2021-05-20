const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};