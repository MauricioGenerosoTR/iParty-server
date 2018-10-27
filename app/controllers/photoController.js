const photoModel = require('../../app/models/photoModel')()
const jwtdecode = require('jwt-decode')

module.exports.findByUserId = (id, callback) => {
    return photoModel.findByUserId(id, callback)
}

module.exports.save = (req, res) => {
    let decoded = jwtdecode(req.headers.authorization)
    let file = {
        fileName: req.file.filename,
        user_id: decoded.id
    }

    photoModel.save(file, (err, results) => {
        if (err) throw err
        res.status(201).send(results)
    })
}