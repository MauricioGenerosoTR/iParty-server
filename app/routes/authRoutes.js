const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userController = require('../controllers/userController')
const secret = require('../../secret')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/

module.exports = (router) => {

    router.post('/login', (req, res, next) => {
        const email = req.body.email || ''
        const password = req.body.password || ''

        userController.findByEmail(email, (err, results) => {
            if (err) throw err
            if (results[0] && bcrypt.compareSync(password, results[0].password)) {
                const token = jwt.sign(results[0], secret.authSecret, {
                    expiresIn: "1 day"
                })
                delete results[0]['password']
                req.session.user = results[0]
                res.setHeader('Authorization', 'Bearer ' + token)
                res.status(200).send({
                    token: 'Bearer ' + token
                })
            } else {
                return res.status(401).send({
                    errors: ['Invalid User/Password']
                })
            }
        })
    })

    router.post('/validateToken', (req, res) => {
        let token = req.body.token || ''
        token = token.replace('Bearer ', '')

        jwt.verify(token, secret.authSecret, function (err, decoded) {
            if (err) return res.status(400).send(err)
            return res.status(200).send()
        })
    })

    router.post('/signup', (req, res) => {
        const name = req.body.name || ''
        const email = req.body.email || ''
        const password = req.body.password || ''
        const confirmPassword = req.body.confirmPassword || ''

        if (!email.match(emailRegex)) {
            return res.status(400).send({
                errors: ['The informed e-mail is invalid']
            })
        }
        /*if (!password.match(passwordRegex)) {
            return res.status(400).send({
                errors: [
                    `Password should be: a upercase letter, a lowercase letter, a number, 
                a special character(@# $ % ) and length between 6 - 12.`
                ]
            })
        }*/
        const salt = bcrypt.genSaltSync()
        const passwordHash = bcrypt.hashSync(password, salt)
        if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
            return res.status(400).send({
                errors: ['Passwords not match']
            })
        }

        userController.findByEmail(email, (err, results) => {
            if (err) throw err
            if (results.length != 0) {
                return res.status(400).send({
                    errors: ['User already exists']
                })
            } else {
                req.body = {
                    name,
                    email,
                    password: passwordHash
                }
                userController.save(req, res)
            }
        })
    })
}