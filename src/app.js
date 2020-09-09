require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// Enviroment imports
const { NODE_ENV } = require('./config');
// Router Imports
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const codesRouter = require('./codes/codes-router');
const adminRouter = require('./admin/admin-router');
const answersRouter = require('./answers/answers-router');
const requestRouter = require('./requests/requests-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());

// Use Routers
app.use('/api/codes', codesRouter);
app.use('/api/answers', answersRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/requests', requestRouter);
app.use('/api/admin', adminRouter);

// Handle and display error messages.
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error'} };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
  next();
});

module.exports = app;