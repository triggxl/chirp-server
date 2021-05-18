console.log(process.env.DATABASE_URL, { host: '127.0.0.1', user: 'Triggxl', database: 'chirp-app' })
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || { host: 'localhost', user: 'Triggxl', password: '', database: 'chirp-app' },
  ssl: { rejectUnauthorized: false }
};

/*
(indented = complete)
  copy knexfile
  copy scripts
  drop database on heroku
  heroku config:set PGSSLMODE=no-verify
  create migration
    npx knex migrate:make chirp_app
commit
push up to heroku
run migrations on heroku

heroku db env variable

console.log's
right before the problem || before an object or a map
application:interview 1:100

500 error
check logs: heroku logs
*/