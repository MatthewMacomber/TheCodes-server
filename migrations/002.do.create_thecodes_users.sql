create extension if not exists "uuid-ossp";

create table thecodes_users (
  id uuid default uuid_generate_v4(),
  user_name text not null,
  full_name text not null,
  password text not null,
  nickname text,
  date_create timestamptz default now() not null,
  date_modified timestamptz
);

alter table thecodes_codes
  add column
    user_id uuid references thecodes_users(id)
    on delete set null;