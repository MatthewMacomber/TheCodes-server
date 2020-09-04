alter table thecodes_codes
  drop column if exists user_id,
  drop column if exists user_name;

drop table if exists thecodes_users cascade;