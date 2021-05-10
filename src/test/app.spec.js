// contains the technical specifications for a given unit of code to pass successfully
const app = require('../src/app');

describe('App', () => {
  it('GET/ responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get('/').expect(200, 'Hello, world!');
  })
})