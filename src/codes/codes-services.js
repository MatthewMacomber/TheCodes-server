const xss = require('xss');

const CodeService = {
  getAllCodes(db) {
    return db
      .from('thecodes_codes')
      .select('*');
  },

  getById(db, id) {
    return CodeService.getAllCodes(db)
      .where('id', id)
      .first();
  },

  getUserCodes(db, id) {
    return CodeService.getAllCodes(db)
      .where('user_id', id);
  },

  createCode(db, code) {
    return db
      .insert(code)
      .into('thecodes_codes')
      .returning('*')
      .then(([code]) => code);
  },

  serializeCode(code) {
    return {
      id: code.id,
      title: xss(code.title),
      content: xss(code.content),
      date_created: new Date(code.date_created),
      user_id: code.user_id
    };
  }
};

module.exports = CodeService;