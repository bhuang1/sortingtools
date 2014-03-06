drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  mem integer not null,
  ops integer not null,
  who text not null
);
