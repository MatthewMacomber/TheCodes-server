require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeUsersArray} = require('./users.fixtures');
const {makeCodesArray} = require('./codes.fixtures');
const {makeAnswersArray, makeMalAnswersArray} = require('./answers.fixtures');
const {expect, assert} = require('chai');
const { before } = require('mocha');

describe('The Codes, Answers endpoints (requires auth)', () => {
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
      const testUsers = makeUsersArray();
      before('Insert users into database', () => {
        
        return db('thecodes_users')
          .insert(testUsers);
      });
      let validJwt;
      before('login a user', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_name: 'demo',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
            return true;
          });
      });
      it('Returns with a 200 and an empty array', () => {
        return supertest(app)
          .get('/api/answers')
          .set('Authorization', `bearer ${validJwt}`)
          .expect(200)
          .expect([]);
      });
    });

    context('Given answers in the database', () => {
      const testCodes = makeCodesArray();
      const testAnswers = makeAnswersArray();
      const testUsers = makeUsersArray();
      before('Insert users into database', () => {
        
        return db('thecodes_users')
          .insert(testUsers);
      });
      let validJwt;
      before('login a user', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_name: 'demo',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
          });
      });
      before('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });
      before('Insert answers into database', () => {
        return db('thecodes_answers')
          .insert(testAnswers);
      });

      it('Responds with 200 and returns all answers', () => {
        return supertest(app)
          .get('/api/answers')
          .set('Authorization', `bearer ${validJwt}`) // Set user jwt token
          .expect(200)
          .expect(res => {
            for (let [i, answer] of res.body.entries()) {
              assert(answer.id === testAnswers[i].id);
              assert(answer.content === testAnswers[i].content);
              assert(answer.code_id === testAnswers[i].code_id);
              assert(answer.correct === testAnswers[i].correct);
              assert(answer.user_name === testAnswers[i].user_name);
            }
          });
      });
    });

    context('Given an XSS attack answer', () => {
      const testCodes = makeCodesArray();
      const testUsers = makeUsersArray();
      before('Insert users into database', () => {
        
        return db('thecodes_users')
          .insert(testUsers);
      });
      let validJwt;
      before('login a user', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            user_name: 'demo',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
            return true;
          });
      });
      before('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });
      
      const {maliciousAnswer, expectedAnswer} = makeMalAnswersArray();

      beforeEach('Insert malicious answer', () => {
        return db('thecodes_answers')
          .insert(maliciousAnswer);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/answers')
          .set('Authorization', `bearer ${validJwt}`)
          .expect(200)
          .then(res => {
            expect(res.body[0].content).to.eql(expectedAnswer.content);
          });
      });
    });
  });
});
