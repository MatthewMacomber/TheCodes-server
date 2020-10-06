require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const {makeAdminArray} = require('./admin.fixtures');
const { verifyJwt } = require('../src/admin/admin-auth');
const {makeUsersArray} = require('./users.fixtures');
const {assert} = require('chai');

describe('The Codes, Admin endpoints (requires admin auth)', () => {
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

  describe('GET /api/admin/login', () => {
    context('Given no admin in the database', () => {
      it('Returns with a 400 and an error message', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });
    });

    context('Given admin in the database', () => {
      const testAdmin = makeAdminArray();
      beforeEach('Insert admin into database', () => {
        return db('thecodes_admins')
          .insert(testAdmin);
      });

      it('Invalid admin username return with 400 and an error message', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'administrator',
            password: 'P4ssword!'
          })
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });

      it('Invalid admin password return with 400 and an error message', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'Password123!'
          })
          .expect(400)
          .expect(res => {
            assert(res.body.error === 'Incorrect username or password');
          });
      });

      it('Valid admin login returns with a 200 and an admit jwt token', () => {
        return supertest(app)
          .post('/api/admin/login')
          .send({
            user_name: 'admin',
            password: 'P4ssword!'
          })
          .expect(200)
          .expect(res => {
            assert(verifyJwt(res.body.authToken));
          });
      });
    });

    describe('GET /api/admin/users', () => {
      const testAdmin = makeAdminArray();
      const testUsers = makeUsersArray();
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
      before('Insert users into database', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      it('Given valid admin token returns with a 200 and array of users', () => {
        return supertest(app)
          .get('/api/admin/users')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token
          .expect(200)
          .expect(res => {
            for (let [i, user] of res.body.entries()) {
              assert(user.id === testUsers[i].id);
              assert(user.full_name === testUsers[i].full_name);
              assert(user.user_name === testUsers[i].user_name);
              assert(user.nickname === testUsers[i].nickname);
            }
          });
      });
    });

    describe('GET /api/admin/user', () => {
      const testAdmin = makeAdminArray();
      const testUsers = makeUsersArray();
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
      before('Insert users into database', () => {
        return db('thecodes_users')
          .insert(testUsers);
      });
      it('Given valid admin token returns with a 200 and user object', () => {
        return supertest(app)
          .get('/api/admin/user/1')
          .set('Authorization', `bearer ${validJwt}`) // Set admin jwt token
          .expect(200)
          .expect(res => {
            const user = res.body;
            assert(user.id === testUsers[0].id);
            assert(user.full_name === testUsers[0].full_name);
            assert(user.user_name === testUsers[0].user_name);
            assert(user.nickname === testUsers[0].nickname);
          });
      });
    });
  });
});