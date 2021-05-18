module.exports = {
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Triggxl@localhost:8002/chirp-app',
  TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Triggxl@localhost:8002/chirp-app/test',
}

/*
make knexfile
make new migration
npm i knex pg
fill in values for knexfile
change scripts create-migrate
Junior Dev...server, front-end, full-stack on a team security is more about the industry you're in
attended Thinkful from ___ to ___
looking at projects and portfolio
do _ job applications a day || week
*/