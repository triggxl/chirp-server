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

trying to use postgrator to run my migrations on heroku using env variables from heroku but it still prompts me for a password I am able to the log the DATABASE_URL also.
running postgrator migrations using and logging heroku env variable but get prompted for pw despite
fresh repo, project with 1 migration, table, column
make simple db
mimic db and deploying checkpoints
single table, column
repeat deploying to heroku steps
*/