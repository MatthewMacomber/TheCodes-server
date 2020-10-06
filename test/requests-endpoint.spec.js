require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeAdminArray} = require('./admin.fixtures');
const {makeUsersArray} = require('./users.fixtures');
const {makeCodesArray} = require('./codes.fixtures');
const {makeAnswersArray} = require('./answers.fixtures');
const {makeRequestsArray, makeMalRequestsArray} = require('./requests.fixtures');
const {expect, assert} = require('chai');

describe('The Codes, Request endpoints (requires auth)', () => {
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

  describe('GET /api/requests', () => {
    context('Given no requests in the database', () => {
      const testAdmin = makeAdminArray();
      before('Insert admin into database', () => {
        return db('thecodes_admins')
          .insert(testAdmin);
      });
      let validJwt;
      before('login a admin', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
          });
      });
      it('Returns with a 200 and an empty array', () => {
        return supertest(app)
          .get('/api/requests')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token
          .expect(200)
          .expect([]);
      });
    });

    context('Given requests in the database', () => {
      const testUsers = makeUsersArray();
      const testCodes = makeCodesArray();
      const testAnswers = makeAnswersArray();
      const testRequests = makeRequestsArray();
      const testAdmin = makeAdminArray();
      
      before('Insert admin into database', () => {
        return db('thecodes_admins')
          .insert(testAdmin);
      });
      before('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      before('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });
      before('Insert answers into database', () => {
        return db('thecodes_answers')
          .insert(testAnswers);
      });
      before('Insert requests into database', () => {
        return db('thecodes_requests')
          .insert(testRequests);
      });

      let validJwt;
      before('login a admin', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
          });
      });

      it('Responds with 200 and returns all requests', () => {
        return supertest(app)
          .get('/api/requests')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token.
          .expect(200)
          .expect(res => {
            for (let [i, request] of res.body.entries()) {
              assert(request.user_id, testRequests[i].user_id);
              assert(request.req_type, testRequests[i].req_type);
              assert(request.content, testRequests[i].content);
            }
          });
      });
    });

    context('Given an XSS attack code', () => {
      const testUsers = makeUsersArray();
      const testCodes = makeCodesArray();
      const testAnswers = makeAnswersArray();
      const testAdmin = makeAdminArray();
      
      before('Insert admin into database', () => {
        return db('thecodes_admins')
          .insert(testAdmin);
      });
      before('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      before('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });
      before('Insert answers into database', () => {
        return db('thecodes_answers')
          .insert(testAnswers);
      });

      let validJwt;
      before('login a admin', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
          });
      });

      const {maliciousRequest, expectedRequest} = makeMalRequestsArray();

      before('Insert malicious request', () => {
        return db('thecodes_requests')
          .insert(maliciousRequest);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/requests/1')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token.
          .expect(200)
          .then(res => {
            expect(res.body.req_type).to.eql(expectedRequest.req_type);
            expect(res.body.content).to.eql(expectedRequest.content);
          });
      });
    });

    context('Given a request id', () => {
      const testUsers = makeUsersArray();
      const testCodes = makeCodesArray();
      const testAnswers = makeAnswersArray();
      const testRequests = makeRequestsArray();
      const testAdmin = makeAdminArray();
      
      before('Insert admin into database', () => {
        return db('thecodes_admins')
          .insert(testAdmin);
      });
      before('Insert users into databse', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      before('Insert codes into database', () => {
        return db('thecodes_codes')
          .insert(testCodes);
      });
      before('Insert answers into database', () => {
        return db('thecodes_answers')
          .insert(testAnswers);
      });
      before('Insert requests into database', () => {
        return db('thecodes_requests')
          .insert(testRequests);
      });

      let validJwt;
      before('login a admin', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            validJwt = res.body.authToken;
          });
      });

      it('Delete specified request', () => {
        return supertest(app)
          .delete('/api/requests/3')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token.
          .expect(204);
      });
    });
  });
});