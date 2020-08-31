begin;

truncate
  thecodes_codes,
  thecodes_users
  restart identity cascade;

insert into thecodes_users (user_name, full_name, nickname, password)
values
  ('matt', 'Matthew Macomber', 'Matt', '')