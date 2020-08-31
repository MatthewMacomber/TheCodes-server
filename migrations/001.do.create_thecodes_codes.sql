create table thecodes_codes (
  id serial primary key,
  title text not null,
  content text,
  date_created timestamptz default now() not null,
);