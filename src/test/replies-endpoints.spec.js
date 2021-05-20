const knex = require('knex')
const app = require('../src/app')
const { makeRepliesArray, makeMaliciousReply } = require('./replies.fixtures')

describe('Replies Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('replies').truncate())

  afterEach('cleanup', () => db('replies').truncate())

  describe(`GET /replies`, () => {
    context(`Given no replies`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/replies')
          .expect(200, [])
      })
    })

    context('Given there are replies in the database', () => {
      const testReplies = makeRepliesArray()

      beforeEach('insert replies', () => {
        return db
          .into('replies')
          .insert(testReplies)
      })

      it('responds with 200 and all of the replies', () => {
        return supertest(app)
          .get('/api/replies')
          .expect(200, testReplies)
      })
    })

    context(`Given an XSS attack reply`, () => {
      const { maliciousReply, expectedReply } = makeMaliciousReply()

      beforeEach('insert malicious reply', () => {
        return db
          .into('replies')
          .insert([maliciousReply])
      })
      it('removes XSS attack id', () => {

        return supertest(app)
          .get(`/api/replies`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].id).to.eql(expectedReply.id)
            expect(res.body[0].title).to.eql(expectedReply.title)
            expect(res.body[0].content).to.eql(expectedReply.content)
          })
      })
    })
  })

  describe(`GET /replies/:reply_id`, () => {
    context(`Given no replies`, () => {
      it(`responds with 404`, () => {
        const replyId = 123456
        return supertest(app)
          .get(`/api/replies/${replyId}`)
          .expect(404, { error: { message: `Reply doesn't exist` } })
      })
    })

    context('Given there are replies in the database', () => {
      const testReplys = makeRepliesArray()

      beforeEach('insert replies', () => {
        return db
          .into('replies')
          .insert(testReplys)
      })

      it('responds with 200 and the specified reply', () => {
        const replyId = 2
        const expectedReply = testReplys[replyId - 1]
        return supertest(app)
          .get(`/api/replies/${replyId}`)
          .expect(200, expectedReply)
      })
    })

    context(`Given an XSS attack Reply`, () => {
      const { maliciousReply, expectedReply } = makeMaliciousReply()

      beforeEach('insert malicious reply', () => {
        return db
          .into('replies')
          .insert([maliciousReply])
      })
      it('removes XSS attack id', () => {

        return supertest(app)
          .get(`/api/replies/${maliciousReply.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.id).to.eql(expectedReply.id)
            expect(res.body.title).to.eql(expectedReply.title)
            expect(res.body[0].content).to.eql(expectedReply.content)

          })
      })
    })
  })

  describe(`POST /replies`, () => {
    it(`creates a reply, responding with 201 and the new reply`, function () {
      this.retries(3)
      const newReply = {
        id: 'Test new reply id...',
        title: 'Test new reply',
      }
      return supertest(app)
        .post('/api/replies')
        .send(newReply)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newReply.title)
          expect(res.body.id).to.eql(newReply.id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/replies/${res.body.id}`)
          const expected = new Date().toLocaleString()
          const actual = new Date(res.body.date_published).toLocaleString()
          expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/replies/${res.body.id}`)
            .expect(res.body)
        )
    })
    const requiredFields = ['id', 'title']


    requiredFields.forEach(field => {
      const newReply = {
        id: 'Test new reply id...',
        title: 'Test new reply',
        content: 'Test new content'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newReply[field]
        return supertest(app)
          .post('/api/replies')
          .send(newReply)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
    it('removes XSS attack id from response', () => {

      const { maliciousReply, expectedReply } = makeMaliciousReply()
      return supertest(app)
        .post(`/api/replies`)
        .send(maliciousReply)
        .expect(201)
        .expect(res => {
          expect(res.body.id).to.eql(expectedReply.id)
          expect(res.body.title).to.eql(expectedReply.title)
          expect(res.body.content).to.eql(expectedReply.content)
        })
    })
  })

  describe(`DELETE /api/replies/:reply_id`, () => {
    context(`Given no replies`, () => {
      it(`responds with 404`, () => {
        const replyId = 12345
        return supertest(app)
          .delete(`/api/replies/${replyId}`)
          .expect(404, { error: { message: `Reply doesn't exist` } })
      })
      context('Given there are replies in the database', () => {
        const testReplies = makeRepliesArray()

        beforeEach('insert replies', () => {
          return db
            .into('replies')
            .insert(testReplies)
        })

        it('responds with 204 and removes the reply', () => {
          const idToRemove = 2
          const expectedReplies = testReplies.filter(reply => reply.id !== idToRemove)
          return supertest(app)
            .delete(`/api/replies/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/replies`)
                .expect(expectedReplies)
            )
        })
      })
    })

    describe(`PATCH /api/replies/:reply_id`, () => {
      context(`Given no replies`, () => {
        it(`responds with 404`, () => {
          const ReplyId = 123456
          return supertest(app)
            .delete(`/api/replies/${ReplyId}`)
            .expect(404, { error: { message: `Reply doesn't exist` } })
        })
      })

      context('Given there are replies in the database', () => {
        const testReplies = makeRepliesArray()

        beforeEach('insert replies', () => {
          return db
            .into('replies')
            .insert(testReplies)
        })

        it('responds with 204 and updates the reply', () => {
          const idToUpdate = 2
          const updateReply = {
            id: 'updated reply id',
            content: 'updated reply content',
          }
          const expectedReply = {
            ...testReplies[idToUpdate - 1],
            ...updateReply
          }
          return supertest(app)
            .patch(`/api/replies/${idToUpdate}`)
            .send(updateReply)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/replies/${idToUpdate}`)
                .expect(expectedReply)
            )
        })

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/replies/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must have a 'title'`
              }
            })
        })

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateReply = {
            title: 'updated reply title',
          }
          const expectedReply = {
            ...testReplies[idToUpdate - 1],
            ...updateReply
          }

          return supertest(app)
            .patch(`/api/replies/${idToUpdate}`)
            .send({
              ...updateReply,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/replies/${idToUpdate}`)
                .expect(expectedReply)
            )
        })
      })
    })
  })
})