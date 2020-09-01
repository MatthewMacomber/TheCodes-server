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

  serializeCode(code) {
    return {
      id: code.id,
      title: code.title,
      content: code.content,
      date_created: new Date(code.date_created),
      user_id: code.user_id
    };
  }
};

module.exports = CodeService;