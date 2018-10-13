var userController = require('../../app/controllers/userController')

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send(`It's Working.`);
    })

    app.get('/list', (req, res) => {
        userController.index(req, res)
    })

    app.get('/list/:id', (req, res) => {
        userController.findById(req, res)
    })

    app.post('/save', (req, res) => {
        userController.save(req, res)
    })
}