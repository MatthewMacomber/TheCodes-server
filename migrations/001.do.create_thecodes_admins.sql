drop table if exists thecodes_admins cascade;

create table thecodes_admins (
  id serial primary key,
  user_name text not null unique,
  full_name text not null,
  password text not null,
  nickname text,
  date_created timestamptz default now() not null,
  date_modified timestamptz
);