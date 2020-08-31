# The Codes Server

This is the backend server for the "The Codes" web app.

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

- To seed the database for development: `psql -U thecodes -d thecodes -a -f seeds/seed thecodes_tables.sql`
- To clear seed data: `psql -U thecodes -d thecodes -a -f seeds/trunc thecodes_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

# thecodes-server
