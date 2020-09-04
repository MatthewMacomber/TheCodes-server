create table thecodes_codes (
  id serial primary key,
  title text not null,
  content text not null,
  answer text not null,
  date_created timestamptz default now() not null
);