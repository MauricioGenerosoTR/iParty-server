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

    this.findByEmailAndTokenAndCode = (email, token, code, callback) => {
        return conn.query(`SELECT * FROM USERS WHERE EMAIL = ? AND TOKEN_CHANGE_PASSWORD = ? AND CODE_CHANGE_PASSWORD = ?`, [email, token, code], callback)
    }

    this.save = (user, callback) => {
        return conn.query('INSERT INTO USERS SET ?', user, callback)
    }

    this.update = (user, callback) => {
        let sql = `UPDATE USERS
                      SET name = '${user.name}',
                          email = '${user.email}',
                          password = '${user.password}',
                          code_change_password = ${user.code_change_password},
                          token_change_password = '${user.token_change_password}'
                    WHERE id = ${user.id}
        `
        return conn.query(sql, callback)
    }

    return this
}