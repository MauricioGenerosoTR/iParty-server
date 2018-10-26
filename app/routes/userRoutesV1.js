const userController = require('../controllers/userController')

module.exports = (router) => {
    router.get('/users/all', (req, res) => {
        userController.findAll(req, res)
    })

    router.get('/users', (req, res) => {
        let user = req.session.user
        if (user) {
            res.status(200).send(user)
        } else {
            let decoded = jwtdecode(req.headers.authorization)
            if (decoded.id) {
                res.status(200).send({ id: decoded.id, name: decoded.name, email: decoded.email })
            }
        }
        res.status(401).end()
    })
}