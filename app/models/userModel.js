var conn = require('../../config/db')

const VISIBLE_COLUMNS = 'id, name, email'

module.exports = () => {

    this.findAll = (callback) => {
        return conn.query(`SELECT ${VISIBLE_COLUMNS} FROM USERS`, callback)
    }

    this.findById = (id, callback) => {
        return conn.query(`SELECT ${VISIBLE_COLUMNS} FROM USERS WHERE ID = ?`, [id], callback)
    }

    this.findByEmail = (email, callback) => {
        return conn.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], callback)
    }

    this.save = (user, callback) => {
        return conn.query('INSERT INTO USERS SET ?', user, callback)
    }

    return this
}
