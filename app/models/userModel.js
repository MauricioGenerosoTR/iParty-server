var conn = require('../../config/db')

module.exports = () => {
    this.all = (callback) => {
        return conn.query(`SELECT * FROM USERS`, callback)
    }

    this.findById = (id, callback) => {
        return conn.query('SELECT * FROM USERS WHERE ID = ?', id, callback)
    }

    this.save = (user, callback) => {
        return conn.query('INSERT INTO USERS SET ?', user, callback)
    }

    return this
}