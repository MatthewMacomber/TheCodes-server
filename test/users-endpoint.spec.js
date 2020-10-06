require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeUsersArray, makeMalUsersArray} = require('./users.fixtures');
const {expect, assert} = require('chai');

describe('The Codes, Users endpoints', () => {
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

  describe('POST /api/users', () => {
    context('Given no users in the database', () => {
      it('Given a user_id returns with a 400 and an error message', () => {
        return supertest(app)
          .get('/api/users/1')
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'User not found');
          });
      });
    });

    context('Given users in the database', () => {
      const testUsers = makeUsersArray();

      beforeEach('Insert users into database', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });

      it('Given an invalid user_id returns with a 400 and an error message', () => {
        return supertest(app)
          .get('/api/users/9')
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'User not found');
          });
      });

      it('Given a valid user_id returns with a 200 and a username', () => {
        return supertest(app)
          .get('/api/users/1')
          .expect(200)
          .expect(res => {
            assert(res.body === 'demo');
          });
      });

      it('Given new user with existing username responds with 400 and an error message', () => {
        return supertest(app)
          .post('/api/users')
          .send({user_name: 'demo', full_name: 'bobby flay', password: 'P4ssword!'})
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Username already taken');
          });
      });
    });


    context('Insert a new user', () => {
      it('Given new user with new username responds with 200 and returns a username', () => {
        return supertest(app)
          .post('/api/users')
          .send({user_name: 'so_good', full_name: 'bobby flay', password: 'P4ssword!'})
          .expect(201)
          .expect(res => {
            const user = res.body;
            assert(user.user_name === 'so_good');
            assert(user.full_name === 'bobby flay');
            assert(user.nickname === '');
          });
      });
    });


    context('Given an XSS attack user', () => {
      const {maliciousUser, expectedUser} = makeMalUsersArray();

      it('Removes XSS attack content', () => {
        return supertest(app)
          .post('/api/users')
          .send({user_name: maliciousUser.user_name, full_name: maliciousUser.full_name, nickname: maliciousUser.nickname, password: 'P4ssword!'})
          .expect(201)
          .then(res => {
            expect(res.body.user_name).to.eql(expectedUser.user_name);
            expect(res.body.full_name).to.eql(expectedUser.full_name);
            expect(res.body.nickname).to.eql(expectedUser.nickname);
          });
      });
    });
  });
});