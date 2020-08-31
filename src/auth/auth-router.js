const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const parseBody = express.json();

authRouter
  .post('/login', parseBody, (req, res, next) => {
    const {user_name, password} = req.body;
    const loginUser = {user_name, password};

    for (const [key, value] of Object.entries(loginUser)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    AuthService.getUserWithUsername(req.app.get('db'), loginUser.user_name)
      .then(dbUser => {
        if (!dbUser) {
          return res.status(400).json({
            error: 'Incorrect username or password'
          });
        }
        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compare => {
            if (!compare) {
              return res.status(400).json({
                error: 'Incorrect username or password'
              });
            }
            const sub = dbUser.user_name;
            const payload = {user_id: dbUser.user_id};
            res.send({authToken: AuthService.createJwt(sub, payload)});
          });
      })
      .catch(next);
  });

module.exports = authRouter;
