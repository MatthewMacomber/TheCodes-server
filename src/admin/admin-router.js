const express = require('express');
const AdminService = require('./admin-service');
const {adminAuthCheck} = require('./admin-auth');

const adminRouter = express.Router();
const parseBody = express.json();

adminRouter
  .route('/')
  //.all(adminAuthCheck) //Enable one admin-auth.js is set up.
  .get((req, res, next) => {
    //Currently do nothing but return a success.
    return res.status(200);
  });

adminRouter
  .route('/users')
  .get((req, res, next) => {
    AdminService.getUserList(req.app.get('db'))
      .then(users => {
        res.json(users.map(AdminService.serializeUsers));
      })
      .catch(next);
  });

adminRouter
  .route('/user/:user_id')
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