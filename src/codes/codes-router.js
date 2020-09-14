const express = require('express');
const CodeService = require('./codes-services');
const {requireAuth} = require('../middleware/jwt-auth');

const codesRouter = express.Router();
const parseBody = express.json();

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
      .catch(next);
  })
  .post(parseBody, (req, res, next) => {
    const {code_name, the_code, the_answer} = req.body;
    const code = {title: code_name, content: the_code, answer: the_answer, user_name: req.user.user_name};
    for (const [key, value] of Object.entries(code)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body.`
        });
      }
    }

    CodeService.createCode(req.app.get('db'), code)
      .then(code => {
        res.json(CodeService.serializeCode(code));
      })
      .catch(next);
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
      return res.status(400).json({error: 'Code does not exist'});
    }
    res.code = code;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = codesRouter;