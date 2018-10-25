const userController = require('../controllers/userController')

module.exports = (router) => {
    router.get('/users/all', (req, res) => {
        userController.findAll(req, res)
    })

    router.get('/users', (req, res) => {
        let user = req.session.user
        if (user){
            res.status(200).send(user)
        } else {
            res.status(401).end()
        }
    })
}