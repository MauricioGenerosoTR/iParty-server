const photoController = require('../controllers/photoController')
const multer = require('multer')
const upload = multer({ dest: 'files/' })
const jwtdecode = require('jwt-decode')
const fileSystem = require('fs')
const path = require('path')

module.exports = (router) => {

    router.get('/users/photo', (req, res) => {
        let decoded = jwtdecode(req.headers.authorization)

        photoController.findByUserId(decoded.id, (err, results) => {
            if (err) throw err
            if (results.length == 0) {
                return res.status(404).send({ errors: ['Photo not found'] })
            } else {
                let filePath = path.join(__dirname, '../../files/' + results[0].filename)
                let stat = fileSystem.statSync(filePath);

                res.writeHead(200, {
                    'Content-Length': stat.size
                });

                let readStream = fileSystem.createReadStream(filePath);
                readStream.pipe(res);
            }
        })
    })

    router.post('/users/photo', upload.single('file'), (req, res) => {
        if (!req.file.mimetype.startsWith('image/')) {
            res.status(400).send({ reason: `The file isn't an image` })
        }

        let decoded = jwtdecode(req.headers.authorization)
        photoController.findByUserId(decoded.id, (err, results) => {
            if (err) throw err
            if (results.length != 0) {
                return res.status(404).send({ errors: ['Photo already exists'] })
            }
        })

        photoController.save(req, res)
    })

    router.put('/users/photo', upload.single('file'), (req, res) => {
        if (!req.file.mimetype.startsWith('image/')) {
            res.status(400).send({ reason: `The file isn't an image` })
        }

        let decoded = jwtdecode(req.headers.authorization)
        photoController.findByUserId(decoded.id, (err, results) => {
            if (err) throw err
            if (results.length == 0) {
                return res.status(404).send({ errors: ['Photo not found'] })
            }
            // remove and save a new photo
        })
    })

    router.delete('/users/photo', (req, res) => {
        let decoded = jwtdecode(req.headers.authorization)
            // removed file of the user
    })
}