require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('../src/config');
const postsRouter = require('./posts/posts-router');
const repliesRouter = require('./replies/replies-router');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

const app = express();
app.set('db', db)

const morganSetting = (NODE_ENV === 'production' ? 'tiny' : 'common');
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors('Access-Control-Allow-Origin: https://git.heroku.com/stormy-hollows-73700.git'));
app.get('/', (req, res) => {
  res.send('Hello, world!');
})

app.use('/posts', postsRouter);
app.use('/replies', repliesRouter);

app.use((error, req, res, next) => {
  console.error(error)
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app;