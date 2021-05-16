module.exports = {
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Triggxl@localhost:8002/chirp-app',
  TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Triggxl@localhost:8002/chirp-app/test',
}

// having trouble connecting db to heroku