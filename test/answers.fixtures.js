function makeAnswersArray() {
  return [
    {
      id: 1,
      user_id: 1,
      code_id: 1,
      user_name: 'demo',
      content: 'jr;;p ept;f@',
      correct: true,
    },
    {
      id: 2,
      user_id: 1,
      code_id: 2,
      user_name: 'demo',
      content: '!dlroW olleH',
      correct: false,
    },
    {
      id: 3,
      user_id: 2,
      code_id: 1,
      user_name: 'bob',
      content: 'jk, no codes here lol',
      correct: true,
    }
  ];
}

function makeMalAnswersArray() {
  const maliciousAnswer = {
    id: 4,
    user_id: 1,
    code_id: 1,
    user_name: 'demo',
    content: 'jr;;p ept;f@ <script>alert("xss");</script',
    correct: true,
  };
  const expectedAnswer = {
    id: 4,
    user_id: 1,
    code_id: 1,
    user_name: 'demo',
    content: 'jr;;p ept;f@ &lt;script&gt;alert("xss");&lt;/script',
    correct: true,
  };
  return {
    maliciousAnswer,
    expectedAnswer
  };
}

module.exports = {
  makeAnswersArray,
  makeMalAnswersArray
};
