const path = require('path')
const express = require('express')
const xss = require('xss')
const PostService = require('./posts-service')

const postsRouter = express.Router()
const jsonParser = express.json()

const serializePosts = newPost => ({
  id: newPost.id,
  title: xss(newPost.title),
  content: xss(newPost.content),
  replies: []
})

postsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PostService.getAllPosts(knexInstance)
      .then(posts => {
        res.json(posts.map(serializePosts))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { id, title, content } = req.body;
    const post = { id, title, content }

    for (const [key, value] of Object.entries(post)) {
      if (value == null) {
        return next(`Missing '${key}' in request body`)
      }
    }
    return PostService.insertPosts(
      req.app.get('db'),
      post
    )
      .then(post => {
        const serialized = serializePosts(post)
        res.json(serialized)
      })
      .catch(next)
  })

postsRouter
  .route('/:post_id')
  .all((req, res, next) => {
    PostService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(post => {
        if (!post) {
          return res.status(404).json({
            error: { message: `Post doesn't exist` }
          })
        }
        res.post = post
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializePosts(res.post))
  })

module.exports = postsRouter