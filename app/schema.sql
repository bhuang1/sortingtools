drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  who text not null,
  steps integer not null,
  sort text not null
);
