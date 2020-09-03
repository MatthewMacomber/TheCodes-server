const express = require('express');
const AdminService = require('./admin-service');
const AdminAuth = require('./admin-auth');
const AuthService = require('../auth/auth-service');

const adminRouter = express.Router();
const parseBody = express.json();

adminRouter
  .post('/login', parseBody, (req, res, next) => {
    const {user_name, password} = req.body;
    const loginAdmin = {user_name, password};

    for(const [key, value] of Object.entries(loginAdmin)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }
    AdminAuth.getAdminWithUsername(req.app.get('db'), loginAdmin.user_name)
      .then(dbAdmin => {
        if (!dbAdmin) {
          return res.status(400).json({
            error: 'Incorrect username or password'
          });
        }
        return AdminAuth.comparePasswords(loginAdmin.password, dbAdmin.password)
          .then(compare => {
            if (!compare) {
              return res.status(400).json({
                error: 'Incorrect username or password'
              });
            }
            const sub = dbAdmin.user_name;
            const payload = {user_id: dbAdmin.id};
            res.send({
              authToken: AuthService.createJwt(sub, payload)
            });
          });
      })
      .catch(next);
  });

adminRouter
  .route('/users')
  //.all(adminAuthCheck) //Enable when admin-auth.js is set up.
  .get((req, res, next) => {
    AdminService.getUserList(req.app.get('db'))
      .then(users => {
        res.json(users.map(AdminService.serializeUser));
      })
      .catch(next);
  });

adminRouter
  .route('/user/:user_id')
  //.all(adminAuthCheck) //Enable when admin-auth.js is set up.
  .all(checkUserExists)
  .get((req, res) => {
    res.json(AdminService.serializeUser(res.user));
  });

async function checkUserExists(req, res, next) {
  try {
    const user = await AdminService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
    if (!user) {
      return res.status(400).json({error: 'User does not exist'})
    }
    res.user = user;
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = adminRouter;