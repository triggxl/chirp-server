module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || { host: '127.0.0.1', user: 'Triggxl', database: 'chirp-app' },
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
*/