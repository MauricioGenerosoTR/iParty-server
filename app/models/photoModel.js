var conn = require('../../config/db')

const VISIBLE_COLUMNS = 'id, filename, user_id'

module.exports = () => {

    this.findByUserId = (id, callback) => {
        return conn.query(`SELECT ${VISIBLE_COLUMNS} FROM PHOTOS WHERE user_id = ?`, [id], callback)
    }

    this.save = (file, callback) => {
        return conn.query('INSERT INTO PHOTOS SET ?', file, callback)
    }

    return this
}