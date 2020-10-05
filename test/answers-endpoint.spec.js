require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeUsersArray} = require('./users.fixtures');
const {makeAnswersArray, makeMalAnswersArray} = require('./answers.fixtures');
const e = require('express');
const {expect, assert} = require('chai');

// TODO Answers endpoint test.

describe('The Codes, Answers endpoints', () => {
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

  describe('GET /api/answers', () => {
    context('Given no answers in the database', () => {
      it('Returns with a 200 and an empty array', () => {
        return supertest(app)
          .get('/api/answers')
          .expect(200)
          .expect([]);
      });
    });

    context('Given answers in the database', () => {
      const testUsers = makeUsersArray();
      const testAnswers = makeAnswersArray();

      beforeEach('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      beforeEach('Insert answers into database', () => {
        return db('thecodes_answers')
          .insert(testAnswers);
      });

      it('Responds with 200 and returns all answers', () => {
        return supertest(app)
          .get('/api/answers')
          .expect(200)
          .expect(res => {
            for (let [i, code] of res.body.entries()) {
              assert(code.code_id, testAnswers[i].code_id);
              assert(code.content, testAnswers[i].content);
            }
          });
      });
    });

    context('Given an XSS attack answer', () => {
      const testUsers = makeUsersArray();
      const {maliciousAnswers, expectedAnswers} = makeMalAnswersArray();

      beforeEach('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      beforeEach('Insert malicious answer', () => {
        return db('thecodes_answers')
          .insert(maliciousAnswers);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/answers')
          .expect(200)
          .then(res => {
            expect(res.body[0].id).to.eql(expectedAnswers.id);
            expect(res.body[0].code_id).to.eql(expectedAnswers.code_id);
            expect(res.body[0].content).to.eql(expectedAnswers.content);
          });
      });
    });
  });
});