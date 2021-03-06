drop table if exists thecodes_users cascade;

create table thecodes_users (
  id serial primary key,
  user_name text not null unique,
  full_name text not null,
  password text not null,
  nickname text,
  date_created timestamptz default now() not null,
  date_modified timestamptz
);

alter table thecodes_codes
  add column
    user_id integer references thecodes_users(id)
    on delete set null,
  add column
    user_name text references thecodes_users(user_name)
    on delete set null;

alter table thecodes_answers
  add column
    code_id integer references thecodes_codes(id)
    on delete set null,
  add column
    user_id integer references thecodes_users(id)
    on delete set null,
  add column
    user_name text references thecodes_users(user_name)
    on delete set null;