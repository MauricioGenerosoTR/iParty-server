module.exports = [
    `CREATE TABLE IF NOT EXISTS USERS (
      id integer not null auto_increment, 
      name varchar(45) not null,
      email varchar(60) not null,
      password varchar(64) not null,
      code_change_password bigint(20) default '0',
      token_change_password varchar(64) default null,
      primary key(id)
    )` //,
    //`CREATE TABLE IF NOT EXISTS DRINKS (
    //  id integer not null auto_increment,
    //  name varchar(45) not null,
    //  preco decimal(3,2) not null,
    //  alcoholic tinyint(1) not null,
    //  amount_for_each_people integer not null,
    //  primary key(id) 
    //) `
]