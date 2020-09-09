begin;

truncate
  thecodes_admins,
  thecodes_codes,
  thecodes_answers,
  thecodes_users
  restart identity cascade;

insert into thecodes_admins (user_name, full_name, nickname, password)
values
  ('admin', 'Matthew Macomber', 'admin', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'); -- test password is: P4ssword!

insert into thecodes_users (user_name, full_name, nickname, password)
values
  ('matt', 'Matthew Macomber', 'Matt', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'), -- test password is: P4ssword!
  ('bob', 'Bob Builder', 'Bob', '$2y$12$XN7iEugoKSJPFEoBQtikaOIfzZShAhWDDiGjBYAg0bgKsXuRz3zzG'); -- test password is: P4ssword!

insert into thecodes_codes (title, user_id, user_name, content, answer)
values
  ('Super Code 1', 1, 'matt', 'jr;;p ept;f@', 'Hello World!'),
  ('Super Code 2', 2, 'bob', 'jk, no codes here lol', 'No answer cause not real code :-P');

insert into thecodes_answers (content, correct, code_id, user_id, user_name)
values
  ('Hello World!', true, 1, 1, 'matt'), -- test with correct answer
  ('Ah,su dudes!', false, 1, 1, 'matt'); -- test with incorrect answer

insert into thecodes_requests (user_id, req_type, content)
values
  (1, 'verify', 'Please verify answer: 2');

commit;