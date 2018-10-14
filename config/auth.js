const jwt = require('jsonwebtoken')
const secret = require('../secret')

module.exports = (req, res, next) => {
    // CORS preflight request
    if (req.method === 'OPTIONS') {
        next()
    } else {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(403).send({ errors: ['No token provided.'] })
        }
        if (!token.startsWith('BAERER ')) {
            return res.status(403).send({ errors: ['Invalid token format.'] })
        }
        jwt.verify(token.replace('BAERER ', ''), secret.authSecret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    errors: ['Failed to authenticate token.']
                })
            } else {
                next()
            }
        })
    }
}