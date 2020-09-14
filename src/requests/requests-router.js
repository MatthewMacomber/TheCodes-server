const express = require('express');
const RequestsService = require('./requests-services');
const {requireAuth} = require('../middleware/jwt-auth');

const requestsRouter = express.Router();
const parseBody = express.json();

requestsRouter
  .route('/')
  .all(requireAuth)
  .get(adminAuthCheck, (req, res, next) => {
    // return list of all requests (admin only)
    RequestsService.getRequests(req.app.get('db'))
      .then(requests => {
        res.json(requests.map(RequestsService.serializeRequest));
      })
      .catch(next);
  })
  .post(parseBody ,(req, res, next) => {
    const {req_type, content} = req.body;
    const request = {req_type: req_type, content: content, user_id: req.user.id};
    for (const [key, value] of Object.entries(request)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body.`
        })
      }
    }

    RequestsService.createRequest(req.app.get('db'), request)
      .then(request => {
        res.json(RequestsService.serializeRequest(request));
      })
      .catch(next);
  });

requestsRouter
  .route('/:request_id')
  .all(requireAuth)
  .all(checkRequestExists)
  .get((req, res) => {
    res.json(RequestsService.serializeRequest(res.request));
  })
  .delete((req, res) => {
    const request_id = req.params.request_id;
    RequestsService.deleteRequest(req.app.get('db'), request_id)
      .then(numRowsAffected => {
        if (!numRowsAffected) {
          res.status(404).send({error: 'Request not found'});
        }
        res.status(204).end();
      })
      .catch(next);
  });

function adminAuthCheck(req, res, next) {
  if (req.decoded.role != 'admin') {
    res.status(403).json({error: 'Permission denied'});
  } else {
    next();
  }
}

async function checkRequestExists(req, res, next) {
  try {
    const request = await RequestsService.getRequest(
      req.app.get('db'),
      req.params.request_id
    )
    if (!request) {
      return res.status(400).json({error: 'Request does not exist'});
    }
    res.request = request;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requestsRouter;