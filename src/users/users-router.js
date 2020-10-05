const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const parseBody = express.json();

usersRouter
  .post('/', parseBody, (req, res, next) => {
    const {password, user_name, full_name, nickname = ''} = req.body;

    for (const field of ['full_name', 'user_name', 'password']) {
      if (!req.body[field]) {
        return res.status(401).json({error: `Missing '${field}' in request body`});
      }
    }
    
    if (user_name.startsWith(' ') || user_name.endsWith(' ')) {
      return res.status(402).json({error: 'Username cannot start or end with spaces'});
    }

    const passwordError = UsersService.validatePassword(password);
    if (passwordError !== null) {
      return res.status(403).json({error: passwordError});
    }

    UsersService.hasUserWithUsername(req.app.get('db'), user_name)
      .then(hasUserWithUsername => {
        if (hasUserWithUsername) {
          return res.status(404).json({error: 'Username already taken'});
        }
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              nickname
            };
            return UsersService.insertUser(req.app.get('db'), newUser)
              .then(user => {
                res.status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

usersRouter
  .get('/:user_id', (req, res, next) => {
    const user_id = req.params.user_id;
    UsersService.getUserName(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          return res.status(400).json({error: 'User not found'});
        }
        return res.status(200).json(user.user_name);
      })
      .catch(next);
  });



module.exports = usersRouter;
