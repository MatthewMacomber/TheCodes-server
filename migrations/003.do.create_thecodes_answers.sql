create table thecodes_answers (
  id serial primary key,
  content text not null,
  correct boolean not null,
  date_created timestamptz default now() not null
);