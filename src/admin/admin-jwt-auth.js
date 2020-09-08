const AdminAuth = require('./admin-auth');

const requireAuth = (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({error: 'Missing bearer token'});
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AdminAuth.verifyJwt(bearerToken);
    AdminAuth.getAdminWithUsername(req.app.get('db'), payload.sub)
      .then(user => {
        if (!user) {
          return res.status(401).json({error: 'Unauthorized request - user'});
        }
        req.decoded = payload;
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  } catch(error) {
    console.log(error);
    res.status(401).json({error: 'Unauthorized request - other'});
  }
};

module.exports = {requireAuth};
