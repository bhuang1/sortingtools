drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  steps integer not null,
  sort text not null
);
