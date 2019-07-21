CREATE DATABASE working_assistant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create table supplier_develop_user
(
  id int auto_increment,
  name varchar(64) not null,
  password varchar(64) not null,
  manager bool not null,
  constraint supplier_develop_user_pk
    primary key (id)
);

create unique index supplier_develop_user_name_uindex
  on supplier_develop_user (name);

create table supplier_develop_task
(
  id int auto_increment,
  owner_id int not null,
  company varchar(64) not null,
  type varchar(64) not null,
  subtype varchar(64) null,
  description varchar(256) null,
  done bool not null,
  done_time date null,
  constraint supplier_develop_task_pk
    primary key (id)
);

create table supplier_develop_progress
(
  id int auto_increment,
  task_id int not null,
  author_id int not null,
  content varchar(64) not null,
  comment varchar(256) null,
  timestamp date not null,
  constraint supplier_develop_progress_pk
    primary key (id)
);