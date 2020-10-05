module.exports = { // TODO Revert back to uncommented form.
  PORT: process.env.PORT || 8000,
  NODE_ENV: 'development', //process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
  DATABASE_URL: 'postgresql://thecodes@localhost/thecodes', //process.env.DATABASE_URL || 'postgresql://thecodes@localhost/thecodes',
  TEST_DATABASE_URL: 'postgresql://thecodes@localhost/thecodes', //process.env.TEST_DATABASE_URL || 'postgresql://thecodes@localhost/thecodes-test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
};