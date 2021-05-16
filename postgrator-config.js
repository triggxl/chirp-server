// require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
}

/*
Issue: after running heroku run npm run migrate I am still being
prompting for password despite logging process.env.url
and having password in heroku URI
*/