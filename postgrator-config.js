require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.DATABASE_URL
    : process.env.TEST_DATABASE_URL,
}
console.log(process.env.DATABASE_URL)