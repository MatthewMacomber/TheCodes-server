const express = require('express');
const AnswersService = require('./answers-services');
const {requireAuth} = require('../middleware/jwt-auth');

const answersRouter = express.Router();

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
  .post((req, res, next) => {
    const {the_answer} = req.body;
    const answer = {content: the_answer, user_name: req.user.user_name, user_id: req.user.id};
    for (const [key, value] of Object.entries(answer)) {
      if(value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body.`
        })
      }
    }

    AnswersService.createAnswer(req.app.get('db'), answer)
      .then(answer => {
        res.json(AnswersService.serializeAnswer(answer))
      })
      .catch(next)
  });

answersRouter
  .route('/:answer_id')
  .all(requireAuth)
  .all(checkAnswerExists)
  .get((req, res) => {
    res.json(AnswersService.serializeAnswer(res.answer));
  });

async function checkAnswerExists(req, res, next) {
  try {
    const answer = await AnswersService.getUserAnswer(
      req.app.get('db'),
      req.user.id,
      req.params.answer_id
    )
    if (!answer) {
      return res.status(400).json({error: 'Answer does not exist'})
    }
    res.answer = answer;
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = answersRouter;