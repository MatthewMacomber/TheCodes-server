const bcrypt = require('bcryptjs');
const xss = require('xss');

const AdminService = {
  getUserList(db) {
    return db('thecodes_users')
      .select('*');
  },

  getUserById(db, id) {
    return db('thecodes_users')
      .where({id})
      .first();
  },

  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      nickname: xss(user.nickname),
      date_created: new Date(user.date_created)
    };
  }
};

module.exports = AdminService;