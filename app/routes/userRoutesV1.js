const userController = require('../controllers/userController')

module.exports = (router) => {
    router.get('/users', (req, res) => {
        userController.findAll(req, res)
    })

    router.get('/users/:id', (req, res) => {
        userController.findById(req, res)
    })
}