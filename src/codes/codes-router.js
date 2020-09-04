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
  .route('/usercodes')
  .all(requireAuth)
  .get((req, res, next) => {
    CodeService.getUserCodes(req.app.get('db'), req.user.id)
      .then(codes => {
        res.json(codes.map(CodeService.serializeCode));
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const {the_name, the_code, the_answer} = req.body;
    const code = {title: the_name, content: the_name, user_id: req.user.id} 
    // add ", answer: the_answer" to object structure once database is changed to accept answers.
    for (const [key, value] of Object.entries(code)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body.`
        })
      }
    }

    CodeService.createCode(req.app.get('db'), code)
      .then(code => {
        res.json(CodeService.serializeCode(code));
      })
      .catch(next)
  })

codesRouter
  .route('/:code_id')
  .all(requireAuth)
  .all(checkCodeExists)
  .get((req, res) => {
    res.json(CodeService.serializeCode(res.code));
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