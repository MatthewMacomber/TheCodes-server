create table thecodes_requests (
  id serial primary key,
  user_id integer not null,
  req_type text not null,
  content text not null,
  date_created timestamptz default now() not null
)