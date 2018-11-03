const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userController = require('../controllers/userController')
const secret = require('../../secret')
const nodemailer = require('nodemailer');

const emailServer = process.env.EMAIL || 'ipartyapp2018@gmail.com'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailServer,
        pass: process.env.EMAIL_PASSWORD || 'iPartyUnesc'
    }
})

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

        jwt.verify(token, secret.authSecret, function(err, decoded) {
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

    router.post('/forgetpassword', (req, res, next) => {
        const email = req.body.email || ''

        userController.findByEmail(email, (err, results) => {
            if (err) throw err
            if (results[0]) {
                let code = Math.floor(Math.random() * 90000) + 10000
                let mailOptions = {
                    from: emailServer,
                    to: email,
                    subject: 'Change Password',
                    text: 'The code for you change the password is: ' + code
                };

                const salt = bcrypt.genSaltSync()
                const token = bcrypt.hashSync(new Date().toString(), salt)

                results[0].code_change_password = code
                results[0].token_change_password = token

                userController.update(results[0], (err, results) => {
                    if (err) throw err

                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) throw err
                        res.status(200).send({ token: token })
                    })
                })
            } else {
                return res.status(404).send({
                    errors: ['Email not found']
                })
            }
        })
    })

    router.post('/forgetpassword/validateCode', (req, res, next) => {
        const email = req.body.email || ''
        const token = req.body.token || ''
        const code = req.body.code || ''

        if (email && token && code) {
            userController.findByEmailAndTokenAndCode(email, token, code, (err, results) => {
                if (err) throw err

                if (results[0]) {
                    return res.status(200).end()
                }
                return res.status(400).end()
            })
        } else {
            return res.status(400).end()
        }
    })

    router.post('/changePassword', (req, res, next) => {
        const email = req.body.email || ''
        const token = req.body.token || ''
        const code = req.body.code || ''
        const password = req.body.password || ''
        const confirmPassword = req.body.confirmPassword || ''

        const salt = bcrypt.genSaltSync()
        const passwordHash = bcrypt.hashSync(password, salt)
        if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
            return res.status(400).send({
                errors: ['Passwords not match']
            })
        }

        if (email && token && code && password && confirmPassword) {
            userController.findByEmailAndTokenAndCode(email, token, code, (err, results) => {
                if (err) throw err
                if (results[0]) {
                    results[0].password = passwordHash
                    results[0].code_change_password = 0
                    results[0].token_change_password = null

                    const email = results[0].email

                    userController.update(results[0], (err, results) => {
                        if (err) throw err

                        transporter.sendMail({
                            from: emailServer,
                            to: email,
                            subject: 'Password changed',
                            text: 'Your password was changed with succcess.'
                        }, function(err, info) {
                            if (err) throw err
                            res.status(200).end()
                        })
                    })
                } else {
                    return res.status(400).end()
                }
            })
        } else {
            return res.status(400).end()
        }
    })
}