const xss = require('xss');

const AnswerService = {
  getAllAnswers(db){
    return db
      .from('thecodes_answers')
      .select('*');
  },
  
  getUserAnswers(db, user_id) {
    return AnswerService.getAllAnswers(db)
      .where('user_id', user_id);
  },

  getUserAnswer(db, user_id, id) {
    return this.getUserAnswers(db, user_id)
      .where('id', id)
      .first();
  },

  createAnswer(db, answer) {
    return db
      .insert(answer)
      .into('thecodes_answers')
      .returning('*')
      .then(([answer]) => answer);
  },

  serializeAnswer(answer) {
    return {
      id: answer.id,
      content: xss(answer.content),
      code_id: answer.content,
      date_created: new Date(answer.date_created),
      user_name: answer.user_name
    };
  }
};


module.exports = AnswerService;
