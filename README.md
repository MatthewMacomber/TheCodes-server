# The Codes Server

This is the backend server for the "The Codes" web app.

Live version of server: https://warm-harbor-99058.herokuapp.com/

Live demo version of client: https://thecodes-client.vercel.app
Registering and Login work on demo. Demo account: Username:`demo` Password:`P4ssword!`.

Admin panel is accessable via: https://thecodes-client.vercel.app/admin/panel
Admin demo account is: Username:`admin` Password:`P4ssword!`


## Set Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb thecodes`, `createdb thecodes-test`
- Create database user: `createuser thecodes`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE thecodes TO thecodes`
  - `GRANT ALL PRIVILEGES ON DATABASE "thecodes-test" TO thecodes`
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values.
- Bootstrap development database: `npm run migrate`
- Bootstrap test database: `npm run migrate:test`

### Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
    - OS X, Homebrew: `/usr/local/var/postgres/postgresql.conf`
2. Uncomment the `timezone` line and set it to `UTC` as follows:

```
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Sample Data

- To seed the database for development: `psql -U thecodes -d thecodes -a -f seeds/seed.thecodes_tables.sql`
- To clear seed data: `psql -U thecodes -d thecodes -a -f seeds/trunc.thecodes_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## API Endpoints

- `/api/codes`
  - GET `/` Returns list of all codes. Returns array of objects.
  - GET `/usercodes` Requires auth. Returns list of authed user codes. Returns array of objects.
  - POST `/usercodes` Requires auth. Create a new code under authed user. Returns code object.
  - GET `/:code_id` Requires auth. Returns requested code. Returns code Object.
- `/api/answers`
  - GET `/` Requires auth. Returns list of authed user answers. Returns array of objects.
  - POST `/` Requres auth. Create a new answer under authed user. Returns answer object.
  - GET `/list` Requires admin auth. Returns list of all answers. Returns array of objects.
  - GET `/:answer_id` Requires auth. Returns request answer for authed user. Returns answer object.
- `/api/auth`
  - POST `/login` Verifies passed login credentials. Returns JWT object if successful login.
- `/api/users`
  - POST `/` Regisister new user after verifying passed user data. Returns new user id and user data if succesful.
  - GET `/:user_id` Returns username of requested user_id. Returns string.
- `/api/requests`
  - GET `/` Requires admin auth. Returns list of all requests. Return array of objects.
  - POST `/` Requires auth. Creates a new request. Returns request object.
  - GET `/:request_id` Requires admin auth. Return requested request. Returns request object.
  - DELETE `/:request_id` Requires admin auth. Deletes specified request. Returns status 204.
- `/api/admin`
  - POST `/` Admin specific login. Returns JWT object if successful login.
  - GET `/users` Requires admin auth. Returns list of all users. Returns array of objects.
  - GET `/user/:user_id` Requires admin auth. Return requested user. Returns user object.
- `/`
  - GET `/` Returns 'The Codes Server.'

## Technology

- Node.js
- bcryptjs
- cors
- dotenv
- express
- helmet
- jsonwebtoken
- knex
- morgan
- pg
- postgrator-cli
- treeize
- uuid
- xss
- PostgreSQL

# thecodes-server
