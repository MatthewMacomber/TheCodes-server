require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeUsersArray} = require('./users.fixtures');
const {makeCodesArray, makeMalCodesArray} = require('./codes.fixtures');
const {expect, assert} = require('chai');

describe('The Codes endpoints', () => {
  let db;
  before('Establish knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  after('Disconnect from db', () => db.destroy());
  before('Cleanup', () => db.raw('TRUNCATE thecodes_admins, thecodes_codes, thecodes_answers, thecodes_users, thecodes_requests RESTART IDENTITY CASCADE'));
  afterEach('Cleanup', () => db.raw('TRUNCATE thecodes_admins, thecodes_codes, thecodes_answers, thecodes_users, thecodes_requests RESTART IDENTITY CASCADE'));

  describe('GET /api/codes', () => {
    context('Given no codes in the database', () => {
      it('Returns with a 200 and an empty array', () => {
        return supertest(app)
          .get('/api/codes')
          .expect(200)
          .expect([]);
      });
    });

    context('Given codes in the database', () => {
      const testUsers = makeUsersArray();
      const testCodes = makeCodesArray();

      beforeEach('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      beforeEach('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });

      it('Responds with 200 and returns all codes', () => {
        return supertest(app)
          .get('/api/codes')
          .expect(200)
          .expect(res => {
            for (let [i, code] of res.body.entries()) {
              assert(code.title === testCodes[i].title);
              assert(code.content === testCodes[i].content);
            }
          });
      });
    });

    context('Given an XSS attack code', () => {
      const testUsers = makeUsersArray();
      const {maliciousCode, expectedCode} = makeMalCodesArray();

      beforeEach('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      beforeEach('Insert malicious code', () => {
        return db('thecodes_codes')
          .insert(maliciousCode);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/codes')
          .expect(200)
          .then(res => {
            expect(res.body[0].id).to.eql(expectedCode.id);
            expect(res.body[0].title).to.eql(expectedCode.title);
            expect(res.body[0].content).to.eql(expectedCode.content);
          });
      });
    });
  });
});