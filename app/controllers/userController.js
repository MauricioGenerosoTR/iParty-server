var userModel = require('../../app/models/userModel')()

module.exports.index = (req, res) => {
    userModel.all((err, result) => {
        if (err) throw err
        res.send(result)
    })
}

module.exports.findById = (req, res) => {
    userModel.findById(req.params.id, (err, result) => {
        if (err) throw err
        res.send(result)
    })
}

module.exports.save = (req, res) => {

    req.assert('name', 'Preencha o nome').notEmpty()
    req.assert('name', '3 to 45  characters required').len(3, 45)
    req.assert('email', 'Preencha o e-mail').isEmpty()
    req.assert('email', 'E-mail inválido').isEmail()
    req.assert('password', '6 to 20  characters required').len(6, 20)

    var validationErrors = req.validationErrors()
    if (validationErrors) {
        // tratar erros
    }

    userModel.save(req.body, (err, result) => {
        if (err) throw err
        res.send(result)
    })
}