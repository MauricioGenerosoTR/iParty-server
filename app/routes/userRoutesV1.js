const userController = require('../controllers/userController')
const jwtdecode = require('jwt-decode')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const AWS = require('aws-sdk')
const fs = require('fs')
const sharp = require('sharp')

const BUCKET_NAME = process.env.BUCKET_NAME || ''
const IAM_USER_KEY = process.env.BUCKET_ACCESS_KEY_ID || ''
const IAM_USER_SECRET = process.env.BUCKET_ACCESS_KEY_SECRET || ''

AWS.config.update({
    region: 'sa-east-1',
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
})

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

    router.post('/users/upload', multipartMiddleware, (req, res) => {
        let token = req.headers.authorization || ''
        token = token.replace('Bearer ', '')

        jwt.verify(token, secret.authSecret, function (err, decoded) {
            if (err) return res.status(400).send(err)
            const s3 = new AWS.S3()

            const file = req.files.file

            sharp(fs.readFileSync(file.path)).resize(512, 512).png().toBuffer((err, buffer, info) => {
                let startTime = new Date()
                let partNum = 0
                const partSize = 1024 * 1024 * 5 // 5mb chunks except last part
                let numPartsLeft = Math.ceil(buffer.length / partSize)
                const maxUploadTries = 3
                const extension = 'png'
                const filename = `user_${decoded.id}.${extension}`
                const multipartParams = {
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    ContentType: file.type
                }

                let multipartMap = {
                    Parts: []
                }

                s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
                    if (mpErr) return console.error('Error!', mpErr)
                    // console.log('Got upload ID', multipart.UploadId)

                    for (var start = 0; start < buffer.length; start += partSize) {
                        partNum++
                        var end = Math.min(start + partSize, buffer.length)
                        var partParams = {
                            Body: buffer.slice(start, end),
                            Bucket: multipartParams.Bucket,
                            Key: multipartParams.Key,
                            PartNumber: String(partNum),
                            UploadId: multipart.UploadId
                        }
                        uploadPart(s3, multipart, partParams)
                    }
                })

                function completeMultipartUpload(s3, doneParams) {
                    s3.completeMultipartUpload(doneParams, function (err, data) {
                        if (err) return console.error('An error occurred while completing multipart upload')
                        var delta = (new Date() - startTime) / 1000
                        console.log('Completed upload in', delta, 'seconds')
                        return res.status(200).send(req.body['file'])
                        // console.log('Final upload data:', data)
                    })
                }

                function uploadPart(s3, multipart, partParams, tryNum) {
                    var tryNum = tryNum || 1
                    s3.uploadPart(partParams, function (multiErr, mData) {
                        // console.log(mData)
                        // console.log('started')
                        if (multiErr) {
                            console.log('Upload part error:', multiErr)

                            if (tryNum < maxUploadTries) {
                                console.log('Retrying upload of part: #', partParams.PartNumber)
                                uploadPart(s3, multipart, partParams, tryNum + 1)
                            } else {
                                console.log('Failed uploading part: #', partParams.PartNumber)
                            }
                            // return
                        }

                        multipartMap.Parts[this.request.params.PartNumber - 1] = {
                            ETag: mData.ETag,
                            PartNumber: Number(this.request.params.PartNumber)
                        }
                        // console.log('Completed part', this.request.params.PartNumber)
                        // console.log('mData', mData)
                        if (--numPartsLeft > 0) return // complete only when all parts uploaded

                        var doneParams = {
                            Bucket: multipartParams.Bucket,
                            Key: multipartParams.Key,
                            MultipartUpload: multipartMap,
                            UploadId: multipart.UploadId
                        }

                        // console.log('Completing upload...')
                        completeMultipartUpload(s3, doneParams)
                    })
                }
            })
        })
    })
}