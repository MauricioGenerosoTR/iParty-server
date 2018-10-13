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
    console.log(req.body)
    return
    userModel.save(req.body, (err, result) => {
        if (err) throw err
        res.send(result)
    })
}