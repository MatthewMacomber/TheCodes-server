const express = require('express');
const CodeService = require('./codes-services');
const {requireAuth} = require('../middleware/jwt-auth');

const codesRouter = express.Router();

codesRouter
  .route('/')
  .get((req, res, next) => {
    CodeService.getAllCodes(req.app.get('db'))
      .then(codes => {
        res.json(codes.map(CodeService.serializeCode));
      })
      .catch(next);
  })

codesRouter
  .route('/:code_id')
  //.all(requireAuth)
  .all(checkCodeExists)
  .get((req, res) => {
    res.json(CodeService.serializeCode(res.code));
  })

codesRouter
  .route('/user/:user_id')
  .get((req, res, next) => {
    CodeService.getUserCodes(req.app.get('db'), req.params.user_id)
      .then(codes => {
        res.json(codes.map(CodeService.serializeCode));
      })
      .catch(next)
  })

async function checkCodeExists(req, res, next) {
  try {
    const code = await CodeService.getById(
      req.app.get('db'),
      req.params.code_id
    )
    if (!code) {
      return res.status(400).json({error: 'Code does not exist'})
    }
    res.code = code;
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = codesRouter;