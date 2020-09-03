begin;

truncate
  thecodes_admins,
  thecodes_codes,
  thecodes_users
  restart identity cascade;

insert into thecodes_admins (user_name, full_name, nickname, password)
values
  ('admin', 'Matthew Macomber', 'admin', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'); -- test password is: P4ssword!

insert into thecodes_users (user_name, full_name, nickname, password)
values
  ('matt', 'Matthew Macomber', 'Matt', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'), -- test password is: P4ssword!
  ('bob', 'Bob Builder', 'Bob', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'); -- test password is: P4ssword!

insert into thecodes_codes (title, user_id, content)
values
  ('Super Code 1', 1, 'jr;;p ept;f@'),
  ('Super Code 2', 2, 'jk, no codes here lol');

commit;