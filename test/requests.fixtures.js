function makeRequestsArray() {
  return [
    {
      user_id: 1,
      req_type: 'verify',
      content: 'Please verify answer: 1',
    },
    {
      user_id: 1,
      req_type: 'verify',
      content: 'Please verify answer: 2',
    },
    {
      user_id: 1,
      req_type: 'verify',
      content: 'Please verify answer: 3',
    }
  ];
}

function makeMalRequestsArray() {
  const maliciousRequest = {
    user_id: 1,
    req_type: 'verify <script>alert("xss");</script',
    content: 'Please verify answer: 2 <script>alert("xss");</script',
  };
  const expectedRequest = {
    user_id: 1,
    req_type: 'verify &lt;script&gt;alert("xss");&lt;/script',
    content: 'Please verify answer: 2 &lt;script&gt;alert("xss");&lt;/script',
  };
  return {
    maliciousRequest,
    expectedRequest
  };
}

module.exports = {
  makeRequestsArray,
  makeMalRequestsArray
};
