require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeUsersArray, makeMalUsersArray} = require('./users.fixtures');
const {verifyJwt} = require('../src/auth/auth-service');
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

  describe('GET /api/auth/login', () => {
    context('Given no users in the database', () => {
      const testUser = {
        user_name: 'demo',
        password: 'P4ssword!'
      };
  
      it('Returns with a 400 and an error message', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send(testUser)
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });
    });

    context('Given users in the database', () => {
      const testUsers = makeUsersArray();

      const testBadUsername = 'administrator';
      const testGoodUsername = 'demo';
      const testBadPassword = 'password';
      const testGoodPassword = 'P4ssword!';

      beforeEach('Insert users into database', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });

      it('Post with incorrect user_name responds with 400 and an error message', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({user_name: testBadUsername, password: testGoodPassword})
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });

      it('Post with incorrect password responds with 400 and an error message', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({user_name: testGoodUsername, password: testBadPassword})
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });

      it('Post with correct user_name and password responds with 200 and a jwt token', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({user_name: testGoodUsername, password: testGoodPassword})
          .expect(200)
          .expect(res => {
            expect(verifyJwt(res.body.authToken));
          });
      });

    });

    context('Given malicious user in database', () => {
      const {maliciousUser, expectedUser} = makeMalUsersArray();

      const testMalUser ={
        user_name: maliciousUser.user_name,
        password: 'P4ssword!'
      };

      beforeEach('Insert maliciousUser into database', () => {
        return db('thecodes_users')
          .insert(expectedUser);
      });

      it('Responds with 400 and an error when given xss user data', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send(testMalUser)
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });
    });
  });
});