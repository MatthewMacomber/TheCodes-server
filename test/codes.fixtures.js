function makeCodesArray() {
  return [
    {
      id: 1,
      title: 'Super Code 1',
      user_id: '1',
      user_name: 'demo',
      content: 'jr;;p ept;f@',
      answer: 'Hello World!',
    },
    {
      id: 2,
      title: 'Cuper Code 2',
      user_id: '1',
      user_name: 'demo',
      content: '!dlroW olleH',
      answer: 'Hello World!',
    },
    {
      id: 3,
      title: 'Super Code 3',
      user_id: '2',
      user_name: 'bob',
      content: 'jk, no codes here lol',
      answer: 'No answer cause not real code :-P',
    }
  ];
}

function makeMalCodesArray() {
  const maliciousCode = {
    id: 4,
    title: 'Super Code 1 <script>alert("xss");</script',
    user_id: '1',
    user_name: 'demo',
    content: 'jr;;p ept;f@ <script>alert("xss");</script',
    answer: 'Hello World! <script>alert("xss");</script',
  };
  const expectedCode = {
    id: 4,
    title: 'Super Code 1 &lt;script&gt;alert("xss");&lt;/script',
    user_id: '1',
    user_name: 'demo',
    content: 'jr;;p ept;f@ &lt;script&gt;alert("xss");&lt;/script',
    answer: 'Hello World! &lt;script&gt;alert("xss");&lt;/script',
  };
  return {
    maliciousCode,
    expectedCode
  };
}

module.exports = {
  makeCodesArray,
  makeMalCodesArray
};
