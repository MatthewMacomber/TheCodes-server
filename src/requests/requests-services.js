const xss = require('xss');

const RequestsService = {
  getRequests(db) {
    return db
      .from('thecodes_requests')
      .select('*');
  },

  getRequest(db, id) {
    return RequestsService.getRequests(db)
      .where('id', id)
      .first();
  },

  deleteRequest(db, id) {
    return db('thecodes_requests')
      .where('id', id)
      .delete();
  },

  createRequest(db, request) {
    return db
      .insert(request)
      .into('thecodes_requests')
      .returning('*')
      .then(([request]) => request);
  },

  serializeRequest(request) {
    return {
      id: request.id,
      user_id: request.user_id,
      req_type: request.req_type,
      content: xss(request.content),
      date_created: new Date(request.date_created)
    };
  }
};

module.exports = RequestsService;