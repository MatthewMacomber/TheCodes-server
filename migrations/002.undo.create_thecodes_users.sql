alter table thecodes_codes
  drop column if exists user_id;

drop table if exists thecodes_users cascade;