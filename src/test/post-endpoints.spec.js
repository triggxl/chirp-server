// manage sample/test data
const knex = require('knex')
const app = require('../src/app')
const { makePostArray, makeMaliciousPost } = require('./test/post.fixtures')

describe('Posts Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('post').truncate())

  afterEach('cleanup', () => db('post').truncate())

  describe(`GET /post`, () => {
    context(`Given no post`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/post')
          .expect(200, [])
      })
    })

    context('Given there are posts in the database', () => {
      const testPosts = makePostArray()

      beforeEach('insert post', () => {
        return db
          .into('post')
          .insert(testPosts)
      })

      it('responds with 200 and all of the posts', () => {
        return supertest(app)
          .get('/api/post')
          .expect(200, testPosts)
      })
    })

    context(`Given an XSS attack post`, () => {
      const { maliciousPost, expectedPost } = makeMaliciousPost()

      beforeEach('insert malicious post', () => {
        return db
          .into('post')
          .insert([maliciousPost])
      })
      it('removes XSS attack id', () => {

        return supertest(app)
          .get(`/api/post`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].postId).to.eql(expectedPost.postId)
            expect(res.body[0].title).to.eql(expectedPost.title)
            expect(res.body[0].content).to.eql(expectedPost.content)
          })
      })
    })
  })

  describe(`GET /post/:post_id`, () => {
    context(`Given no post`, () => {
      it(`responds with 404`, () => {
        const postId = 123456
        return supertest(app)
          .get(`/api/post/${postId}`)
          .expect(404, { error: { message: `New Post doesn't exist` } })
      })
    })

    context('Given there are post in the database', () => {
      const testPosts = makePostArray()

      beforeEach('insert post', () => {
        return db
          .into('post')
          .insert(testPosts)
      })

      it('responds with 200 and the specified newPost', () => {
        const postId = 2
        const expectedPost = testPosts[postId - 1]
        return supertest(app)
          .get(`/api/post/${postId}`)
          .expect(200, expectedPost)
      })
    })

    context(`Given an XSS attack newPost`, () => {
      const { maliciousPost, expectedPost } = makeMaliciousPost()

      beforeEach('insert malicious newPost', () => {
        return db
          .into('post')
          .insert([maliciousPost])
      })
      it('removes XSS attack id', () => {

        return supertest(app)
          .get(`/api/post/${maliciousPost.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.id).to.eql(expectedPost.id)
            expect(res.body.title).to.eql(expectedPost.title)
            expect(res.body.content).to.eql(expectedPost.content)
          })
      })
    })
  })

  describe(`POST /post`, () => {
    it(`creates a newPost, responding with 201 and the new newPost`, function () {
      this.retries(3)
      const post = {
        id: 'Test new post id...',
        title: 'Test new post',
        content: 'Test new post content'
      }
      // process.on('uncaughtException', unhandledExceptionCallback);
      return supertest(app)
        .post('/api/post')
        .send(post)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(post.title)
          expect(res.body.id).to.eql(post.id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/post/${res.body.id}`)
          const expected = new Date().toLocaleString()
          const actual = new Date(res.body.date_published).toLocaleString()
          expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/post/${res.body.id}`)
            .expect(res.body)
        )
    })
    const requiredFields = ['id', 'title', 'content']


    requiredFields.forEach(field => {
      const post = {
        title: 'Test post',
        id: 'Test post id...',
        content: 'Test post content'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete post[field]
        return supertest(app)
          .post('/api/post')
          .send(post)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
    it('removes XSS attack id from response', () => {

      const { maliciousPost, expectedPost } = makeMaliciousPost()
      // process.on('uncaughtException', unhandledExceptionCallback);
      // https://stackoverflow.com/questions/34699457/how-do-i-get-the-actual-server-error-when-running-supertest-in-mocha
      return supertest(app)
        .post(`/api/post`)
        .send(maliciousPost)
        .expect(201)
        .expect(res => {
          expect(res.body.id).to.eql(expectedPost.id)
          expect(res.body.title).to.eql(expectedPost.title)
          expect(res.body.content).to.eql(expectedPost.content)
        })
    })
  })

  describe(`DELETE /api/post/:post_id`, () => {
    context(`Given no post`, () => {
      it(`responds with 404`, () => {
        const postId = 12345
        return supertest(app)
          .delete(`/api/post/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } })
      })
      context('Given there are post in the database', () => {
        const testPosts = makePostArray()

        beforeEach('insert post', () => {
          return db
            .into('post')
            .insert(testPosts)
        })

        it('responds with 204 and removes the newPost', () => {
          const idToRemove = 2
          const expectedPosts = testPosts.filter(newPost => newPost.id !== idToRemove)
          return supertest(app)
            .delete(`/api/post/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/post`)
                .expect(expectedPosts)
            )
        })
      })
    })

    describe(`PATCH /api/post/:folder_id`, () => {
      context(`Given no post`, () => {
        it(`responds with 404`, () => {
          const postId = 123456
          return supertest(app)
            .delete(`/api/post/${postId}`)
            .expect(404, { error: { message: `Post doesn't exist` } })
        })
      })

      context('Given there are posts in the database', () => {
        const testPosts = makePostArray()

        beforeEach('insert post', () => {
          return db
            .into('post')
            .insert(testPosts)
        })

        it('responds with 204 and updates the newPost', () => {
          const idToUpdate = 2
          const updatePost = {
            id: 'updated post id',
            title: 'updated post title',
            content: 'updated post content'
          }
          const expectedPost = {
            ...testPosts[idToUpdate - 1],
            ...updatePost
          }
          return supertest(app)
            .patch(`/api/post/${idToUpdate}`)
            .send(updatePost)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/post/${idToUpdate}`)
                .expect(expectedPost)
            )
        })

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/post/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must have a 'title'`
              }
            })
        })

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updatePost = {
            title: 'updated post title',
          }
          const expectedPost = {
            ...testPosts[idToUpdate - 1],
            ...updatePost
          }

          return supertest(app)
            .patch(`/api/post/${idToUpdate}`)
            .send({
              ...updatePost,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/post/${idToUpdate}`)
                .expect(expectedPost)
            )
        })
      })
    })
  })
})