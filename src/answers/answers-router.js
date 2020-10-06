const express = require('express');
const AnswersService = require('./answers-services');
const CodeService = require('../codes/codes-services');
const {requireAuth} = require('../middleware/jwt-auth');
const AdminAuth = require('../admin/admin-auth');

const answersRouter = express.Router();
const parseBody = express.json();

answersRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    // return list of current users answers
    AnswersService.getUserAnswers(req.app.get('db'), req.user.id)
      .then(answers => {
        res.json(answers.map(AnswersService.serializeAnswer));
      })
      .catch(next)
  })
  .post(parseBody, (req, res, next) => {
    const {the_answer, code_id} = req.body;
    const answer = {content: the_answer, user_name: req.user.user_name, user_id: req.user.id, code_id: code_id};
    for (const [key, value] of Object.entries(answer)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body.`
        });
      }
    }

    CodeService.getById(req.app.get('db'), code_id)
      .then(retCode => {
        if (answer.content === retCode.answer) {
          answer.correct = true;
        } else {
          answer.correct = false;
        }

        AnswersService.createAnswer(req.app.get('db'), answer)
          .then(answer => {
            res.json(AnswersService.serializeAnswer(answer));
          })
          .catch(next);
      });
  });

answersRouter // Return list of all answers, for Admin use.
  .route('/list')
  .all(AdminAuth)
  .all(adminAuthCheck)
  .get((req, res, next) => {
    AnswersService.getAllAnswers(req.app.get('db'))
      .then(answers => {
        res.json(answers.map(AnswersService.serializeAnswer));
      })
      .catch(next);
  });

answersRouter
  .route('/:answer_id')
  .all(requireAuth)
  .all(checkAnswerExists)
  .get((req, res) => {
    res.json(AnswersService.serializeAnswer(res.answer));
  });

function adminAuthCheck(req, res, next) {
  if (req.decoded.role != 'admin') {
    res.status(403).json({error: 'Permission denied'});
  } else {
    next();
  }
}

async function checkAnswerExists(req, res, next) {
  try {
    const answer = await AnswersService.getUserAnswer(
      req.app.get('db'),
      req.user.id,
      req.params.answer_id
    )
    if (!answer) {
      return res.status(400).json({error: 'Answer does not exist'});
    }
    res.answer = answer;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = answersRouter;