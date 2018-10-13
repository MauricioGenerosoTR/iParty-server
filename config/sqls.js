module.exports = [
    `CREATE TABLE IF NOT EXISTS USERS (
      id integer not null auto_increment, 
      name varchar(45) not null,
      email varchar(60) not null,
      password varchar(256) not null,
      primary key(id)
    )`
]