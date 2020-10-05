const supertest = require('supertest');
const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containing "The Codes Server."', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'The Codes Server.');
  });
});