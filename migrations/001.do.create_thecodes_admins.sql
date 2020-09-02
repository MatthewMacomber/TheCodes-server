create table thecodes_admins (
  id serial primary key,
  user_name text not null unique,
  full_name text not null,
  password text not null,
  nickname text,
  date_create timestamptz default now() not null,
  date_modified timestamptz
);