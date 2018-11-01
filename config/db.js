var mysql = require('mysql')
var sqls = require('./sqls')

var conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

conn.connect((err) => {
    if (err) throw err
    console.log(`Connected with database`);

    sqls.forEach((sql) => {
        conn.query(sql, (err, result) => {
            if (err) throw err
        })
    })
})

module.exports = conn