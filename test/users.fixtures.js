function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'demo',
      full_name: 'Matthew Macomber',
      nickname: 'Demo',
      password: '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'
    },
    {
      id: 2,
      user_name: 'bob',
      full_name: 'Bob Builder',
      nickname: 'Bob',
      password: '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'
    }
  ];
}

function makeMalUsersArray() {
  const maliciousUser = {
    id: 3,
    user_name: 'demo <script>alert("xss");</script',
    full_name: 'Matthew Macomber <script>alert("xss");</script',
    nickname: 'Demo <script>alert("xss");</script',
    password: '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'
  };
  const expectedUser = {
    id: 3,
    user_name: 'demo &lt;script&gt;alert("xss");&lt;/script',
    full_name: 'Matthew Macomber &lt;script&gt;alert("xss");&lt;/script',
    nickname: 'Demo &lt;script&gt;alert("xss");&lt;/script',
    password: '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'
  };
  return {
    maliciousUser,
    expectedUser
  };
}

module.exports = {
  makeUsersArray,
  makeMalUsersArray
};
