// require('dotenv').config();
console.log('123', process.env.DATABASE_URL)
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
can't echo env variables
*/